// This hook is deprecated. Use useAuth from contexts/AuthContext instead.
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { user } = useAuthContext();
  return user?.name || null;
} 