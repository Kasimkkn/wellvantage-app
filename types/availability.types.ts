export interface Availability {
    id: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    sessionName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAvailabilityDto {
    date: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    sessionName: string;
}

export interface AvailabilityState {
    availabilities: Availability[];
    isLoading: boolean;
    error: string | null;
}