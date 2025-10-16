// src/services/booking/bookingService.ts
import { Booking, BookingData, ApiError } from '@/types';
import api from '../api';

const bookingService = {
  // Create booking
  createBooking: async (bookingData: BookingData, renterId: string, propertyId: string): Promise<Booking> => {
    try {
      // Validate IDs
      if (!renterId || renterId === 'undefined') {
        throw new Error('Invalid renter ID');
      }
      if (!propertyId || propertyId === 'undefined') {
        throw new Error('Invalid property ID');
      }

      const response = await api.post<{ booking: Booking; message: string }>(
        `/bookings/renter/${renterId}/property/${propertyId}`, 
        bookingData
      );
      return response.data.booking;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get bookings by renter
  getBookingsByRenter: async (renterId: string): Promise<Booking[]> => {
    try {
      // Validate ID
      if (!renterId || renterId === 'undefined') {
        throw new Error('Invalid renter ID');
      }

      const response = await api.get<Booking[]>(`/bookings/renter/${renterId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get bookings for owner
  getBookingsForOwner: async (ownerId: string): Promise<Booking[]> => {
    try {
      // Validate ID
      if (!ownerId || ownerId === 'undefined') {
        throw new Error('Invalid owner ID');
      }

      const response = await api.get<Booking[]>(`/bookings/owner/${ownerId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<Booking> => {
    try {
      // Validate ID
      if (!bookingId || bookingId === 'undefined') {
        throw new Error('Invalid booking ID');
      }

      const response = await api.get<Booking>(`/bookings/${bookingId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string, ownerId: string): Promise<Booking> => {
    try {
      // Validate IDs
      if (!bookingId || bookingId === 'undefined') {
        throw new Error('Invalid booking ID');
      }
      if (!ownerId || ownerId === 'undefined') {
        throw new Error('Invalid owner ID');
      }

      const response = await api.put<{ booking: Booking; message: string }>(
        `/bookings/${bookingId}/status/owner/${ownerId}`,
        { status }
      );
      return response.data.booking;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, renterId: string): Promise<Booking> => {
    try {
      // Validate IDs
      if (!bookingId || bookingId === 'undefined') {
        throw new Error('Invalid booking ID');
      }
      if (!renterId || renterId === 'undefined') {
        throw new Error('Invalid renter ID');
      }

      const response = await api.put<{ booking: Booking; message: string }>(
        `/bookings/${bookingId}/cancel/renter/${renterId}`
      );
      return response.data.booking;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },
};

export default bookingService;