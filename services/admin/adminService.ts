// src/services/adminService.ts
import api from '../api';
import { User, Property, Booking, DashboardStats, ApiError } from '@/types';

const adminService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/admin/users');
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get all properties
  getAllProperties: async (): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>('/admin/properties');
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Delete property
  deleteProperty: async (propertyId: string): Promise<void> => {
    try {
      await api.delete(`/admin/properties/${propertyId}`);
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const response = await api.get<Booking[]>('/admin/bookings');
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Delete booking
  deleteBooking: async (bookingId: string): Promise<void> => {
    try {
      await api.delete(`/admin/bookings/${bookingId}`);
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/admin/stats');
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },
};

export default adminService;