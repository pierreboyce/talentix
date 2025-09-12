import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // TODO: Replace with your actual database query
    // For now, we'll simulate checking if user exists
    // In a real app, you'd query your database here
    const userExists = true; // Replace with actual database check

    if (!userExists) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we\'ve sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { email, type: 'password_reset' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Create reset URL - always use custom domain in production
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://talentix.co.uk'
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Talentix Password</title>
          <style>
            body {
              font-family: 'Fredoka', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%);
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 24px;
              padding: 40px;
              box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.4);
            }
            .header {
              text-align: center;
              margin-bottom: 32px;
            }
            .title {
              font-size: 32px;
              font-weight: 900;
              color: #1f2937;
              margin-bottom: 16px;
            }
            .subtitle {
              font-size: 18px;
              color: #6b7280;
              font-weight: 600;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
              color: #374151;
              margin-bottom: 32px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
              color: white;
              text-decoration: none;
              padding: 18px 32px;
              border-radius: 16px;
              font-weight: 700;
              font-size: 18px;
              text-align: center;
              box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4);
            }
            .footer {
              margin-top: 32px;
              padding-top: 24px;
              border-top: 2px solid #f3f4f6;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">🔑 Reset Your Password</div>
              <div class="subtitle">Let's get you back into your Talentix account!</div>
            </div>
            
            <div class="content">
              <p>Hi there! 👋</p>
              <p>We received a request to reset your Talentix password. No worries - it happens to the best of us!</p>
              <p>Click the button below to reset your password. This link will expire in 1 hour for security reasons.</p>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" class="button">Reset My Password 🚀</a>
            </div>
            
            <div class="content">
              <p><strong>Didn't request this?</strong> No problem! You can safely ignore this email and your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>This link will expire in 1 hour for your security.</p>
              <p>If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; font-family: monospace; background: #f3f4f6; padding: 8px; border-radius: 8px;">${resetUrl}</p>
              <p style="margin-top: 24px;">
                🎯 <strong>Talentix Team</strong><br>
                Helping you land your dream job!
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using SendGrid
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@talentix.co.uk',
        name: 'Talentix Team'
      },
      subject: '🔑 Reset Your Talentix Password',
      html: emailHtml,
      text: `
        Reset Your Talentix Password
        
        Hi there!
        
        We received a request to reset your Talentix password. Click the link below to reset it:
        
        ${resetUrl}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this, you can safely ignore this email.
        
        - The Talentix Team
      `
    };

    await sgMail.send(msg);

      return NextResponse.json({ 
        success: true, 
      message: 'If an account with that email exists, we\'ve sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to send reset email' },
      { status: 500 }
    );
  }
}