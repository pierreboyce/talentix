# SendGrid Setup Guide for Talentix Forgot Password

## 🚀 Quick Setup Instructions

### 1. Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Get API Key
1. Login to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access**
5. Give it a name like "Talentix Password Reset"
6. Under **Mail Send**, select **Full Access**
7. Click **Create & View**
8. **Copy the API key immediately** (you won't see it again!)

### 3. Verify Sender Identity
1. Go to **Settings** → **Sender Authentication**
2. Choose **Single Sender Verification**
3. Add your email (e.g., `noreply@talentix.co.uk`)
4. Fill out the form and verify the email
5. **Important**: Use this verified email as your FROM address

### 4. Update Environment Variables
Add these to your `.env.local` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@talentix.co.uk
```

### 5. Install SendGrid Package
The package is already included in the project, but if needed:

```bash
npm install @sendgrid/mail
```

## 🎯 How It Works

### Forgot Password Flow:
1. User clicks "Forgot your password? 🔑" in sign-in modal
2. User enters email in the forgot password modal
3. API generates a JWT token (expires in 1 hour)
4. SendGrid sends a beautiful HTML email with reset link
5. User clicks link → redirected to `/reset-password?token=...`
6. User enters new password → API verifies token and updates password

### API Routes Created:
- `POST /api/auth/forgot-password` - Sends reset email
- `POST /api/auth/reset-password` - Updates password with valid token

### Components Created:
- `ForgotPasswordModal` - Beautiful modal for email input
- `/reset-password` page - Password reset form with validation

## 🎨 Email Template Features:
- **Responsive design** with Talentix branding
- **Gradient background** matching website theme
- **Fun emojis** and friendly copy
- **Security notice** about 1-hour expiration
- **Fallback plain text** version
- **Professional sender name**: "Talentix Team"

## 🔒 Security Features:
- **JWT tokens** with 1-hour expiration
- **No email enumeration** - same response whether email exists or not
- **Secure password hashing** with bcrypt
- **Token validation** prevents replay attacks

## 🧪 Testing:
1. Make sure your `.env.local` has the SendGrid credentials
2. Use a real email address you can access
3. Check spam folder if email doesn't arrive
4. Token expires in 1 hour for security

## 📧 Troubleshooting:
- **Email not arriving?** Check SendGrid activity dashboard
- **"Email service not configured"?** Check your API key in `.env.local`
- **"Invalid sender"?** Make sure you verified your sender email
- **Token expired?** Request a new password reset

## 🎉 Ready to Go!
Once configured, users can reset passwords with a beautiful, branded experience that matches Talentix's fun and playful personality!

