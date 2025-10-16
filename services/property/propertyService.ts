
import { Property, PropertyData, ApiError } from '@/types';
import api from '../api';

const propertyService = {
  // Get all properties
  getAllProperties: async (): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>('/properties');
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get available properties
  getAvailableProperties: async (): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>('/properties/available');
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get property by ID
  getPropertyById: async (id: string): Promise<Property> => {
    try {
      const response = await api.get<Property>(`/properties/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Get properties by owner
  getPropertiesByOwner: async (ownerId: string): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>(`/properties/owner/${ownerId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Search properties by city
  searchByCity: async (city: string): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>(`/properties/search/city/${city}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Search properties by rent range
  searchByRentRange: async (minRent: number, maxRent: number): Promise<Property[]> => {
    try {
      const response = await api.get<Property[]>('/properties/search/rent', {
        params: { minRent, maxRent }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Create property
  createProperty: async (propertyData: PropertyData, ownerId: string): Promise<Property> => {
    try {
      const response = await api.post<Property>(`/properties/owner/${ownerId}`, propertyData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Update property
  updateProperty: async (propertyId: string, propertyData: Partial<PropertyData>, ownerId: string): Promise<Property> => {
    try {
      const response = await api.put<Property>(`/properties/${propertyId}/owner/${ownerId}`, propertyData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },

  // Delete property
  deleteProperty: async (propertyId: string, ownerId: string): Promise<void> => {
    try {
      await api.delete(`/properties/${propertyId}/owner/${ownerId}`);
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  },
};

export default propertyService;