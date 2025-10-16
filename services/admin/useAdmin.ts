// src/hooks/useAdmin.ts
'use client';
import { useState } from 'react';
import adminService from './adminService';
import { User, Property, Booking, DashboardStats, ApiError } from '@/types';

interface UseAdminReturn {
  users: User[];
  properties: Property[];
  bookings: Booking[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<void>;
  getAllProperties: () => Promise<Property[]>;
  deleteProperty: (propertyId: string) => Promise<void>;
  getAllBookings: () => Promise<Booking[]>;
  deleteBooking: (bookingId: string) => Promise<void>;
  getDashboardStats: () => Promise<DashboardStats>;
}

export const useAdmin = (): UseAdminReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = async (): Promise<User[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch users';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to delete user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllProperties = async (): Promise<Property[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllProperties();
      setProperties(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch properties';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to delete property';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllBookings = async (): Promise<Booking[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllBookings();
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

  const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to delete booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch stats';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    properties,
    bookings,
    stats,
    loading,
    error,
    getAllUsers,
    deleteUser,
    getAllProperties,
    deleteProperty,
    getAllBookings,
    deleteBooking,
    getDashboardStats,
  };
};