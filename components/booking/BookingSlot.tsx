import { COLORS, } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { BookingStatus } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookingSlotProps {
    startTime: string;
    endTime: string;
    status: BookingStatus;
    onPress?: () => void;
    onDelete?: () => void;
}

export const BookingSlot: React.FC<BookingSlotProps> = ({
    startTime,
    endTime,
    status,
    onPress,
    onDelete,
}) => {
    const isOpen = status === BookingStatus.OPEN;
    const isBooked = status === BookingStatus.BOOKED;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.slotButton,
                    isOpen && styles.slotOpen,
                    isBooked && styles.slotBooked,
                ]}
                onPress={onPress}
                disabled={isBooked}
            >
                <Text style={[styles.timeText, isBooked && styles.bookedText]}>
                    {startTime} - {endTime}
                </Text>
            </TouchableOpacity>

            <View style={[styles.statusBadge, isOpen && styles.openBadge, isBooked && styles.bookedBadge]}>
                <Text style={styles.statusText}>{isOpen ? 'Open' : 'Booked'}</Text>
            </View>

            {onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    slotButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    slotOpen: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    slotBooked: {
        backgroundColor: COLORS.gray[100],
        borderColor: COLORS.gray[300],
    },
    timeText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        color: COLORS.text.primary,
        textAlign: 'center',
    },
    bookedText: {
        color: COLORS.text.disabled,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
    },
    openBadge: {
        backgroundColor: COLORS.success + '20',
    },
    bookedBadge: {
        backgroundColor: COLORS.gray[200],
    },
    statusText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    deleteButton: {
        padding: SPACING.sm,
    },
});