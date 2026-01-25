import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@repo/shared/supabase/server";
import { executeCallIntake } from "@repo/langgraph";

/**
 * POST /api/process-calls
 *
 * Process unprocessed call transcripts:
 * 1. Query call_transcripts where transcript IS NOT NULL AND processed = false
 * 2. Run call intake agent to extract order data
 * 3. Insert into order_drafts
 * 4. Mark call_transcripts.processed = true
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Find unprocessed transcripts
    const { data: transcripts, error: fetchError } = await supabase
      .from("call_transcripts")
      .select("*")
      .not("transcript", "is", null)
      .eq("processed", false)
      .limit(10); // Process in batches

    if (fetchError) {
      console.error("[Process Calls] Fetch error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!transcripts || transcripts.length === 0) {
      return NextResponse.json({
        message: "No unprocessed transcripts found",
        processed: 0,
      });
    }

    console.log(`[Process Calls] Processing ${transcripts.length} transcripts`);

    const results = [];

    for (const transcript of transcripts) {
      try {
        // Run call intake agent
        const result = await executeCallIntake(
          transcript.id,
          transcript.transcript,
        );

        if (result.error) {
          console.error(
            `[Process Calls] Agent error for ${transcript.id}:`,
            result.error,
          );
          results.push({
            id: transcript.id,
            success: false,
            error: result.error,
          });
          continue;
        }

        if (!result.extraction) {
          console.error(`[Process Calls] No extraction for ${transcript.id}`);
          results.push({
            id: transcript.id,
            success: false,
            error: "No extraction result",
          });
          continue;
        }

        // Insert into order_drafts
        const { error: insertError } = await supabase
          .from("order_drafts")
          .insert({
            call_transcript_id: transcript.id,
            customer_name: result.extraction.customerName,
            customer_phone: result.extraction.customerPhone,
            pickup_address: result.extraction.pickupAddress,
            dropoff_address: result.extraction.dropoffAddress,
            items: result.extraction.items,
            special_instructions: result.extraction.specialInstructions,
            confidence_score: result.extraction.confidenceScore,
            status: "pending_review",
          });

        if (insertError) {
          console.error(
            `[Process Calls] Insert error for ${transcript.id}:`,
            insertError,
          );
          results.push({
            id: transcript.id,
            success: false,
            error: insertError.message,
          });
          continue;
        }

        // Mark as processed
        const { error: updateError } = await supabase
          .from("call_transcripts")
          .update({ processed: true })
          .eq("id", transcript.id);

        if (updateError) {
          console.error(
            `[Process Calls] Update error for ${transcript.id}:`,
            updateError,
          );
        }

        results.push({ id: transcript.id, success: true });
        console.log(`[Process Calls] Processed ${transcript.id}`);
      } catch (error) {
        console.error(
          `[Process Calls] Error processing ${transcript.id}:`,
          error,
        );
        results.push({
          id: transcript.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      processed: successCount,
      total: transcripts.length,
      results,
    });
  } catch (error) {
    console.error("[Process Calls] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
