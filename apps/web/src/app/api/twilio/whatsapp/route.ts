import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@repo/shared/supabase/server";
import { executeCallIntake, ValidationIssue } from "@repo/langgraph";

/**
 * POST /api/twilio/whatsapp
 *
 * Twilio webhook for incoming WhatsApp messages.
 * Flow:
 * 1. Receive message from customer
 * 2. Store in call_transcripts (using message as "transcript")
 * 3. Run AI extraction and validation
 * 4. If validation has errors (missing required info), ask follow-up questions
 * 5. If validation passes, create order draft and confirm
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    console.log("formData", formData);

    // Extract Twilio WhatsApp data
    const from = formData.get("From") as string; // e.g., "whatsapp:+923001234567"
    const to = formData.get("To") as string;
    const body = formData.get("Body") as string; // The message text
    const messageSid = formData.get("MessageSid") as string;

    console.log("[WhatsApp Webhook]", {
      from,
      to,
      messageSid,
      body: body?.substring(0, 100) + "...",
    });

    if (!body || !from) {
      return createTwiMLResponse("Sorry, I couldn't process your message.");
    }

    const supabase = await createServerClient();
    const customerPhone = extractPhone(from);

    // Check if this is a follow-up response to a pending conversation
    const { data: existingConversation } = await supabase
      .from("call_transcripts")
      .select("id, transcript")
      .eq("customer_phone", customerPhone)
      .eq("awaiting_response", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let fullTranscript = body;
    let transcriptId: string;

    if (existingConversation) {
      // This is a follow-up response - append to existing conversation
      fullTranscript = `${existingConversation.transcript}\n\nCustomer reply: ${body}`;
      transcriptId = existingConversation.id;

      // Update the existing transcript
      await supabase
        .from("call_transcripts")
        .update({
          transcript: fullTranscript,
          awaiting_response: false,
        })
        .eq("id", transcriptId);

      console.log(
        "[WhatsApp Webhook] Updated existing conversation:",
        transcriptId,
      );
    } else {
      // New conversation - insert new transcript
      const { data: transcript, error: insertError } = await supabase
        .from("call_transcripts")
        .insert({
          call_sid: messageSid,
          recording_sid: null,
          audio_url: null,
          transcript: body,
          customer_phone: customerPhone,
          processed: false,
          awaiting_response: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error("[WhatsApp Webhook] Insert error:", insertError);
        return createTwiMLResponse(
          "Sorry, there was an error saving your order.",
        );
      }

      transcriptId = transcript.id;
      console.log("[WhatsApp Webhook] New conversation:", transcriptId);
    }

    // Run AI extraction and validation
    const result = await executeCallIntake(transcriptId, fullTranscript);

    if (result.error || !result.extraction) {
      console.error("[WhatsApp Webhook] Extraction error:", result.error);

      await supabase
        .from("call_transcripts")
        .update({ processed: true })
        .eq("id", transcriptId);

      return createTwiMLResponse(
        "Thank you for your message! Our team will process your order and contact you shortly.",
      );
    }

    // Log validation results
    if (result.validation) {
      console.log("[WhatsApp Webhook] Validation:", {
        isValid: result.validation.isValid,
        priority: result.validation.priority,
        issueCount: result.validation.issues.length,
        summary: result.validation.summary,
      });
    }

    // Check if there are validation ERRORS (not just warnings)
    const errors =
      result.validation?.issues.filter((i) => i.severity === "error") || [];

    if (errors.length > 0) {
      // DON'T create order draft yet - ask follow-up questions
      console.log(
        "[WhatsApp Webhook] Missing required info, asking follow-up:",
        errors.length,
      );

      // Mark conversation as awaiting response
      await supabase
        .from("call_transcripts")
        .update({ awaiting_response: true })
        .eq("id", transcriptId);

      // Build follow-up message
      const followUpMessage = buildFollowUpMessage(errors, result.extraction);

      return createTwiMLResponse(followUpMessage);
    }

    // Validation passed (or only warnings) - create order draft
    const status =
      result.extraction.confidenceScore >= 0.9 &&
      result.validation?.issues.length === 0
        ? "pending"
        : "pending_review";

    const { error: draftError } = await supabase.from("order_drafts").insert({
      call_transcript_id: transcriptId,
      customer_name: result.extraction.customerName,
      customer_phone: result.extraction.customerPhone || customerPhone,
      pickup_address: result.extraction.pickupAddress,
      dropoff_address: result.extraction.dropoffAddress,
      items: result.extraction.items,
      special_instructions: result.extraction.specialInstructions,
      confidence_score: result.extraction.confidenceScore,
      status,
      is_valid: result.validation?.isValid ?? true,
      validation_issues: result.validation?.issues ?? [],
      priority: result.validation?.priority ?? "normal",
      validation_summary: result.validation?.summary ?? null,
    });

    if (draftError) {
      console.error("[WhatsApp Webhook] Draft insert error:", draftError);
    }

    // Mark as processed
    await supabase
      .from("call_transcripts")
      .update({ processed: true })
      .eq("id", transcriptId);

    console.log("[WhatsApp Webhook] Created order draft from:", transcriptId);

    // Build confirmation message
    const confirmation = buildConfirmation(
      result.extraction,
      result.validation?.issues || [],
    );

    return createTwiMLResponse(confirmation);
  } catch (error) {
    console.error("[WhatsApp Webhook] Error:", error);
    return createTwiMLResponse(
      "Sorry, there was an error processing your order. Please try again.",
    );
  }
}

/**
 * Extract phone number from WhatsApp ID
 */
