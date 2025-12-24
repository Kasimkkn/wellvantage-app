import { saveToken } from '@/utils/storage';
import * as Linking from 'expo-linking';

export const handleAuthRedirect = async () => {
    const url = await Linking.getInitialURL();
    if (!url) return;

    const { queryParams } = Linking.parse(url);
    const token = queryParams?.token as string;

    if (token) {
        await saveToken(token);
    }
};
