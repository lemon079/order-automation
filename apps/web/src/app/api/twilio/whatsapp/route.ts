import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@repo/shared/supabase/server";
import { executeCallIntake } from "@repo/langgraph";

/**
 * POST /api/twilio/whatsapp
 *
 * Twilio webhook for incoming WhatsApp messages.
 * Flow:
 * 1. Receive message from customer
 * 2. Store in call_transcripts (using message as "transcript")
 * 3. Run AI extraction immediately (no need to wait for transcription)
 * 4. Reply with confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

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

    // Insert into call_transcripts (reusing the table for WhatsApp messages)
    const { data: transcript, error: insertError } = await supabase
      .from("call_transcripts")
      .insert({
        call_sid: messageSid, // Using message SID instead of call SID
        recording_sid: null,
        audio_url: null,
        transcript: body, // The WhatsApp message IS the transcript
        processed: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[WhatsApp Webhook] Insert error:", insertError);
      return createTwiMLResponse(
        "Sorry, there was an error saving your order.",
      );
    }

    console.log("[WhatsApp Webhook] Saved message:", transcript.id);

    // Run AI extraction immediately
    const result = await executeCallIntake(transcript.id, body);

    if (result.error || !result.extraction) {
      console.error("[WhatsApp Webhook] Extraction error:", result.error);

      // Mark as processed even on error
      await supabase
        .from("call_transcripts")
        .update({ processed: true })
        .eq("id", transcript.id);

      return createTwiMLResponse(
        "Thank you for your message! Our team will process your order and contact you shortly.",
      );
    }

    // Insert into order_drafts
    const { error: draftError } = await supabase.from("order_drafts").insert({
      call_transcript_id: transcript.id,
      customer_name: result.extraction.customerName,
      customer_phone: result.extraction.customerPhone || extractPhone(from),
      pickup_address: result.extraction.pickupAddress,
      dropoff_address: result.extraction.dropoffAddress,
      items: result.extraction.items,
      special_instructions: result.extraction.specialInstructions,
      confidence_score: result.extraction.confidenceScore,
      status: "pending_review",
    });

    if (draftError) {
      console.error("[WhatsApp Webhook] Draft insert error:", draftError);
    }

    // Mark as processed
    await supabase
      .from("call_transcripts")
      .update({ processed: true })
      .eq("id", transcript.id);

    console.log("[WhatsApp Webhook] Created order draft from:", transcript.id);

    // Build confirmation message
    const confirmation = buildConfirmation(result.extraction);

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
 * e.g., "whatsapp:+923001234567" → "+923001234567"
 */
function extractPhone(whatsappId: string): string {
  return whatsappId.replace("whatsapp:", "");
}

/**
 * Build a confirmation message from extraction
 */
function buildConfirmation(extraction: any): string {
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
