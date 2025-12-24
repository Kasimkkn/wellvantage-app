import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = COLORS.primary,
    text,
    fullScreen = false,
}) => {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    text: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
});