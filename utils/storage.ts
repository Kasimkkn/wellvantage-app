
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    TOKEN: '@wellvantage_token',
    USER: '@wellvantage_user',
    THEME: '@wellvantage_theme',
} as const;

// Token operations
export const saveToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
        console.error('Error saving token:', error);
        throw error;
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const clearToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
        console.error('Error clearing token:', error);
        throw error;
    }
};

// User operations
export const saveUser = async (user: any): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

export const getUser = async (): Promise<any | null> => {
    try {
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const clearUser = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
        console.error('Error clearing user:', error);
        throw error;
    }
};

// Clear all storage
export const clearAllStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing storage:', error);
        throw error;
    }
};