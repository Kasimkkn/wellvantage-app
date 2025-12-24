import { create } from 'zustand';
import { bookingService } from '../service/booking.service';
import { BookingState, BookingStatus, CreateBookingDto } from '../types/booking.types';

interface BookingStore extends BookingState {
    fetchBookings: () => Promise<void>;
    fetchByAvailability: (availabilityId: string) => Promise<void>;
    createBooking: (data: CreateBookingDto) => Promise<void>;
    updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    bookings: [],
    isLoading: false,
    error: null,

    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const bookings = await bookingService.getAll();
            set({ bookings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch bookings', isLoading: false });
        }
    },

    fetchByAvailability: async (availabilityId: string) => {
        set({ isLoading: true, error: null });
        try {
            const bookings = await bookingService.getByAvailability(availabilityId);
            set({ bookings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch bookings', isLoading: false });
        }
    },

    createBooking: async (data: CreateBookingDto) => {
        set({ isLoading: true, error: null });
        try {
            const newBooking = await bookingService.create(data);
            set((state) => ({
                bookings: [...state.bookings, newBooking],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to create booking', isLoading: false });
            throw error;
        }
    },

    updateBookingStatus: async (id: string, status: BookingStatus) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBooking = await bookingService.updateStatus(id, status);
            set((state) => ({
                bookings: state.bookings.map((b) => (b.id === id ? updatedBooking : b)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to update booking', isLoading: false });
            throw error;
        }
    },

    deleteBooking: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await bookingService.delete(id);
            set((state) => ({
                bookings: state.bookings.filter((b) => b.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete booking', isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));