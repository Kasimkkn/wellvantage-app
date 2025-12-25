import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Toast } from '@/components/common/Toast';
import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface DayAvailability {
    date: string;
    slots: TimeSlot[];
}

export default function BookSlot() {
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>('2025-02-06');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 1, 1)); // February 2025
    const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
    const [sessionsLeft, setSessionsLeft] = useState(20);
    const [clientName] = useState('Rahul Verma');
    const [bookingDeadline] = useState('24 June 2026');

    // Toast state
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    useEffect(() => {
        loadAvailability();
    }, []);

    const loadAvailability = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - dates with available slots
            const mockData: DayAvailability[] = [
                {
                    date: '2025-02-06',
                    slots: [
                        { id: '1', startTime: '11:00 AM', endTime: '11:45 AM', isBooked: false },
                        { id: '2', startTime: '05:00 PM', endTime: '05:30 PM', isBooked: false }
                    ]
                },
                {
                    date: '2025-02-07',
                    slots: [
                        { id: '3', startTime: '09:00 AM', endTime: '10:00 AM', isBooked: false },
                        { id: '4', startTime: '02:00 PM', endTime: '03:00 PM', isBooked: true }
                    ]
                },
                {
                    date: '2025-02-13',
                    slots: [
                        { id: '5', startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false }
                    ]
                }
            ];

            setAvailabilityData(mockData);
        } catch (error) {
            showToast('Failed to load availability', 'error');
        } finally {
            setLoading(false);
        }
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
        return availabilityData.some(av => av.date === dateStr);
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

    const handleBookSlot = (slotId: string) => {
        setAvailabilityData(prev =>
            prev.map(day => ({
                ...day,
                slots: day.slots.map(slot =>
                    slot.id === slotId ? { ...slot, isBooked: true } : slot
                )
            }))
        );
        setSessionsLeft(prev => prev - 1);
        showToast('Slot booked successfully!', 'success');
    };

    const handleDeleteSlot = (slotId: string) => {
        setAvailabilityData(prev =>
            prev.map(day => ({
                ...day,
                slots: day.slots.filter(slot => slot.id !== slotId)
            }))
        );
        showToast('Slot deleted successfully', 'success');
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
                        isSelected && styles.calendarDaySelected
                    ]}
                    onPress={() => handleDateSelect(day)}
                    disabled={!hasSlots}
                >
                    <Text style={[
                        styles.calendarDayText,
                        hasSlots && styles.calendarDayTextActive,
                        isSelected && styles.calendarDayTextSelected
                    ]}>
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
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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

                <View style={styles.daysGrid}>
                    {calendarDays}
                </View>
            </View>
        );
    };

    const getSelectedDateSlots = () => {
        const dayData = availabilityData.find(day => day.date === selectedDate);
        return dayData?.slots || [];
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading availability..." />;
    }

    return (
        <View style={styles.container}>
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerCard}>
                    <Text style={styles.headerTitle}>Book Client Slots</Text>
                    <Text style={styles.headerSubtitle}>
                        {clientName} has {sessionsLeft} sessions left to book by {bookingDeadline}
                    </Text>
                </View>

                {renderCalendar()}

                <View style={styles.slotsSection}>
                    <Text style={styles.slotsTitle}>Available Slots:</Text>

                    {getSelectedDateSlots().length === 0 ? (
                        <View style={styles.noSlotsContainer}>
                            <Text style={styles.noSlotsText}>
                                No slots available for this date
                            </Text>
                        </View>
                    ) : (
                        getSelectedDateSlots().map(slot => (
                            <View key={slot.id} style={styles.slotCard}>
                                <View style={styles.slotInfo}>
                                    <Text style={styles.slotTime}>
                                        {slot.startTime} - {slot.endTime}
                                    </Text>
                                </View>

                                <View style={[
                                    styles.slotStatus,
                                    slot.isBooked ? styles.slotStatusBooked : styles.slotStatusOpen
                                ]}>
                                    <Text style={[
                                        styles.slotStatusText,
                                        slot.isBooked ? styles.slotStatusTextBooked : styles.slotStatusTextOpen
                                    ]}>
                                        {slot.isBooked ? 'Booked' : 'Open'}
                                    </Text>
                                </View>
                                <View style={styles.slotActions}>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteSlot(slot.id)}
                                    >
                                        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.sm,
    },
    slotInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: SPACING.md,
        borderColor: COLORS.success,
        borderWidth: 2,
        padding: SPACING.sm,
        borderRadius: 8,
    },
    slotTime: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.text.primary,
    },
    slotStatus: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: 6,
        width: 70,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slotStatusOpen: {
        backgroundColor: '#E8F5E9',
    },
    slotStatusBooked: {
        backgroundColor: COLORS.gray[200],
    },
    slotStatusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    slotStatusTextOpen: {
        color: '#2E7D32',
    },
    slotStatusTextBooked: {
        color: COLORS.text.secondary,
    },
    slotActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    bookButton: {
        paddingHorizontal: SPACING.md,
        minWidth: 80,
    },
    deleteButton: {
        padding: SPACING.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
});