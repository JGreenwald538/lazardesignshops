// /app/api/printify-webhook/route.ts

import ReceiptEmail from '@/app/components/ReceiptCard';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const event = await req.json();

  if (req.headers.get('Authorization') !== `Bearer ${process.env.PRINTIFY_WEBHOOK_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }  

  if (event.event === 'order:fulfilled') {
    const tracking = event.data.shipments?.[0];
    const customerEmail = event.data.metadata?.customer_email;

    if (tracking && customerEmail) {
      try {
        await resend.emails.send({
            from: 'lazardesigns11@gmail.com',
            to: customerEmail,
            subject: `Your Order #${event.data.order_number} is on its way!`,
            react: ReceiptEmail({
              receiptNumber: event.data.order_number,
              amountPaid: event.data.amount_paid,
              datePaid: event.data.date_paid,
              paymentMethod: event.data.payment_method,
              items: event.data.line_items.map((item: { name: string; tracking_number: string; }) => ({
                item: item.name,
                tracking: item.tracking_number,
              })),
            }),
          });
      } catch (error) {
        console.error('Failed to send email:', error);
        return new Response('Email failed', { status: 500 });
      }
    }
  }

  return new Response('OK');
}
