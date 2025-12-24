export const API_CONFIG = {
    BASE_URL: __DEV__
        ? 'http://192.168.0.104:3000' // For Android Emulator (use your IP for physical device)
        : 'https://your-production-url.com',
    TIMEOUT: 30000,
};

export const GOOGLE_WEB_CLIENT_ID = '509308286974-3qaguk5dickebbsn3gllqpud5pni73oo.apps.googleusercontent.com';

// For Expo, we'll use AuthSession
export const GOOGLE_AUTH_CONFIG = {
    redirectUri: __DEV__
        ? 'http://localhost:8081'
        : 'your-production-app-url',
};