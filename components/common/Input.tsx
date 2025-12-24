import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';


interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}
            >
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={COLORS.gray[500]}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[styles.input, style]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor={COLORS.gray[400]}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
                        <Ionicons
                            name={rightIcon}
                            size={20}
                            color={COLORS.gray[500]}
                            style={styles.rightIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
            {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    inputContainerError: {
        borderColor: COLORS.error,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    leftIcon: {
        marginRight: SPACING.sm,
    },
    rightIcon: {
        marginLeft: SPACING.sm,
    },
    error: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    helperText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.text.secondary,
        marginTop: SPACING.xs,
    },
});