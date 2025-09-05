import { OAuthProvider } from '../types/auth';

export const oauthProviders: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'G',
    color: '#dc2626'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: '⊞',
    color: '#2563eb'
  }
];

// OAuth URLs and configurations
export const oauthConfig = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`
  },
  microsoft: {
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    scope: 'openid email profile',
    clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/microsoft`
  }
};

// Generate OAuth authorization URL
export function generateAuthUrl(provider: 'google' | 'microsoft', state?: string): string {
  const config = oauthConfig[provider];
  
  if (!config.clientId) {
    throw new Error(`${provider} OAuth is not configured. Please set up the environment variables.`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: state || '',
    ...(provider === 'microsoft' && { response_mode: 'query' })
  });

  return `${config.authUrl}?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(
  provider: 'google' | 'microsoft',
  code: string
): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const config = oauthConfig[provider];

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange code for token: ${response.statusText}`);
  }

  return response.json();
}

// Get user info from OAuth provider
export async function getUserInfo(
  provider: 'google' | 'microsoft',
  accessToken: string
): Promise<{ id: string; email: string; name: string; picture?: string }> {
  const config = oauthConfig[provider];

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  const data = await response.json();

  // Normalize the response format
  return {
    id: data.id || data.sub,
    email: data.email,
    name: data.name || data.displayName,
    picture: data.picture || data.avatar_url
  };
} 