function extractPhone(whatsappId: string): string {
  return whatsappId.replace("whatsapp:", "");
}

/**
 * Build follow-up message asking for missing required information
 */
function buildFollowUpMessage(
  errors: ValidationIssue[],
  extraction: any,
): string {
  const parts = [
    "⚠️ *We need a bit more information to process your order:*\n",
  ];

  // Add each follow-up question
  errors.forEach((error, index) => {
    parts.push(`${index + 1}. ${error.suggestedQuestion}`);
  });

  // Show what we already have
  const captured: string[] = [];
  if (extraction.customerName)
    captured.push(`✓ Name: ${extraction.customerName}`);
  if (extraction.pickupAddress)
    captured.push(`✓ Pickup: ${extraction.pickupAddress}`);
  if (extraction.dropoffAddress)
    captured.push(`✓ Delivery: ${extraction.dropoffAddress}`);

  if (captured.length > 0) {
    parts.push("\n*What we have so far:*");
    parts.push(...captured);
  }

  parts.push("\nPlease reply with the missing details. 📝");

  return parts.join("\n");
}

/**
 * Build a confirmation message from extraction
 */
function buildConfirmation(
  extraction: any,
  warnings: ValidationIssue[],
): string {
  const parts = ["✅ *Order Received!*\n"];

  if (extraction.customerName) {
    parts.push(`👤 Name: ${extraction.customerName}`);
  }
  if (extraction.pickupAddress) {
    parts.push(`📍 Pickup: ${extraction.pickupAddress}`);
  }
  if (extraction.dropoffAddress) {
    parts.push(`🏁 Delivery: ${extraction.dropoffAddress}`);
  }
  if (extraction.items && extraction.items.length > 0) {
    const itemList = extraction.items
      .map((i: any) => `  • ${i.quantity}x ${i.name}`)
      .join("\n");
    parts.push(`📦 Items:\n${itemList}`);
  }
  if (extraction.specialInstructions) {
    parts.push(`📝 Notes: ${extraction.specialInstructions}`);
  }

  // Add warnings if any
  const warningIssues = warnings.filter((w) => w.severity === "warning");
  if (warningIssues.length > 0) {
    parts.push("\n⚠️ *Please note:*");
    warningIssues.forEach((w) => {
      parts.push(`• ${w.message}`);
    });
  }

  parts.push("\nWe'll confirm your order shortly! 🚚");

  return parts.join("\n");
}

/**
 * Create TwiML response for WhatsApp
 */
function createTwiMLResponse(message: string): NextResponse {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
