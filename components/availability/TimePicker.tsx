import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { formatDisplayTime } from '@/utils/dataFormatter';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TimePickerProps {
    label: string;
    value: string; // Format: "HH:MM"
    onChange: (time: string) => void;
    error?: string;
    minimumTime?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
    label,
    value,
    onChange,
    error,
    minimumTime,
}) => {
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState(() => {
        const [hours, minutes] = value.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date;
    });

    const handleChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (selectedDate) {
            setTempDate(selectedDate);
            const hours = selectedDate.getHours().toString().padStart(2, '0');
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
            onChange(`${hours}:${minutes}`);
        }
    };

    const handleConfirm = () => {
        setShow(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[styles.timeButton, error && styles.timeButtonError]}
                onPress={() => setShow(true)}
            >
                <Ionicons name="time-outline" size={20} color={COLORS.gray[600]} />
                <Text style={styles.timeText}>
                    {value ? formatDisplayTime(value) : 'Select time'}
                </Text>
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            {Platform.OS === 'ios' ? (
                <Modal
                    visible={show}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShow(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                    <Text style={styles.cancelButton}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>{label}</Text>
                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text style={styles.doneButton}>Done</Text>
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={tempDate}
                                mode="time"
                                display="spinner"
                                onChange={handleChange}
                                textColor={COLORS.text.primary}
                            />
                        </View>
                    </View>
                </Modal>
            ) : (
                show && (
                    <DateTimePicker
                        value={tempDate}
                        mode="time"
                        display="default"
                        onChange={handleChange}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        flex: 1
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    timeButtonError: {
        borderColor: COLORS.error,
    },
    timeText: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    error: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        paddingBottom: SPACING.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    cancelButton: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
    doneButton: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: '600',
    },
});