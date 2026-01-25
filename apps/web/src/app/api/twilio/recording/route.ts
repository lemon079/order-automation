import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@repo/shared/supabase/server";

/**
 * POST /api/twilio/recording
 *
 * Twilio webhook called when a recording is complete.
 * Inserts a row into call_transcripts with:
 * - audio_url: the recording URL
 * - call_sid: Twilio Call SID
 * - recording_sid: Twilio Recording SID
 * - transcript: NULL (will be filled by transcription callback)
 * - processed: false
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract Twilio recording data
    const callSid = formData.get("CallSid") as string;
    const recordingSid = formData.get("RecordingSid") as string;
    const recordingUrl = formData.get("RecordingUrl") as string;
    const recordingStatus = formData.get("RecordingStatus") as string;

    console.log("[Recording Webhook]", {
      callSid,
      recordingSid,
      recordingUrl,
      recordingStatus,
    });

    // Only process completed recordings
    if (recordingStatus !== "completed") {
      return NextResponse.json({ message: "Recording not complete" });
    }

    if (!callSid || !recordingSid || !recordingUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert into call_transcripts
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("call_transcripts")
      .insert({
        call_sid: callSid,
        recording_sid: recordingSid,
        audio_url: `${recordingUrl}.mp3`, // Twilio provides .mp3 format
        transcript: null,
        processed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[Recording Webhook] Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[Recording Webhook] Inserted call_transcript:", data.id);

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error("[Recording Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
