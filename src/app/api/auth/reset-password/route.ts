import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    try {
      // Verify the reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      if (decoded.type !== 'password_reset') {
        return NextResponse.json(
          { error: 'Invalid reset token' },
          { status: 400 }
        );
      }

      const email = decoded.email;

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // TODO: Update user's password in your database
      // For now, we'll just simulate success
      // In a real app, you'd update the user's password here
      console.log(`Would update password for user: ${email}`);
      
      // Example database update (replace with your actual database logic):
      // await db.user.update({
      //   where: { email },
      //   data: { password: hashedPassword }
      // });

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully! You can now sign in with your new password.'
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

