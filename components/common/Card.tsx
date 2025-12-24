import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, SPACING } from '@/constants/spacing';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    elevation?: number;
}

export const Card: React.FC<CardProps> = ({ children, style, elevation = 2 }) => {
    return (
        <View style={[styles.card, { elevation }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});