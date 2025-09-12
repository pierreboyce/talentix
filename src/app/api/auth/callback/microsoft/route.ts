import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

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
          redirect_uri: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/api/auth/callback/microsoft`,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      console.log('Token response data:', tokenData);
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
      console.log('Fetching user profile from Microsoft Graph API...');
      const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Profile response status:', profileResponse.status);
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Microsoft Graph API error:', errorText);
        throw new Error(`Failed to fetch user profile: ${profileResponse.status} ${errorText}`);
      }

      const profileData = await profileResponse.json();
      console.log('Microsoft profile data:', profileData);

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

      // Always go directly to dashboard when we have OAuth data
      if (profileData.displayName && (profileData.mail || profileData.userPrincipalName)) {
        console.log('✅ Microsoft OAuth: Complete user data received, redirecting to dashboard');
        
        // Store user data directly and redirect to dashboard
        const userParams = new URLSearchParams({
          oauth_user: JSON.stringify(oauthUser),
          provider: 'microsoft',
          direct_login: 'true'
        });

        // Important: use 307 to preserve method/headers and avoid losing cookies
        const redirectUrl = new URL(`/dashboard?${userParams.toString()}`, request.url);
        return NextResponse.redirect(redirectUrl, { status: 307 });
      } else {
        console.log('⚠️ Microsoft OAuth: Incomplete user data, redirecting to oauth-setup');
      }

    } catch (oauthError) {
      console.error('OAuth token exchange failed:', oauthError);
      
      // Try to get at least the email from the token response if available
      let fallbackEmail = '';
      try {
        // If we got a token but Graph API failed, try to get email from JWT token
        const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/api/auth/callback/microsoft`,
          }),
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          // Try to decode the id_token to get email
          if (tokenData.id_token) {
            const payload = JSON.parse(atob(tokenData.id_token.split('.')[1]));
            fallbackEmail = payload.email || payload.preferred_username || '';
            console.log('Extracted email from id_token:', fallbackEmail);
          }
        }
      } catch (fallbackError) {
        console.error('Fallback email extraction failed:', fallbackError);
      }
      
      // Fallback to name selection flow if real OAuth fails
      oauthUser = {
        id: `oauth_user_microsoft_${Date.now()}`,
        email: fallbackEmail, // Use extracted email if available
        location: 'London',
        score: 0,
        emoji: '😊',
        provider: 'microsoft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        needsEmailAndName: !fallbackEmail // Only need both if we don't have email
      };
    }

    // Redirect to name selection page only if we don't have complete user data
    const userParams = new URLSearchParams({
      oauth_user: JSON.stringify(oauthUser),
      provider: 'microsoft'
    });

    return NextResponse.redirect(
      `${request.nextUrl.origin}/oauth-setup?${userParams.toString()}`
    );

  } catch (error) {
    console.error('Microsoft OAuth callback error:', error);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/?error=oauth_callback_error`
      );
  }
} 
 
 
 
 
 
 
 