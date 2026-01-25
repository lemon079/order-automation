import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@repo/shared/supabase/server";

/**
 * POST /api/twilio/transcription
 *
 * Twilio webhook called when transcription is complete.
 * Updates the call_transcripts row with the transcript text.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract Twilio transcription data
    const callSid = formData.get("CallSid") as string;
    const recordingSid = formData.get("RecordingSid") as string;
    const transcriptionText = formData.get("TranscriptionText") as string;
    const transcriptionStatus = formData.get("TranscriptionStatus") as string;

    console.log("[Transcription Webhook]", {
      callSid,
      recordingSid,
      transcriptionStatus,
      transcriptionText: transcriptionText?.substring(0, 100) + "...",
    });

    // Only process completed transcriptions
    if (transcriptionStatus !== "completed") {
      return NextResponse.json({ message: "Transcription not complete" });
    }

    if (!recordingSid || !transcriptionText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Update call_transcripts with the transcript
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("call_transcripts")
      .update({
        transcript: transcriptionText,
      })
      .eq("recording_sid", recordingSid)
      .select()
      .single();

    if (error) {
      console.error("[Transcription Webhook] Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[Transcription Webhook] Updated call_transcript:", data.id);

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error("[Transcription Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
