import { create } from 'zustand';
import { authService } from '../service/auth.service';
import { AuthState, User } from '../types/auth.types';
import { getToken, getUser } from '../utils/storage';

interface AuthStore extends AuthState {
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,

    signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            const authResponse = await authService.signInWithGoogle();
            set({
                user: authResponse.user,
                token: authResponse.access_token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.message || 'Google sign-in failed',
                isLoading: false,
                isAuthenticated: false,
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({ error: error.message || 'Logout failed', isLoading: false });
            throw error;
        }
    },

    loadUser: async () => {
        set({ isLoading: true });
        try {
            const token = await getToken();
            const user = await getUser();

            if (token && user) {
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ isLoading: false });
        }
    },

    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    clearError: () => set({ error: null }),
}));