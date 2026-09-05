'use client';

import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  try {
    return useAuthContext();
  } catch {
    return {
      user: null,
      loading: false,
      isAdmin: false,
      login: () => {},
      logout: () => {},
    };
  }
}
