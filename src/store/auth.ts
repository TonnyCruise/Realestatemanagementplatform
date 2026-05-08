import { create } from 'zustand';
import { type User, getMe, clearTokens, isAuthenticated } from '../lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  initialize: async () => {
    if (!isAuthenticated()) {
      set({ initialized: true });
      return;
    }
    set({ loading: true });
    try {
      const user = await getMe();
      set({ user, initialized: true, loading: false });
    } catch {
      clearTokens();
      set({ user: null, initialized: true, loading: false });
    }
  },

  logout: () => {
    clearTokens();
    set({ user: null });
  },
}));
