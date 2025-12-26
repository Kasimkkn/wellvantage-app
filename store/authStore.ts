import { create } from 'zustand';
import { User } from '../types/auth.types';

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    loadUser: () => Promise<void>;
}

// Static user data
const STATIC_USER: User = {
    id: '276d155a-40a0-4134-9e48-32f3a193a0f3',
    email: 'demo@wellvantage.com',
    name: 'Demo User',
    googleId: 'demo-user-id',
    profilePicture: 'https://ui-avatars.com/api/?name=Demo+User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: STATIC_USER,
    isLoading: false,

    loadUser: async () => {
        set({ user: STATIC_USER, isLoading: false });
    },
}));