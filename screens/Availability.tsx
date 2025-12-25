import { AvailabilityCard } from '@/components/availability/AvailabilityCard';
import { CalendarPicker } from '@/components/availability/CalendarPicker';
import { SessionNameInput } from '@/components/availability/SessionNameInput';
import { TimePicker } from '@/components/availability/TimePicker';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Toast } from '@/components/common/Toast';
import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Availability } from '../types/availability.types';

export default function AvailabilityScreen() {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Toast state
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        sessionName: '',
        isRecurring: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Simulate loading data
    useEffect(() => {
        loadAvailabilities();
    }, []);

    const loadAvailabilities = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data
            const mockData: Availability[] = [
                {
                    id: '1',
                    date: '2025-02-06',
                    startTime: '11:45',
                    endTime: '18:45',
                    sessionName: 'Open',
                    isRecurring: false,
                    userId: '',
                    createdAt: '',
                    updatedAt: ''
                },
                {
                    id: '2',
                    date: '2025-02-07',
                    startTime: '17:05',
                    endTime: '17:30',
                    sessionName: 'Open',
                    isRecurring: false,
                    userId: '',
                    createdAt: '',
                    updatedAt: ''
                },
            ];

            setAvailabilities(mockData);
        } catch (error) {
            showToast('Failed to load availabilities', 'error');
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.sessionName) {
            newErrors.sessionName = 'Session name is required';
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Start time is required';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'End time is required';
        }

        if (formData.startTime && formData.endTime) {
            const start = new Date(`2000-01-01T${formData.startTime}`);
            const end = new Date(`2000-01-01T${formData.endTime}`);
            if (start >= end) {
                newErrors.endTime = 'End time must be after start time';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '17:00',
            sessionName: '',
            isRecurring: false,
        });
        setErrors({});
        setShowForm(true);
    };

    const handleEdit = (availability: Availability) => {
        setEditingId(availability.id);
        setFormData({
            date: availability.date,
            startTime: availability.startTime,
            endTime: availability.endTime,
            sessionName: availability.sessionName,
            isRecurring: availability.isRecurring,
        });
        setErrors({});
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setAvailabilities(prev => prev.filter(a => a.id !== id));
        showToast('Availability deleted successfully', 'success');
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (editingId) {
                // Update existing
                setAvailabilities(prev =>
                    prev.map(a =>
                        a.id === editingId
                            ? { ...a, ...formData }
                            : a
                    )
                );
                showToast('Availability updated successfully', 'success');
            } else {
                // Create new
                const newAvailability: Availability = {
                    id: Date.now().toString(),
                    ...formData,
                    userId: '',
                    createdAt: '',
                    updatedAt: ''
                };
                setAvailabilities(prev => [...prev, newAvailability]);
                showToast('Availability created successfully', 'success');
            }

            setShowForm(false);
        } catch (error) {
            showToast('Failed to save availability', 'error');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '17:00',
            sessionName: '',
            isRecurring: false,
        });
        setErrors({});
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading availabilities..." />;
    }

    return (
        <View style={styles.container}>
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />

            {!showForm && availabilities.length === 0 ? (
                <EmptyState
                    icon="calendar-outline"
                    title="No Availability Set"
                    description="Create your first availability slot to let clients know when you're available"
                    actionText="Set Availability"
                    onAction={handleCreate}
                />
            ) : showForm ? (
                <>
                    <View
                        style={styles.formContainer}
                    >
                        <View style={styles.formHeader}>
                            <Text style={styles.formTitle}>
                                {editingId ? 'Edit Availability' : 'Set Availability'}
                            </Text>
                        </View>

                        <ScrollView
                            style={styles.formContent}
                            contentContainerStyle={styles.formScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>Date*</Text>
                                <CalendarPicker
                                    selectedDate={formData.date}
                                    onDateSelect={(date) =>
                                        setFormData({ ...formData, date })
                                    }
                                    minDate={new Date().toISOString().split('T')[0]}
                                />
                            </View>

                            <View style={styles.formTimeSection}>
                                <TimePicker
                                    label="Start Time*"
                                    value={formData.startTime}
                                    onChange={(time) =>
                                        setFormData({ ...formData, startTime: time })
                                    }
                                    error={errors.startTime}
                                />

                                <TimePicker
                                    label="End Time*"
                                    value={formData.endTime}
                                    onChange={(time) =>
                                        setFormData({ ...formData, endTime: time })
                                    }
                                    error={errors.endTime}
                                    minimumTime={formData.startTime}
                                />
                            </View>

                            <View style={styles.formSection}>
                                <View style={styles.repeatContainer}>
                                    <View>
                                        <Text style={styles.repeatLabel}>Repeat Sessions</Text>
                                    </View>
                                    <Switch
                                        value={formData.isRecurring}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, isRecurring: value })
                                        }
                                        trackColor={{
                                            false: COLORS.gray[300],
                                            true: COLORS.primary,
                                        }}
                                        thumbColor={COLORS.white}
                                    />
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <SessionNameInput
                                    value={formData.sessionName}
                                    onChange={(value) =>
                                        setFormData({ ...formData, sessionName: value })
                                    }
                                    error={errors.sessionName}
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.formFooter}>
                            <Button
                                title="Cancel"
                                onPress={handleCancel}
                                variant="outline"
                                style={styles.footerButton}
                            />
                            <Button
                                title={editingId ? 'Update' : 'Create'}
                                onPress={handleSubmit}
                                variant="primary"
                                style={styles.footerButton}
                            />
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {availabilities.map(availability => (
                            <AvailabilityCard
                                key={availability.id}
                                availability={availability}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.fabContainer}>
                        <TouchableOpacity
                            style={styles.fab}
                            onPress={handleCreate}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add" size={28} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    scrollView: {
        flex: 1,
    },
    fabContainer: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: SPACING.lg,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    formContainer: {
        flex: 1,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    formContent: {
        flex: 1,
    },
    formScrollContent: {
        padding: SPACING.md,
    },
    formSection: {
        marginBottom: SPACING.md,
    },
    formTimeSection: {
        marginBottom: SPACING.md,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    repeatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.xs,
        backgroundColor: COLORS.white,
    },
    repeatLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    formFooter: {
        flexDirection: 'row',
        gap: SPACING.md,
        padding: SPACING.lg,
    },
    footerButton: {
        flex: 1,
    },
});