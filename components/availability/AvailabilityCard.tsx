import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { formatDisplayDate, formatDisplayTime } from '@/utils/dataFormatter';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Availability } from '../../types/availability.types';
import { Card } from '../common/Card';

interface AvailabilityCardProps {
    availability: Availability;
    onEdit?: (availability: Availability) => void;
    onDelete?: (id: string) => void;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
    availability,
    onEdit,
    onDelete,
}) => {
    const handleDelete = () => {
        Alert.alert(
            'Delete Availability',
            'Are you sure you want to delete this availability slot?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete?.(availability.id),
                },
            ]
        );
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View style={styles.sessionBadge}>
                    <Text style={styles.sessionName}>{availability.sessionName}</Text>
                </View>

                <View style={styles.actions}>
                    {onEdit && (
                        <TouchableOpacity
                            onPress={() => onEdit(availability)}
                            style={styles.actionButton}
                        >
                            <Ionicons name="pencil" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    )}

                    {onDelete && (
                        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.gray[600]} />
                    <Text style={styles.infoText}>
                        {formatDisplayDate(availability.date)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color={COLORS.gray[600]} />
                    <Text style={styles.infoText}>
                        {formatDisplayTime(availability.startTime)} -{' '}
                        {formatDisplayTime(availability.endTime)}
                    </Text>
                </View>

                {availability.isRecurring && (
                    <View style={styles.infoRow}>
                        <Ionicons name="repeat-outline" size={18} color={COLORS.primary} />
                        <Text style={[styles.infoText, styles.recurringText]}>
                            Recurring Session
                        </Text>
                    </View>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sessionBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
    },
    sessionName: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: FONT_SIZES.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        padding: SPACING.xs,
    },
    content: {
        gap: SPACING.sm,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    recurringText: {
        color: COLORS.primary,
        fontWeight: '500',
    },
});