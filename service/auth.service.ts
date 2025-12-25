import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthResponse, User } from '../types/auth.types';
import { clearToken, clearUser, saveToken, saveUser } from '../utils/storage';
import { apiService } from './api';

GoogleSignin.configure({
    // This is automatically read from google-services.json
    // No manual configuration needed!
});

class AuthService {
    async signInWithGoogle(): Promise<AuthResponse> {
        try {
            // Check if device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get user's ID token
            const { data, type } = await GoogleSignin.signIn();

            // Create Firebase credential
            const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken || null);

            // Sign in with Firebase
            const userCredential = await auth().signInWithCredential(googleCredential);

            const firebaseUser = userCredential.user;

            console.log('✅ Firebase User:', firebaseUser);

            // Get Firebase ID token to send to your backend
            const firebaseIdToken = await firebaseUser.getIdToken();

            // Send to your backend
            const authResponse = await this.verifyFirebaseToken({
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email!,
                name: firebaseUser.displayName!,
                profilePicture: firebaseUser.photoURL || undefined,
                firebaseToken: firebaseIdToken,
            });

            // Save token and user
            await saveToken(authResponse.access_token);
            await saveUser(authResponse.user);

            return authResponse;
        } catch (error: any) {
            console.error('❌ Google Sign-In Error:', error);

            if (error.code === 'SIGN_IN_CANCELLED') {
                throw new Error('Sign in was cancelled');
            } else if (error.code === 'IN_PROGRESS') {
                throw new Error('Sign in is already in progress');
            } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                throw new Error('Play services not available');
            }

            throw new Error(error.message || 'Google sign-in failed');
        }
    }

    async verifyFirebaseToken(firebaseData: {
        firebaseUid: string;
        email: string;
        name: string;
        profilePicture?: string;
        firebaseToken: string;
    }): Promise<AuthResponse> {
        try {
            // Your backend will verify the Firebase token
            const response = await apiService.post<AuthResponse>('/auth/firebase/verify', firebaseData);
            return response;
        } catch (error: any) {
            console.error('❌ Backend verification error:', error);
            throw new Error('Failed to verify with backend');
        }
    }

    async getCurrentUser(): Promise<any> {
        return auth().currentUser;
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
            await GoogleSignin.signOut();
            await auth().signOut();
            await clearToken();
            await clearUser();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
}

export const authService = new AuthService();