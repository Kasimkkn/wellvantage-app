import AddWorkout from '@/components/workout/AddWorkout';
import { COLORS } from '@/constants/colors';
import { useWorkout } from '@/context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Workout() {
    const [showForm, setShowForm] = useState(false);
    const { workouts, deleteWorkout } = useWorkout();

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        console.log('Deleting workout:', id);
                        deleteWorkout(id);
                    }
                }
            ]
        );
    };

    console.log('Workouts:', workouts); // Debug log

    return (
        <View style={styles.container}>
            {!showForm ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownText}>Custom Workout Plans</Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </View>

                    {workouts.length === 0 ? (
                        <Text style={styles.emptyText}>No workouts yet. Add one!</Text>
                    ) : (
                        workouts.map(item => (
                            <View key={item.id} style={styles.row}>
                                <Text style={styles.workoutTitle}>{item.title}</Text>
                                <Pressable
                                    onPress={() => handleDelete(item.id, item.title)}
                                    hitSlop={8}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={20}
                                        color="#F44336"
                                    />
                                </Pressable>
                            </View>
                        ))
                    )}

                    <Pressable style={styles.addBtn} onPress={() => setShowForm(true)}>
                        <Text style={styles.addIcon}>+</Text>
                    </Pressable>
                </ScrollView>
            ) : (
                <AddWorkout onClose={() => setShowForm(false)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 24,
    },
    dropdownText: {
        fontSize: 16,
        color: '#212121',
    },
    dropdownIcon: {
        fontSize: 14,
        color: '#757575',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.gray[300],
    },
    workoutTitle: {
        fontSize: 16,
        color: '#212121',
        flex: 1,
    },
    deleteButton: {
        padding: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#757575',
        marginTop: 32,
        fontSize: 16,
    },
    addBtn: {
        alignSelf: 'center',
        backgroundColor: '#4CAF50',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 32,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addIcon: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '300',
    },
});