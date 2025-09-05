export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  score: number;
  avatar?: string;
  emoji?: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  expires: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  location?: string;
}

export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  signInWithProvider: (provider: 'google' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  updateUser: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: AuthSession;
  error?: string;
}

export interface OAuthProvider {
  id: 'google' | 'microsoft';
  name: string;
  icon: string;
  color: string;
} 