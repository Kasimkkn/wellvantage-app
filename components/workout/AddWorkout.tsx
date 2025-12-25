import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { Day, Exercise, useWorkout } from '@/context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const AddWorkout = ({ onClose }: { onClose: () => void }) => {
    const { addWorkout } = useWorkout();

    const [title, setTitle] = useState('');
    const [days, setDays] = useState<Day[]>([
        {
            id: Date.now().toString(),
            dayNumber: 1,
            name: '',
            exercises: []
        }
    ]);
    const [notes, setNotes] = useState('');

    const addDay = () => {
        const newDay: Day = {
            id: Date.now().toString(),
            dayNumber: days.length + 1,
            name: '',
            exercises: []
        };
        setDays([...days, newDay]);
    };

    const deleteDay = (dayId: string) => {
        if (days.length === 1) {
            Alert.alert('Error', 'You must have at least one day');
            return;
        }
        setDays(days.filter(d => d.id !== dayId));
    };

    const updateDayName = (dayId: string, name: string) => {
        setDays(days.map(d => d.id === dayId ? { ...d, name } : d));
    };

    const addExercise = (dayId: string) => {
        const newExercise: Exercise = {
            id: Date.now().toString(),
            name: '',
            sets: '',
            reps: ''
        };
        setDays(days.map(d =>
            d.id === dayId
                ? { ...d, exercises: [...d.exercises, newExercise] }
                : d
        ));
    };

    const deleteExercise = (dayId: string, exerciseId: string) => {
        setDays(days.map(d =>
            d.id === dayId
                ? { ...d, exercises: d.exercises.filter(e => e.id !== exerciseId) }
                : d
        ));
    };

    const updateExercise = (dayId: string, exerciseId: string, field: keyof Exercise, value: string) => {
        setDays(days.map(d =>
            d.id === dayId
                ? {
                    ...d,
                    exercises: d.exercises.map(e =>
                        e.id === exerciseId ? { ...e, [field]: value } : e
                    )
                }
                : d
        ));
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a workout title');
            return;
        }

        const hasEmptyDay = days.some(d => !d.name.trim());
        if (hasEmptyDay) {
            Alert.alert('Error', 'Please name all days');
            return;
        }

        addWorkout({ title, days, notes });
        Alert.alert('Success', 'Workout added successfully', [
            { text: 'OK', onPress: onClose }
        ]);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {/* Title Input */}
            <TextInput
                placeholder="Beginner's Workout - 3 days"
                placeholderTextColor={COLORS.text.secondary}
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />

            {/* Days */}
            {days.map((day, dayIndex) => (
                <View key={day.id}>
                    {/* Day Header */}
                    <View style={styles.dayRow}>
                        <View style={styles.dayBadge}>
                            <Text style={styles.dayText}>Day {day.dayNumber}</Text>
                        </View>

                        <TextInput
                            placeholder="Chest"
                            placeholderTextColor={COLORS.text.secondary}
                            style={styles.inputSmall}
                            value={day.name}
                            onChangeText={(text) => updateDayName(day.id, text)}
                        />
                        <Pressable onPress={() => deleteDay(day.id)}>
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color="#F44336"
                            />                        </Pressable>
                    </View>

                    {/* Column Headers */}
                    {day.exercises.length > 0 && (
                        <View style={styles.headerRow}>
                            <Text style={[styles.headerText, { flex: 1, textAlign: 'left' }]}>Exercise</Text>
                            <Text style={styles.headerText}>Sets</Text>
                            <Text style={styles.headerText}>Reps</Text>
                            <View style={{ width: 24 }} />
                        </View>
                    )}

                    {/* Exercise rows */}
                    {day.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseRow}>
                            <TextInput
                                style={styles.exerciseNameInput}
                                placeholder="Exercise name"
                                placeholderTextColor={COLORS.text.secondary}
                                value={exercise.name}
                                onChangeText={(text) => updateExercise(day.id, exercise.id, 'name', text)}
                            />

                            <TextInput
                                style={styles.smallInput}
                                value={exercise.sets}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={COLORS.text.secondary}
                                onChangeText={(text) => updateExercise(day.id, exercise.id, 'sets', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                value={exercise.reps}
                                placeholder="0"
                                placeholderTextColor={COLORS.text.secondary}
                                onChangeText={(text) => updateExercise(day.id, exercise.id, 'reps', text)}
                            />
                            <Pressable onPress={() => deleteExercise(day.id, exercise.id)}>
                                <Ionicons
                                    name="trash-outline"
                                    size={20}
                                    color="#F44336"
                                />
                            </Pressable>
                        </View>
                    ))}

                    {/* Add Exercise Button */}
                    <Pressable style={styles.addBtn} onPress={() => addExercise(day.id)}>
                        <Text style={styles.addIcon}>+</Text>
                    </Pressable>
                </View>
            ))}

            {/* Add Day Button */}
            <Pressable style={styles.addDayBtn} onPress={addDay}>
                <Text style={styles.addDayText}>+ Add Day</Text>
            </Pressable>

            {/* Notes Input */}
            <TextInput
                multiline
                placeholder="Bench Press: www.benchpress.com&#x0a;Eat Oats"
                placeholderTextColor={COLORS.text.secondary}
                style={styles.notes}
                value={notes}
                onChangeText={setNotes}
            />

            <Text style={styles.words}>{Math.max(0, 45 - notes.split(/\s+/).filter(w => w).length)} words remaining</Text>

            {/* Submit Button */}
            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
            </Pressable>
        </ScrollView>
    );
};

export default AddWorkout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.white,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
    },
    dayBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.sm,
        borderTopLeftRadius: BORDER_RADIUS.full,
        borderBottomLeftRadius: BORDER_RADIUS.full,
    },
    dayText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    inputSmall: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.white,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    delete: {
        fontSize: 20,
        color: COLORS.error,
    },
    deleteSmall: {
        fontSize: 18,
        color: COLORS.error,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
        paddingHorizontal: SPACING.xs,
    },
    headerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        fontWeight: '600',
        width: 50,
        textAlign: 'center',
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginVertical: SPACING.xs,
        paddingHorizontal: SPACING.xs,
    },
    exerciseNameInput: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.xs,
        backgroundColor: COLORS.white,
    },
    smallInput: {
        width: 50,
        height: 36,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        textAlign: 'center',
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.xs,
        backgroundColor: COLORS.white,
    },
    addBtn: {
        alignSelf: 'center',
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    addIcon: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: '300',
    },
    addDayBtn: {
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginVertical: SPACING.md,
    },
    addDayText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    notes: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        minHeight: 80,
        padding: SPACING.md,
        marginTop: SPACING.sm,
        backgroundColor: COLORS.white,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        textAlignVertical: 'top',
    },
    words: {
        textAlign: 'right',
        color: COLORS.warning,
        fontSize: FONT_SIZES.sm,
        marginVertical: SPACING.sm,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    submitText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
    },
});