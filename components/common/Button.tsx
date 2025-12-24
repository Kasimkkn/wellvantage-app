import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';


interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
    icon,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? COLORS.white : COLORS.primary}
                    size="small"
                />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            styles[`${variant}Text`],
                            styles[`${size}Text`],
                            isDisabled && styles.disabledText,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.lg,
    },
    // Variants
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.gray[200],
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    // Sizes
    small: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    medium: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    large: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
    },
    // States
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },
    // Text styles
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryText: {
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.text.primary,
    },
    outlineText: {
        color: COLORS.primary,
    },
    ghostText: {
        color: COLORS.primary,
    },
    smallText: {
        fontSize: FONT_SIZES.sm,
    },
    mediumText: {
        fontSize: FONT_SIZES.md,
    },
    largeText: {
        fontSize: FONT_SIZES.lg,
    },
    disabledText: {
        color: COLORS.text.disabled,
    },
});