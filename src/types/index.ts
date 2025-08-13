// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  EventDetails: { event: Event };
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Event Types
export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  venue: Venue;
  images: EventImage[];
  priceRanges?: PriceRange[];
  categories?: Category[];
  url?: string;
  info?: string;
  pleaseNote?: string;
  accessibility?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: Address;
  city: City;
  location?: Location;
}

export interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
}

export interface City {
  name: string;
}

export interface Location {
  latitude: string;
  longitude: string;
}

export interface EventImage {
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

export interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface Category {
  id: string;
  name: string;
}

// API Response Types
export interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  description?: string;
  info?: string;
  pleaseNote?: string;
  accessibility?: {
    info?: string;
  };
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
    end?: {
      localDate: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues: TicketmasterVenue[];
  };
  images: TicketmasterImage[];
  priceRanges?: TicketmasterPriceRange[];
  classifications?: TicketmasterClassification[];
  url?: string;
}

export interface TicketmasterVenue {
  id: string;
  name: string;
  address?: {
    line1?: string;
    line2?: string;
    line3?: string;
  };
  city: {
    name: string;
  };
  location?: {
    latitude: string;
    longitude: string;
  };
}

export interface TicketmasterImage {
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

export interface TicketmasterPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface TicketmasterClassification {
  primary: boolean;
  segment: {
    id: string;
    name: string;
  };
  genre: {
    id: string;
    name: string;
  };
  subGenre: {
    id: string;
    name: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  notifications: boolean;
  biometricEnabled: boolean;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

// Search Types
export interface SearchParams {
  keyword: string;
  city: string;
  page?: number;
  size?: number;
}

// App State Types
export interface AppState {
  language: 'en' | 'ar';
  favorites: string[];
  user: User | null;
  isAuthenticated: boolean;
}

// Common Types
export type Language = 'en' | 'ar';

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: string;
}

export interface BiometricCapability {
  available: boolean;
  biometryType?: string;
  error?: string;
}