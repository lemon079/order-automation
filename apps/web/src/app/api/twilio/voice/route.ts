import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/twilio/voice
 *
 * Twilio webhook endpoint for incoming calls.
 * Returns TwiML instructing Twilio to:
 * 1. Play a greeting message
 * 2. Record the call with transcription enabled
 * 3. Send recording + transcript to /api/twilio/recording when complete
 */
export async function POST(request: NextRequest) {
  // Get the base URL for callbacks
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // TwiML response
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Thank you for calling. Please leave your order details after the beep, 
    including your name, phone number, pickup address, delivery address, 
    and the items you need delivered. Press the pound key when finished.
  </Say>
  <Record
    maxLength="300"
    finishOnKey="#"
    transcribe="true"
    transcribeCallback="${baseUrl}/api/twilio/transcription"
    recordingStatusCallback="${baseUrl}/api/twilio/recording"
    recordingStatusCallbackMethod="POST"
  />
  <Say voice="alice">
    We did not receive a recording. Goodbye.
  </Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
