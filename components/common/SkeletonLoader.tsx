import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS } from '@/constants/spacing';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface SkeletonLoaderProps {
    width?: number | `${number}%`;
    height?: number;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = 20,
    borderRadius = BORDER_RADIUS.md,
    style,
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, borderRadius, opacity },
                style,
            ]}
        />
    );
};

export const SkeletonCard: React.FC = () => {
    return (
        <View style={styles.card}>
            <SkeletonLoader width="60%" height={20} style={styles.title} />
            <SkeletonLoader width="100%" height={16} style={styles.line} />
            <SkeletonLoader width="80%" height={16} style={styles.line} />
            <SkeletonLoader width="40%" height={24} style={styles.button} />
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: COLORS.gray[300],
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: 16,
        marginBottom: 12,
    },
    title: {
        marginBottom: 12,
    },
    line: {
        marginBottom: 8,
    },
    button: {
        marginTop: 12,
    },
});