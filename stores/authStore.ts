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
  isHydrated: boolean; // ← Tambahkan ini

  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateBalance: (newBalance: number) => void;
  setIsLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void; // ← Tambahkan ini
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false, // ← Tambahkan ini

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

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }), // ← Tambahkan ini
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true); // ← Callback saat hydrasi selesai
      },
    },
  ),
);
