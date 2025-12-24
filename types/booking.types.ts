import { User } from "./auth.types";
import { Availability } from "./availability.types";

export enum BookingStatus {
    OPEN = 'open',
    BOOKED = 'booked',
}

export interface Booking {
    id: string;
    availabilityId: string;
    userId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    availability?: Availability;
    user?: User;
}

export interface CreateBookingDto {
    availabilityId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    status?: BookingStatus;
}

export interface BookingState {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
}