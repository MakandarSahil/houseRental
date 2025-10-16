// src/hooks/useBooking.ts
'use client';
import { useState } from 'react';
import bookingService from './bookingService';
import { Booking, BookingData, ApiError } from '@/types';

interface UseBookingReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  createBooking: (bookingData: BookingData, renterId: string, propertyId: string) => Promise<Booking>;
  getBookingsByRenter: (renterId: string) => Promise<Booking[]>;
  getBookingsForOwner: (ownerId: string) => Promise<Booking[]>;
  getBookingById: (bookingId: string) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: string, ownerId: string) => Promise<Booking>;
  cancelBooking: (bookingId: string, renterId: string) => Promise<Booking>;
}

export const useBooking = (): UseBookingReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingData, renterId: string, propertyId: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.createBooking(bookingData, renterId, propertyId);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to create booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByRenter = async (renterId: string): Promise<Booking[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingsByRenter(renterId);
      setBookings(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch bookings';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookingsForOwner = async (ownerId: string): Promise<Booking[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingsForOwner(ownerId);
      setBookings(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch bookings';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (bookingId: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingById(bookingId);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, ownerId: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.updateBookingStatus(bookingId, status, ownerId);
      // Update local state
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? data : b)
      );
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to update booking status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string, renterId: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.cancelBooking(bookingId, renterId);
      // Update local state
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? data : b)
      );
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to cancel booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    getBookingsByRenter,
    getBookingsForOwner,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
  };
};