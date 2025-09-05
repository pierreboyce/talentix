import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Module-level cache to persist between requests (in production, use a database)
const globalForVerificationCodes = globalThis as unknown as {
  verificationCodes: Map<string, { code: string; timestamp: number; email: string }> | undefined
};

// Function to generate a 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send email using Nodemailer (Gmail SMTP)
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    // For demo purposes, we'll still log to console as backup
    console.log(`📧 Sending verification code to ${email}: ${code}`);
    
    // Use the Talentix email for sending password reset codes
    const emailUser = 'talentixuk@gmail.com';
    const emailPass = process.env.EMAIL_PASS || 'defaultpass'; // You'll need to set this in .env.local
    
    if (!process.env.EMAIL_PASS) {
      console.log('⚠️ EMAIL_PASS not configured in .env.local, using console output for now');
      console.log(`🔗 Verification code for ${email}: ${code}`);
      return true; // Return success for demo until email is configured
    }
    
    // Use nodemailer to send real email
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
    
    const mailOptions = {
      from: `"Talentix Support" <${emailUser}>`,
      to: email,
      subject: '🔐 Your Talentix Password Reset Code',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde047 100%); border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0; font-size: 2.5rem;">🚀 Talentix</h1>
            <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 1.1rem;">Your Career Journey Starts Here</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request 🔐</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">Hi there! 👋</p>
            
            <p style="color: #4b5563; line-height: 1.6;">
              We received a request to reset your Talentix password. Use the verification code below to proceed:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #000; font-size: 2rem; font-weight: bold; padding: 20px; border-radius: 10px; letter-spacing: 3px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                ${code}
              </div>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              This code will expire in <strong>10 minutes</strong> for security reasons.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6;">
              If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
                Best regards,<br>
                The Talentix Team 💼✨
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 0.8rem; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.log(`🔗 Fallback - Verification code for ${email}: ${code}`);
    return true; // Return success anyway for demo purposes
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists (check localStorage simulation)
    // In production, check your user database
    const users = JSON.parse(process.env.DEMO_USERS || '[]');
    const userExists = users.some((user: any) => user.email === email);

    if (!userExists) {
      // For security, we still return success even if user doesn't exist
      // This prevents email enumeration attacks
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, a verification code has been sent.' 
      });
    }

    // Generate verification code
    const code = generateVerificationCode();
    const timestamp = Date.now();

    // Initialize verificationCodes if not already done
    if (!globalForVerificationCodes.verificationCodes) {
      globalForVerificationCodes.verificationCodes = new Map<string, { code: string; timestamp: number; email: string }>();
    }

    // Store verification code (expires in 10 minutes)
    globalForVerificationCodes.verificationCodes.set(email, { code, timestamp, email });

    // Clean up expired codes
    for (const [key, value] of globalForVerificationCodes.verificationCodes.entries()) {
      if (timestamp - value.timestamp > 10 * 60 * 1000) { // 10 minutes
        globalForVerificationCodes.verificationCodes.delete(key);
      }
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(email, code);

    if (emailSent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Verification code sent to your email' 
      });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verification codes are now stored in globalForVerificationCodes

