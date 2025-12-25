// @/context/WorkoutContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Exercise = {
    id: string;
    name: string;
    sets: string;
    reps: string;
};

export type Day = {
    id: string;
    dayNumber: number;
    name: string;
    exercises: Exercise[];
};

export type Workout = {
    id: string;
    title: string;
    days: Day[];
    notes: string;
};

type WorkoutContextType = {
    workouts: Workout[];
    addWorkout: (workout: Omit<Workout, 'id'>) => void;
    deleteWorkout: (id: string) => void;
    updateWorkout: (id: string, workout: Partial<Workout>) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
    const [workouts, setWorkouts] = useState<Workout[]>([
        {
            id: '1',
            title: "Beginner's Workout - 3 Days",
            days: [
                {
                    id: 'd1',
                    dayNumber: 1,
                    name: 'Chest',
                    exercises: [
                        { id: 'e1', name: 'Chest Press', sets: '10', reps: '5-8' },
                        { id: 'e2', name: 'Bench Press', sets: '8', reps: '3' },
                    ]
                }
            ],
            notes: ''
        },
        {
            id: '2',
            title: "Beginner's Full Body",
            days: [
                {
                    id: 'd2',
                    dayNumber: 1,
                    name: 'Full Body',
                    exercises: [
                        { id: 'e3', name: 'Squats', sets: '10', reps: '8-10' },
                    ]
                }
            ],
            notes: ''
        },
    ]);

    const addWorkout = (workout: Omit<Workout, 'id'>) => {
        const newWorkout: Workout = {
            ...workout,
            id: Date.now().toString(),
        };
        setWorkouts(prev => [...prev, newWorkout]);
    };

    const deleteWorkout = (id: string) => {
        setWorkouts(prev => prev.filter(w => w.id !== id));
    };

    const updateWorkout = (id: string, workout: Partial<Workout>) => {
        setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...workout } : w));
    };

    return (
        <WorkoutContext.Provider value={{ workouts, addWorkout, deleteWorkout, updateWorkout }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within WorkoutProvider');
    }
    return context;
};