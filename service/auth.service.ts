import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_WEB_CLIENT_ID } from '../constants/config';
import { AuthResponse, User } from '../types/auth.types';
import { clearToken, clearUser, saveToken, saveUser } from '../utils/storage';
import { apiService } from './api';

WebBrowser.maybeCompleteAuthSession();

class AuthService {
    // Initialize Google Auth Request
    useGoogleAuth() {
        const [request, response, promptAsync] = Google.useAuthRequest({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            // For iOS
            iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // Optional
            // For Android
            androidClientId: '509308286974-9s5mr4ptb3j473repuu5i3il0b7motkl.apps.googleusercontent.com', // Optional
        });


        return { request, response, promptAsync };
    }

    async handleGoogleResponse(response: any): Promise<AuthResponse> {
        if (response?.type === 'success') {
            const { authentication } = response;

            // Get user info from Google
            const userInfoResponse = await fetch(
                'https://www.googleapis.com/userinfo/v2/me',
                {
                    headers: { Authorization: `Bearer ${authentication.accessToken}` },
                }
            );

            const userInfo = await userInfoResponse.json();

            const authResponse = await this.verifyGoogleToken({
                googleId: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                profilePicture: userInfo.picture,
                accessToken: authentication.accessToken,
            });

            // Save token and user
            await saveToken(authResponse.access_token);
            await saveUser(authResponse.user);

            return authResponse;
        }

        throw new Error('Google authentication failed');
    }

    async verifyGoogleToken(googleData: {
        googleId: string;
        email: string;
        name: string;
        profilePicture?: string;
        accessToken: string;
    }): Promise<AuthResponse> {
        try {
            const response = await apiService.post<AuthResponse>('/auth/google/verify', googleData);
            return response;
        } catch (error) {
            throw error;
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
            throw error;
        }
    }
}

export const authService = new AuthService();