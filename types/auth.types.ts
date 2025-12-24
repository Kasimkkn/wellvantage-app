export interface User {
    id: string;
    email: string;
    name: string;
    googleId: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}