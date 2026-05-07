// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateBalance: (newBalance: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (token: string, user: User) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateBalance: (newBalance: number) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance: newBalance } : null,
        })),

      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage", // key di localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // hanya persist state ini
    },
  ),
);
