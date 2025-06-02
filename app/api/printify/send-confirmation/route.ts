// /app/api/printify-webhook/route.ts

import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const event = await req.json();

  if (event.event === 'order:fulfilled') {
    const tracking = event.data.shipments?.[0];
    const customerEmail = event.data.metadata?.customer_email;

    if (tracking && customerEmail) {
      try {
        await resend.emails.send({
          from: 'Your Shop <orders@yourdomain.com>',
          to: customerEmail,
          subject: 'Your order has shipped!',
          html: `
            <p>Hi there,</p>
            <p>Your order has shipped! 🎉</p>
            <p><strong>Tracking Number:</strong> ${tracking.tracking_number}</p>
            <p><a href="${tracking.tracking_url}">Click here to track your package</a></p>
            <p>Thanks for shopping with us!</p>
          `,
        });
      } catch (error) {
        console.error('Failed to send email:', error);
        return new Response('Email failed', { status: 500 });
      }
    }
  }

  return new Response('OK');
}
