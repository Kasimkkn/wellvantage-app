import { apiService } from '@/service/api';
import { Availability, CreateAvailabilityDto } from '@/types/availability.types';

class AvailabilityService {
    async getAll(): Promise<Availability[]> {
        return await apiService.get<Availability[]>('/availability');
    }

    async getByDateRange(startDate: string, endDate: string): Promise<Availability[]> {
        return await apiService.get<Availability[]>(
            `/availability?startDate=${startDate}&endDate=${endDate}`
        );
    }

    async create(data: CreateAvailabilityDto): Promise<Availability> {
        return await apiService.post<Availability>('/availability', data);
    }

    async update(id: string, data: Partial<CreateAvailabilityDto>): Promise<Availability> {
        return await apiService.patch<Availability>(`/availability/${id}`, data);
    }

    async delete(id: string): Promise<void> {
        return await apiService.delete(`/availability/${id}`);
    }
}

export const availabilityService = new AvailabilityService();