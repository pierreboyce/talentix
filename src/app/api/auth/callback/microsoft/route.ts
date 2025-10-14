import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    
    
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      // OAuth error occurred
      
      return NextResponse.redirect(
        `${request.nextUrl.origin}/?error=oauth_${error}`
      );
    }

    if (!code) {
      // No authorization code received
      
      return NextResponse.redirect(
        `${request.nextUrl.origin}/?error=oauth_missing_code`
      );
    }

    // Real OAuth implementation - Exchange code for access token and get user data
    let oauthUser;
    
    // FORCE production URL if we detect production domain
    let baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    if (request.nextUrl.hostname === 'talentix.co.uk' || request.nextUrl.hostname === 'www.talentix.co.uk') {
      baseUrl = 'https://talentix.co.uk';
      
    }
    const redirectUri = `${baseUrl}/api/auth/callback/microsoft`;
    
    
    
    
    try {
      // Step 1: Exchange authorization code for access token
      const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET || '', // You'll need to add this
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        
        throw new Error(`Failed to exchange code for token: ${tokenResponse.status} ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      
      const accessToken = tokenData.access_token;
      
      if (!accessToken) {
        throw new Error('No access token received from Microsoft');
      }

      // Optional: decode id_token for email fast-path
      let decodedEmail = '';
      try {
        if ((tokenData as any).id_token) {
          const payload = JSON.parse(Buffer.from((tokenData as any).id_token.split('.')[1], 'base64').toString('utf8'));
          decodedEmail = payload.email || payload.preferred_username || '';
        }
      } catch {}

      // Step 2: Fetch user profile from Microsoft Graph API
      
      const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        
        throw new Error(`Failed to fetch user profile: ${profileResponse.status} ${errorText}`);
      }

      const profileData = await profileResponse.json();
      

      // Create user data from real Microsoft profile
      oauthUser = {
        id: `oauth_user_microsoft_${Date.now()}`,
        email: profileData.mail || profileData.userPrincipalName || decodedEmail,
        name: profileData.displayName,
        location: 'London', // Default location, user can change later
        score: 0,
        emoji: '😊',
        provider: 'microsoft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Always go directly to dashboard when we have OAuth data - Microsoft always provides a display name
      
      
      // Store user data directly and redirect to dashboard
      const userParams = new URLSearchParams({
        oauth_user: JSON.stringify(oauthUser),
        provider: 'microsoft',
        direct_login: 'true'
      });

      // Important: use 307 to preserve method/headers and avoid losing cookies
      const redirectUrl = new URL(`/dashboard?${userParams.toString()}`, request.url);
      return NextResponse.redirect(redirectUrl, { status: 307 });

    } catch (oauthError) {
      
      
      // If OAuth fails completely, redirect to home with error
      return NextResponse.redirect(
        `${request.nextUrl.origin}/?error=microsoft_oauth_failed`
      );
    }

  } catch (error) {
    
    return NextResponse.redirect(
      `${request.nextUrl.origin}/?error=oauth_callback_error`
      );
  }
} 
 
 
 
 
 
 
 