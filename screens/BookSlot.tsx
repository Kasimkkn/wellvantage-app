import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Toast } from '@/components/common/Toast';
import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { useAvailabilityStore } from '@/store/availabilityStore';
import { useBookingStore } from '@/store/bookingStore';
import { BookingStatus } from '@/types/booking.types';
import { formatDisplayTime } from '@/utils/dataFormatter';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BookSlot() {
    const {
        availabilities,
        isLoading: availabilityLoading,
        fetchAvailabilities,
    } = useAvailabilityStore();

    const {
        bookings,
        isLoading: bookingLoading,
        error: bookingError,
        fetchBookings,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        clearError,
    } = useBookingStore();

    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [refreshing, setRefreshing] = useState(false);

    // Toast state
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    // Client info (static for now)
    const [clientName] = useState('Rahul Verma');

    useEffect(() => {
        loadData();
    }, []);

    // Show error from store
    useEffect(() => {
        if (bookingError) {
            showToast(bookingError, 'error');
            clearError();
        }
    }, [bookingError]);

    const loadData = async () => {
        try {
            await Promise.all([
                fetchAvailabilities(),
                fetchBookings(),
            ]);
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const showToast = (message: string, type: typeof toast.type) => {
        setToast({ visible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const hasAvailability = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availabilities.some(av => av.date === dateStr);
    };

    const isSelectedDate = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return dateStr === selectedDate;
    };

    const handleDateSelect = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (hasAvailability(day)) {
            setSelectedDate(dateStr);
        }
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const getBookingForAvailability = (availabilityId: string, startTime: string) => {
        return bookings.find(
            booking =>
                booking.availabilityId === availabilityId &&
                booking.startTime === startTime &&
                booking.bookingDate === selectedDate
        );
    };

    const handleBookSlot = async (availabilityId: string, startTime: string, endTime: string) => {
        try {
            await createBooking({
                availabilityId,
                bookingDate: selectedDate,
                startTime,
                endTime,
                status: BookingStatus.OPEN,
            });
            showToast('Slot booked successfully!', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to book slot', 'error');
        }
    };

    const handleToggleBookingStatus = async (bookingId: string, currentStatus: BookingStatus) => {
        try {
            const newStatus = currentStatus === BookingStatus.OPEN
                ? BookingStatus.BOOKED
                : BookingStatus.OPEN;

            await updateBookingStatus(bookingId, newStatus);
            showToast(
                `Slot marked as ${newStatus === BookingStatus.BOOKED ? 'booked' : 'open'}`,
                'success'
            );
        } catch (err: any) {
            showToast(err.message || 'Failed to update booking status', 'error');
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        Alert.alert(
            'Delete Booking',
            'Are you sure you want to delete this booking?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteBooking(bookingId);
                            showToast('Booking deleted successfully', 'success');
                        } catch (err: any) {
                            showToast(err.message || 'Failed to delete booking', 'error');
                        }
                    },
                },
            ]
        );
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const hasSlots = hasAvailability(day);
            const isSelected = isSelectedDate(day);

            calendarDays.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.calendarDay,
                        hasSlots && styles.calendarDayWithSlots,
                        isSelected && styles.calendarDaySelected,
                    ]}
                    onPress={() => handleDateSelect(day)}
                    disabled={!hasSlots}
                >
                    <Text
                        style={[
                            styles.calendarDayText,
                            hasSlots && styles.calendarDayTextActive,
                            isSelected && styles.calendarDayTextSelected,
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={handlePreviousMonth}>
                        <Ionicons name="chevron-back" size={20} color={COLORS.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.calendarMonth}>
                        {currentMonth.toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                    <TouchableOpacity onPress={handleNextMonth}>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.text.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDaysContainer}>
                    {weekDays.map((day, index) => (
                        <View key={index} style={styles.weekDay}>
                            <Text style={styles.weekDayText}>{day}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.daysGrid}>{calendarDays}</View>
            </View>
        );
    };

    const getSelectedDateAvailabilities = () => {
        return availabilities.filter(av => av.date === selectedDate);
    };

    const getTotalSessionsLeft = () => {
        return bookings.filter(b => b.status === BookingStatus.OPEN).length;
    };

    const loading = availabilityLoading || bookingLoading;

    if (loading && availabilities.length === 0 && !refreshing) {
        return <LoadingSpinner fullScreen text="Loading bookings..." />;
    }

    return (
        <View style={styles.container}>
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />

            {availabilities.length === 0 ? (
                <EmptyState
                    icon="calendar-outline"
                    title="No Availability Set"
                    description="Create availability slots first to enable bookings"
                    actionText="Go to Availability"
                    onAction={() => {
                        // Navigate to availability tab
                        // You can use router.push('/(tabs)/availability')
                    }}
                />
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                >
                    <View style={styles.headerCard}>
                        <Text style={styles.headerTitle}>Book Client Slots</Text>
                        <Text style={styles.headerSubtitle}>
                            {clientName} has {getTotalSessionsLeft()} open session(s)
                        </Text>
                    </View>

                    {renderCalendar()}

                    <View style={styles.slotsSection}>
                        <Text style={styles.slotsTitle}>Available Slots:</Text>

                        {getSelectedDateAvailabilities().length === 0 ? (
                            <View style={styles.noSlotsContainer}>
                                <Text style={styles.noSlotsText}>
                                    No slots available for this date
                                </Text>
                            </View>
                        ) : (
                            getSelectedDateAvailabilities().map(availability => {
                                const booking = getBookingForAvailability(
                                    availability.id,
                                    availability.startTime
                                );

                                return (
                                    <View key={availability.id} style={styles.slotCard}>
                                        <View style={styles.slotInfo}>
                                            <Text style={styles.slotTime}>
                                                {formatDisplayTime(availability.startTime)} -{' '}
                                                {formatDisplayTime(availability.endTime)}
                                            </Text>
                                            {/* <Text>
                                                {availability.sessionName}
                                            </Text> */}
                                        </View>

                                        {booking ? (
                                            <>
                                                <View
                                                    style={[
                                                        styles.slotStatus,
                                                        booking.status === BookingStatus.BOOKED
                                                            ? styles.slotStatusBooked
                                                            : styles.slotStatusOpen,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.slotStatusText,
                                                            booking.status === BookingStatus.BOOKED
                                                                ? styles.slotStatusTextBooked
                                                                : styles.slotStatusTextOpen,
                                                        ]}
                                                    >
                                                        {booking.status === BookingStatus.BOOKED
                                                            ? 'Booked'
                                                            : 'Open'}
                                                    </Text>
                                                </View>

                                                <View style={styles.slotActions}>
                                                    <TouchableOpacity
                                                        style={styles.actionButton}
                                                        onPress={() =>
                                                            handleToggleBookingStatus(
                                                                booking.id,
                                                                booking.status
                                                            )
                                                        }
                                                    >
                                                        <Ionicons
                                                            name={
                                                                booking.status === BookingStatus.BOOKED
                                                                    ? 'checkmark-circle-outline'
                                                                    : 'close-circle-outline'
                                                            }
                                                            size={20}
                                                            color={COLORS.primary}
                                                        />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={styles.deleteButton}
                                                        onPress={() => handleDeleteBooking(booking.id)}
                                                    >
                                                        <Ionicons
                                                            name="trash-outline"
                                                            size={20}
                                                            color={COLORS.error}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.bookButton}
                                                onPress={() =>
                                                    handleBookSlot(
                                                        availability.id,
                                                        availability.startTime,
                                                        availability.endTime
                                                    )
                                                }
                                            >
                                                <Text style={styles.bookButtonText}>Book</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    headerCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
        gap: SPACING.md,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        lineHeight: 20,
    },
    calendarContainer: {
        backgroundColor: COLORS.white,
        padding: SPACING.xl,
        marginBottom: SPACING.md,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.xs,
    },
    calendarMonth: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    weekDay: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.xs,
    },
    weekDayText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    calendarDayWithSlots: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: '100%',
        width: 36,
        height: 36,

    },
    calendarDaySelected: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
        borderRadius: '100%',
        width: 36,
        height: 36,
    },
    calendarDayText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.disabled,
    },
    calendarDayTextActive: {
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    calendarDayTextSelected: {
        color: COLORS.white,
        fontWeight: '600',
        borderRadius: 100,

    },
    slotsSection: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
    },
    slotsTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    noSlotsContainer: {
        paddingVertical: SPACING.xl,
        alignItems: 'center',
    },
    noSlotsText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
    slotCard: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: SPACING.md,
    },
    slotInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: COLORS.success,
        borderWidth: 1,
        padding: SPACING.sm,
        borderRadius: 5,
    },
    slotTime: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.text.primary,
    },
    slotStatus: {
        padding: SPACING.sm,
        minWidth: 70,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    },
    slotStatusOpen: {
        backgroundColor: '#E8F5E9',
    },
    slotStatusBooked: {
        backgroundColor: COLORS.primary,
    },
    slotStatusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    slotStatusTextOpen: {
        color: '#2E7D32',
    },
    slotStatusTextBooked: {
        color: COLORS.white,
    },
    slotActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    bookButton: {
        padding: SPACING.sm,
        minWidth: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 5,
    },
    deleteButton: {
        padding: SPACING.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        padding: SPACING.xs,
        borderRadius: 5,
    },
    bookButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '400',
    },
});