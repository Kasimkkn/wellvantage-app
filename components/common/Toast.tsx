import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    visible: boolean;
    onHide?: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    visible,
    onHide,
    duration = 3000,
}) => {
    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(duration),
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onHide?.();
            });
        }
    }, [visible]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'close-circle';
            case 'warning':
                return 'warning';
            default:
                return 'information-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return COLORS.success;
            case 'error':
                return COLORS.error;
            case 'warning':
                return COLORS.warning;
            default:
                return COLORS.info;
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: getColor(), transform: [{ translateY }] },
            ]}
        >
            <Ionicons name={getIcon()} size={24} color={COLORS.white} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 15,
        left: SPACING.md,
        right: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        zIndex: 1000,
        elevation: 5,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    message: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        fontWeight: '500',
    },
});