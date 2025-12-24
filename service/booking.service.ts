import { apiService } from '@/service/api';
import { Booking, BookingStatus, CreateBookingDto } from '@/types/booking.types';

class BookingService {
    async getAll(): Promise<Booking[]> {
        return await apiService.get<Booking[]>('/booking');
    }

    async getByAvailability(availabilityId: string): Promise<Booking[]> {
        return await apiService.get<Booking[]>(`/booking/availability/${availabilityId}`);
    }

    async create(data: CreateBookingDto): Promise<Booking> {
        return await apiService.post<Booking>('/booking', data);
    }

    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
        return await apiService.patch<Booking>(`/booking/${id}/status`, { status });
    }

    async delete(id: string): Promise<void> {
        return await apiService.delete(`/booking/${id}`);
    }
}

export const bookingService = new BookingService();