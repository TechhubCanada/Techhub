import { NextResponse } from "next/server"
import { storeBusinessInfo } from "@lib/business-info"
import {
  buildInquiryEmailHtml,
  getInquiryRequestTypeLabel,
  inquiryContactSchema,
} from "@lib/inquiry/contact"

const resendEndpoint = "https://api.resend.com/emails"

const getInquiryRecipient = () =>
  process.env.CONTACT_INQUIRY_TO || storeBusinessInfo.email.label

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    )
  }

  const parsed = inquiryContactSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the form and try again.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM

  if (!apiKey || !from) {
    console.error("Inquiry email is missing RESEND_API_KEY or RESEND_FROM")
    return NextResponse.json(
      { message: "Inquiry email is not configured." },
      { status: 500 }
    )
  }

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [getInquiryRecipient()],
      reply_to: parsed.data.email,
      subject: `TechHub inquiry: ${getInquiryRequestTypeLabel(parsed.data.requestType)}`,
      html: buildInquiryEmailHtml(parsed.data),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    console.error("Resend inquiry email failed", {
      status: response.status,
      body: errorText,
    })

    return NextResponse.json(
      { message: "Could not send the inquiry right now." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
