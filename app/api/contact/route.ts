import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import nodemailer from 'nodemailer'
import { profile } from '@/lib/profile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message, captchaToken } = body

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'Please complete the CAPTCHA' },
        { status: 400 }
      )
    }

    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: captchaToken,
      }),
    })

    const captchaResult = await captchaResponse.json()
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to Neon Database
    try {
      await sql(
        `INSERT INTO contact_messages (name, email, message)
         VALUES ($1, $2, $3)`,
        [name, email, message]
      )
    } catch (dbError) {
      console.error('Neon database contact insert error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Send email notification
    try {
      const emailUser = process.env.EMAIL_USER
      const emailPass = process.env.EMAIL_PASSWORD

      if (emailUser && emailPass) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })

        await transporter.sendMail({
          from: emailUser,
          to: profile.email, // Dynamic target email from profile config
          subject: `New Contact Form Message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This message was sent from your portfolio contact form.</p>
          `,
          replyTo: email,
        })
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Non-blocking: request still succeeds since DB write was successful
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
