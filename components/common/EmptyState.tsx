import { Button } from '@/components/common/Button';
import { COLORS, } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'folder-open-outline',
    title,
    description,
    actionText,
    onAction,
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={COLORS.gray[300]} />
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
            {actionText && onAction && (
                <Button
                    title={actionText}
                    onPress={onAction}
                    variant="primary"
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginTop: SPACING.lg,
        textAlign: 'center',
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
        marginTop: SPACING.sm,
        textAlign: 'center',
        maxWidth: 300,
    },
    button: {
        marginTop: SPACING.xl,
    },
});