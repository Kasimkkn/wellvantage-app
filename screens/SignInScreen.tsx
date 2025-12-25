import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Toast } from '@/components/common/Toast';
import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
    const router = useRouter();
    const { signInWithGoogle, isLoading, error, clearError } = useAuthStore();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');

    const redirectUri = makeRedirectUri({
        scheme: 'wellvantageapp'
    });
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '509308286974-51u9h2b0l76rd7uvhb6tup0fkg68popm.apps.googleusercontent.com',
        webClientId: '509308286974-51u9h2b0l76rd7uvhb6tup0fkg68popm.apps.googleusercontent.com',
        redirectUri,
    });

    useEffect(() => {
        if (error) {
            showErrorToast(error);
        }
    }, [error]);

    // Handle Google auth response
    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            handleGoogleSuccess(
                authentication?.idToken!,
                authentication?.accessToken
            );
        } else if (response?.type === 'error') {
            showErrorToast('Google sign-in failed');
        }
    }, [response]);

    const handleGooglePress = async () => {
        try {
            console.log('🚀 Starting Google Sign-In...');

            router.replace('/(tabs)'); // or '/(tabs)/index'
            // await promptAsync();
        } catch (err: any) {
            console.error('❌ Sign-in error:', err);
            showErrorToast(err.message || 'Failed to sign in');
        }
    };

    const handleGoogleSuccess = async (
        idToken: string,
        accessToken?: string
    ) => {
        try {
            await signInWithGoogle(idToken, accessToken);
            showSuccessToast('Successfully signed in!');
        } catch (err: any) {
            console.error('❌ Sign-in error:', err);
            showErrorToast(err.message || 'Failed to sign in');
        }
    };

    const showErrorToast = (message: string) => {
        setToastMessage(message);
        setToastType('error');
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            clearError();
        }, 3000);
    };

    const showSuccessToast = (message: string) => {
        setToastMessage(message);
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen text="Signing you in..." />;
    }

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: insets.top + SPACING.md,
                        paddingBottom: insets.bottom + SPACING.lg,
                    },
                ]}
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.text.primary}
                    />
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>Sign Up</Text>

                    <Text style={styles.subtitle}>
                        Welcome! Manage, Track{'\n'}
                        and Grow your Gym with{'\n'}
                        WellVantage.
                    </Text>

                    <GoogleSignInButton
                        onClick={handleGooglePress}
                        loading={!request}
                    />
                </View>
            </View>
            <Toast
                visible={showToast}
                message={toastMessage}
                type={toastType}
                onHide={() => setShowToast(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: SPACING.lg,
    },
    backBtn: {
        marginBottom: SPACING.xl,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: 70,
    },
    subtitle: {
        fontSize: 22,
        color: COLORS.text.primary,
        textAlign: 'center',
        lineHeight: 30,
        fontWeight: '600',
        marginBottom: SPACING.xl,
    },
    googleIcon: {
        marginRight: SPACING.sm,
    },
});