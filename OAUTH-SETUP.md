# OAuth Setup Guide

## Google OAuth Configuration

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

### 2. OAuth Client Configuration

**Application Type:** Web Application

**Authorized JavaScript Origins:**
- `http://localhost:3000` (for development)
- `https://talentix.co.uk` (for production)

**Authorized Redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (for development)
- `https://talentix.co.uk/api/auth/callback/google` (for production)

### 3. Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Base URLs
NEXTAUTH_URL=https://talentix.co.uk
NEXT_PUBLIC_APP_URL=https://talentix.co.uk
```

### 4. Current Error Fix

The error `redirect_uri_mismatch` occurs because:

1. **Development**: The OAuth app is configured for `http://localhost:3000` but you might be running on a different port
2. **Production**: The redirect URI in Google Console doesn't match the actual domain

**To Fix:**

1. Check your current development URL (look at terminal output when running `npm run dev`)
2. Update Google OAuth settings to include the correct redirect URI
3. For production, ensure `https://talentix.co.uk/api/auth/callback/google` is added to authorized redirect URIs

### 5. Testing OAuth

After configuration:

1. Clear browser cache and cookies for localhost/talentix.co.uk
2. Try OAuth login again
3. Check browser network tab for the exact redirect URI being used
4. Verify it matches what's configured in Google Console

## Microsoft OAuth Setup (Optional)

Similar process for Microsoft:

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register new application
3. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/microsoft`
   - `https://talentix.co.uk/api/auth/callback/microsoft`

## Troubleshooting

### Common Issues:

1. **Port Mismatch**: Dev server on 3001 but OAuth configured for 3000
2. **HTTPS vs HTTP**: Production must use HTTPS
3. **Domain Mismatch**: Subdomain not configured (www.talentix.co.uk vs talentix.co.uk)
4. **Trailing Slash**: Some providers require exact match including/excluding trailing slash

### Debug Steps:

1. Check actual redirect URI in browser network tab
2. Compare with Google Console configuration
3. Verify environment variables are loaded correctly
4. Test with incognito mode to avoid cache issues

## Security Notes

- Never commit OAuth secrets to git
- Use different OAuth apps for development and production
- Regularly rotate client secrets
- Monitor OAuth usage in provider dashboards


