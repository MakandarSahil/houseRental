// src/hooks/useProperty.ts
'use client';
import { useState, useEffect } from 'react';
import propertyService from './propertyService';
import { Property, PropertyData, ApiError } from '@/types';

interface UsePropertyReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  getAllProperties: () => Promise<Property[]>;
  getAvailableProperties: () => Promise<Property[]>;
  getPropertyById: (id: string) => Promise<Property>;
  getPropertiesByOwner: (ownerId: string) => Promise<Property[]>;
  searchByCity: (city: string) => Promise<Property[]>;
  searchByRentRange: (minRent: number, maxRent: number) => Promise<Property[]>;
  createProperty: (propertyData: PropertyData, ownerId: string) => Promise<Property>;
  updateProperty: (propertyId: string, propertyData: Partial<PropertyData>, ownerId: string) => Promise<Property>;
  deleteProperty: (propertyId: string, ownerId: string) => Promise<void>;
}

export const useProperty = (): UsePropertyReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAllProperties = async (): Promise<Property[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAllProperties();
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

  const getAvailableProperties = async (): Promise<Property[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAvailableProperties();
      setProperties(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch available properties';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = async (id: string): Promise<Property> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getPropertyById(id);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch property';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPropertiesByOwner = async (ownerId: string): Promise<Property[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getPropertiesByOwner(ownerId);
      setProperties(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to fetch owner properties';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchByCity = async (city: string): Promise<Property[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.searchByCity(city);
      setProperties(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to search properties';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchByRentRange = async (minRent: number, maxRent: number): Promise<Property[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.searchByRentRange(minRent, maxRent);
      setProperties(data);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to search properties';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: PropertyData, ownerId: string): Promise<Property> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.createProperty(propertyData, ownerId);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to create property';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (propertyId: string, propertyData: Partial<PropertyData>, ownerId: string): Promise<Property> => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.updateProperty(propertyId, propertyData, ownerId);
      return data;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to update property';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId: string, ownerId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await propertyService.deleteProperty(propertyId, ownerId);
      // Remove from local state
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Failed to delete property';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    getAllProperties,
    getAvailableProperties,
    getPropertyById,
    getPropertiesByOwner,
    searchByCity,
    searchByRentRange,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};