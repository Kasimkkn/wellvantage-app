import * as AuthSession from 'expo-auth-session';

export const API_CONFIG = {
    // BASE_URL: __DEV__
    //     ? 'http://192.168.0.104:3000'
    //     : 'https://wellvantage-backend-production.up.railway.app/',
    BASE_URL: 'https://wellvantage-backend-production.up.railway.app/',
    TIMEOUT: 30000,
};

export const GOOGLE_AUTH_CONFIG = {
    clientId: '509308286974-3qaguk5dickebbsn3gllqpud5pni73oo.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({
    }),
};
