import { create } from 'zustand';
import { availabilityService } from '../service/availability.service';
import { AvailabilityState, CreateAvailabilityDto } from '../types/availability.types';

interface AvailabilityStore extends AvailabilityState {
    fetchAvailabilities: () => Promise<void>;
    fetchByDateRange: (startDate: string, endDate: string) => Promise<void>;
    createAvailability: (data: CreateAvailabilityDto) => Promise<void>;
    updateAvailability: (id: string, data: Partial<CreateAvailabilityDto>) => Promise<void>;
    deleteAvailability: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useAvailabilityStore = create<AvailabilityStore>((set, get) => ({
    availabilities: [],
    isLoading: false,
    error: null,

    fetchAvailabilities: async () => {
        set({ isLoading: true, error: null });
        try {
            const availabilities = await availabilityService.getAll();
            set({ availabilities, isLoading: false });
        } catch (error: any) {
            console.log("error in fecthing avail", error)
            set({ error: error.message || 'Failed to fetch availabilities', isLoading: false });
        }
    },

    fetchByDateRange: async (startDate: string, endDate: string) => {
        set({ isLoading: true, error: null });
        try {
            const availabilities = await availabilityService.getByDateRange(startDate, endDate);
            set({ availabilities, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch availabilities', isLoading: false });
        }
    },

    createAvailability: async (data: CreateAvailabilityDto) => {
        set({ isLoading: true, error: null });
        try {
            const newAvailability = await availabilityService.create(data);
            set((state) => ({
                availabilities: [...state.availabilities, newAvailability],
                isLoading: false,
            }));
        } catch (error: any) {
            console.log("Failed  to create", error.message)
            set({ error: error.message || 'Failed to create availability', isLoading: false });
            throw error;
        }
    },

    updateAvailability: async (id: string, data: Partial<CreateAvailabilityDto>) => {
        set({ isLoading: true, error: null });
        try {
            const updatedAvailability = await availabilityService.update(id, data);
            set((state) => ({
                availabilities: state.availabilities.map((a) =>
                    a.id === id ? updatedAvailability : a
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to update availability', isLoading: false });
            throw error;
        }
    },

    deleteAvailability: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await availabilityService.delete(id);
            set((state) => ({
                availabilities: state.availabilities.filter((a) => a.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete availability', isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));