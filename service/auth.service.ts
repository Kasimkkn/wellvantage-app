import * as WebBrowser from 'expo-web-browser';
import { AuthResponse, User } from '../types/auth.types';
import { clearToken, clearUser, saveToken, saveUser } from '../utils/storage';
import { apiService } from './api';

WebBrowser.maybeCompleteAuthSession();

class AuthService {
    async verifyGoogleToken(data: {
        idToken: string;
        accessToken?: string;
    }): Promise<AuthResponse> {
        try {
            const response = await apiService.post<AuthResponse>(
                '/auth/google/verify',
                data
            );

            await saveToken(response.access_token);
            await saveUser(response.user);

            return response;
        } catch (error: any) {
            console.error('❌ Backend verification error:', error);
            throw new Error('Failed to verify with backend');
        }
    }

    async getProfile(): Promise<User> {
        try {
            return await apiService.get<User>('/users/profile');
        } catch (error) {
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await clearToken();
            await clearUser();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
}

export const authService = new AuthService();