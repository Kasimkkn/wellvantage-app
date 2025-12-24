import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { formatDisplayDate, formatDisplayTime } from '@/utils/dataFormatter';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Booking, BookingStatus } from '../../types/booking.types';
import { Card } from '../common/Card';

interface BookingCardProps {
    booking: Booking;
    onUpdateStatus?: (id: string, status: BookingStatus) => void;
    onDelete?: (id: string) => void;
    showUserInfo?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
    booking,
    onUpdateStatus,
    onDelete,
    showUserInfo = false,
}) => {
    const isOpen = booking.status === BookingStatus.OPEN;

    const handleDelete = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => onDelete?.(booking.id),
                },
            ]
        );
    };

    const handleStatusToggle = () => {
        const newStatus = isOpen ? BookingStatus.BOOKED : BookingStatus.OPEN;
        onUpdateStatus?.(booking.id, newStatus);
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.statusBadge,
                        isOpen ? styles.openBadge : styles.bookedBadge,
                    ]}
                >
                    <Text style={styles.statusText}>
                        {isOpen ? 'Available' : 'Booked'}
                    </Text>
                </View>

                {onDelete && (
                    <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {showUserInfo && booking.user && (
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={18} color={COLORS.gray[600]} />
                        <Text style={styles.infoText}>{booking.user.name}</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.gray[600]} />
                    <Text style={styles.infoText}>
                        {formatDisplayDate(booking.bookingDate)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color={COLORS.gray[600]} />
                    <Text style={styles.infoText}>
                        {formatDisplayTime(booking.startTime)} -{' '}
                        {formatDisplayTime(booking.endTime)}
                    </Text>
                </View>
            </View>

            {onUpdateStatus && (
                <TouchableOpacity
                    style={[styles.actionButton, isOpen ? styles.bookButton : styles.openButton]}
                    onPress={handleStatusToggle}
                >
                    <Text style={styles.actionButtonText}>
                        {isOpen ? 'Mark as Booked' : 'Mark as Open'}
                    </Text>
                </TouchableOpacity>
            )}
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
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
    },
    openBadge: {
        backgroundColor: COLORS.success + '20',
    },
    bookedBadge: {
        backgroundColor: COLORS.info + '20',
    },
    statusText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    deleteButton: {
        padding: SPACING.xs,
    },
    content: {
        gap: SPACING.sm,
        marginBottom: SPACING.md,
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
    actionButton: {
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    bookButton: {
        backgroundColor: COLORS.primary,
    },
    openButton: {
        backgroundColor: COLORS.gray[300],
    },
    actionButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.white,
    },
});