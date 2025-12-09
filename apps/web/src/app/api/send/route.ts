import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { to, body } = await request.json();
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${to}`,
      body: body,
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
