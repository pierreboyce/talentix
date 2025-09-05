import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Google OAuth callback hit!', request.url);
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('🔍 All URL parameters:', Object.fromEntries(searchParams.entries()));
    console.log('🔍 Parsed parameters:', { code: code ? 'PRESENT' : null, state, error });

    if (error) {
      console.error('❌ OAuth error:', error);
      return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
    }

    if (!code || !state) {
      console.error('❌ Missing code or state parameter');
      return NextResponse.redirect(new URL('/?error=missing_params', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${new URL(request.url).origin}/api/auth/callback/google`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Token exchange failed:', tokenResponse.status, errorData);
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    console.log('Google token response data:', tokenData);

    // Get user profile
    console.log('Fetching user profile from Google API...');
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    console.log('Google profile response status:', profileResponse.status);
    
    if (!profileResponse.ok) {
      console.error('❌ Failed to fetch user profile');
      return NextResponse.redirect(new URL('/?error=profile_fetch_failed', request.url));
    }

    const profileData = await profileResponse.json();
    console.log('Google profile data:', profileData);

    // Create user object
    const userData = {
      id: `oauth_user_google_${Date.now()}`,
      email: profileData.email,
      name: profileData.name || profileData.given_name || 'Google User',
      location: 'Manchester', // Default location
      score: 0,
      emoji: '😊',
      provider: 'google',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Google OAuth successful, redirecting to dashboard with user data');

    // Redirect to dashboard with user data
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('oauth_user', JSON.stringify(userData));
    dashboardUrl.searchParams.set('provider', 'google');
    dashboardUrl.searchParams.set('direct_login', 'true');

    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    console.error('❌ Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=internal_error', request.url));
  }
}
