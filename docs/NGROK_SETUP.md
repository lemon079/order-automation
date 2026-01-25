# Ngrok Setup & Webhook Testing Guide

To test features like **Twilio Voice/WhatsApp Webhooks** and **Magic Links** with an external provider, you need to expose your local server to the internet using `ngrok`.

## 1. Start Ngrok

Run the following command in a terminal to expose your local Next.js server (port 3000):

```bash
ngrok http 3000
```

This will generate a public URL, for example: `https://your-id.ngrok-free.app`

---

## 2. Configuring Webhooks (Twilio)

Twilio needs a public URL to send webhook events to your application.

### Voice Calls
1. Go to [Twilio Console > Active Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming).
2. Click your phone number.
3. Scroll to **Voice Configuration**.
4. Set "A Call Comes In" to:
   `https://your-id.ngrok-free.app/api/twilio/voice` (POST)

### WhatsApp Sandbox
1. Go to [WhatsApp Sandbox Settings](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn).
2. Set "When a message comes in" to:
   `https://your-id.ngrok-free.app/api/twilio/whatsapp` (POST)

---

## 3. Configuring Authentication (Magic Links)

Supabase Magic Links send an email with a callback URL. This URL must point to your running server.

### Using Ngrok (Public Testing)
If you are testing with ngrok, you must update your environment variable so the email link points to the public ngrok URL.

1. Open `.env.local`
2. Set `NEXT_PUBLIC_API_URL` to your ngrok URL:
   ```env
   NEXT_PUBLIC_API_URL=https://your-id.ngrok-free.app
   ```
3. **Restart your dev server** (`npm run dev`).

### Switching Back to Localhost
When you stop ngrok or want just local development:

1. Open `.env.local`
2. Comment out or change `NEXT_PUBLIC_API_URL` back to localhost:
   ```env
   # NEXT_PUBLIC_API_URL=https://your-id.ngrok-free.app
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. **Restart your dev server**.

> **Note:** If you forget to switch this back, Magic Links sent to your email will fail to open if ngrok is not running.
