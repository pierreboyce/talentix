import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      
      return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
    }

    if (!code || !state) {
      
      return NextResponse.redirect(new URL('/?error=missing_params', request.url));
    }

    // Exchange code for access token
    let baseUrl = request.nextUrl.origin; // Always use the actual request origin first
    
    // FORCE production URL ONLY if we detect production domain
    if (request.nextUrl.hostname === 'talentix.co.uk' || request.nextUrl.hostname === 'www.talentix.co.uk') {
      baseUrl = 'https://talentix.co.uk';
    }
    // For localhost, always use the request origin (localhost:3000)
    
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    
    console.log('🔍 Google OAuth Debug:');
    console.log('📍 Base URL:', baseUrl);
    console.log('🔗 Redirect URI:', redirectUri);
    console.log('🔑 Code received:', code ? 'Yes' : 'No');
    
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
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Google token exchange failed:', tokenResponse.status, errorData);
      
      // If redirect_uri_mismatch on production, try with www prefix
      if (errorData.includes('redirect_uri_mismatch') && baseUrl === 'https://talentix.co.uk') {
        console.log('🔄 Retrying with www prefix...');
        const wwwRedirectUri = 'https://www.talentix.co.uk/api/auth/callback/google';
        
        const retryResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: wwwRedirectUri,
          }),
        });
        
        if (retryResponse.ok) {
          console.log('✅ Retry with www prefix succeeded');
          // Continue with the retry response
          const retryTokenData = await retryResponse.json();
          // Process the successful response...
          return NextResponse.redirect(new URL('/?oauth_success=true', request.url));
        }
      }
      
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    

    // Get user profile
    
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    
    
    if (!profileResponse.ok) {
      
      return NextResponse.redirect(new URL('/?error=profile_fetch_failed', request.url));
    }

    const profileData = await profileResponse.json();
    

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

    

    // Redirect to dashboard with user data
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('oauth_user', JSON.stringify(userData));
    dashboardUrl.searchParams.set('provider', 'google');
    dashboardUrl.searchParams.set('direct_login', 'true');

    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    
    return NextResponse.redirect(new URL('/?error=internal_error', request.url));
  }
}

