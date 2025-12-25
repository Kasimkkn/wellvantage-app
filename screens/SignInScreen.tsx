import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Toast } from '@/components/common/Toast';
import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SignInScreen() {
    const { signInWithGoogle, isLoading, error, clearError } = useAuthStore();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');

    useEffect(() => {
        if (error) {
            showErrorToast(error);
        }
    }, [error]);

    const handleGooglePress = async () => {
        try {
            console.log('🚀 Starting Google Sign-In...');
            await signInWithGoogle();
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

                    <GoogleSignInButton onClick={handleGooglePress} />
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
