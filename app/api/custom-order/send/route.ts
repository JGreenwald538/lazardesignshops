import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, typeOfProject, file } = await req.json();

    if (!name || !email || !message || !typeOfProject || typeOfProject === 'Type of Project' || !file) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const attachments = file
      ? [
          {
            filename: "attachment.png", // optional: extract from base64 header
            content: file.split(",")[1], // remove "data:image/png;base64,"
            encoding: "base64",
          },
        ]
      : [];

      const { error } = await resend.emails.send({
        from: 'Lazar Designs <onboarding@resend.dev>',
        to: 'lazardesigns11@gmail.com',
        subject: `New Custom Order: ${typeOfProject}`,
        replyTo: email,
        html: `
          <h2>New Custom Order Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Type of Project:</strong> ${typeOfProject}</p>
          <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>File:</strong> Attached</p>
        `,
        attachments,
      });
      

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ message: 'Email failed to send' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order submitted successfully!' });
  } catch (err) {
    console.error('Error processing custom order:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
