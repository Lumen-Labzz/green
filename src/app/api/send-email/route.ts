import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { OrderRequestBody } from "@/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: OrderRequestBody = await req.json();
    const { cart, total, notes, phone } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const orderSummary = cart
      .map(
        (item) =>
          `${item.qty} x ${item.product} — KES ${item.total.toLocaleString()}`,
      )
      .join("\n");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Order from Galactic Greens",
      text: `
NEW ORDER FROM WEBSITE

${orderSummary}

Total: KES ${total.toLocaleString()}
Delivery Notes: ${notes || "N/A"}
Phone: ${phone || "N/A"}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Order email sent successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
