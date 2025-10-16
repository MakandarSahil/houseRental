export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'RENTER' | 'ADMIN';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// export interface Property {
//   id: string;
//   title: string;
//   description: string;
//   city: string;
//   state: string;
//   address: string;
//   rent: number;
//   bedrooms: number;
//   bathrooms: number;
//   squareFeet: number;
//   available: boolean;
//   imageUrl?: string;
//   ownerId: string;
//   owner?: User;
//   createdAt?: string;
//   updatedAt?: string;
// }
export interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  message?: string;
  renterId: string;
  propertyId: string;
  renter?: User;
  property?: Property;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
}
export interface DashboardStat {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: string;
}
export interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  totalGuests: number;
}
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'OWNER' | 'RENTER';
  phone?: string;
}

export interface BookingData {
  startDate: string;
  endDate: string;
  message?: string;
}

export interface PropertyData {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  imageUrl: string;
  available?: boolean;
}
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  isAvailable: boolean; // Change from 'available' to 'isAvailable'
  imageUrl: string;
  ownerId: string;
  owner?: User; // Add owner field
  createdAt?: string;
  updatedAt?: string;
}
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  activeBookings: number;
  revenue?: number;
}