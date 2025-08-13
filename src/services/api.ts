import { Event, TicketmasterResponse, SearchParams, ApiError } from '../types';
import { transformTicketmasterEvent, delay } from '../utils/helpers';
import { API_CONFIG } from '../utils/constants';

class ApiService {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheExpiry = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.baseUrl = API_CONFIG.TICKETMASTER_BASE_URL ?? '';
    this.apiKey = API_CONFIG.TICKETMASTER_API_KEY ?? '';
  }

  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheExpiry;
  }

  private async fetchWithCache<T>(
    endpoint: string,
    params: any = {},
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const url = new URL(endpoint, this.baseUrl);
      const searchParams = new URLSearchParams({
        apikey: this.apiKey,
        locale: API_CONFIG.DEFAULT_LOCALE,
        ...params,
      });
      for (const [key, value] of searchParams) {
        url.searchParams.set(key, value);
      }
      console.log('url', url.href)
      const response = await fetch(url.href);

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        'Network error occurred. Please check your connection.',
        0,
      );
    }
  }

  async searchEvents(searchParams: SearchParams): Promise<{
    events: Event[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
  }> {
    try {
      const params = {
        keyword: searchParams.keyword,
        city: searchParams.city,
        page: searchParams.page?.toString() || '0',
        size: searchParams.size?.toString() || API_CONFIG.PAGE_SIZE.toString(),
        countryCode: API_CONFIG.DEFAULT_COUNTRY,
      };

      const response = await this.fetchWithCache<TicketmasterResponse>(
        '/events.json',
        params,
      );

      const events =
        response._embedded?.events?.map(transformTicketmasterEvent) || [];

      return {
        events,
        totalPages: response.page.totalPages,
        currentPage: response.page.number,
        totalElements: response.page.totalElements,
      };
    } catch (error) {
      console.error('Search events error:', error);
      throw error;
    }
  }

  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await this.fetchWithCache<any>(
        `/events/${eventId}.json`,
      );

      return transformTicketmasterEvent(response);
    } catch (error) {
      console.error('Get event by ID error:', error);
      throw new ApiError('Event not found', 404);
    }
  }

  async getPopularEvents(city?: string): Promise<Event[]> {
    try {
      const params: any = {
        size: '10',
        countryCode: API_CONFIG.DEFAULT_COUNTRY,
      };

      if (city) {
        params.city = city;
      }
      const response = await this.fetchWithCache<TicketmasterResponse>(
        '/events.json',
        params,
      );
      return response._embedded?.events?.map(transformTicketmasterEvent) || [];
    } catch (error) {
      console.error('Get popular events error:', error);
      return [];
    }
  }

  async searchEventsByCategory(
    category: string,
    city?: string,
  ): Promise<Event[]> {
    try {
      const params: any = {
        classificationName: category,
        size: '20',
        countryCode: API_CONFIG.DEFAULT_COUNTRY,
      };

      if (city) {
        params.city = city;
      }

      const response = await this.fetchWithCache<TicketmasterResponse>(
        '/events.json',
        params,
      );

      return response._embedded?.events?.map(transformTicketmasterEvent) || [];
    } catch (error) {
      console.error('Search events by category error:', error);
      return [];
    }
  }

  async getEventsByLocation(
    latitude: number,
    longitude: number,
    radius: number = 50,
  ): Promise<Event[]> {
    try {
      const params = {
        latlong: `${latitude},${longitude}`,
        radius: radius.toString(),
        unit: 'miles',
        size: '20',
      };

      const response = await this.fetchWithCache<TicketmasterResponse>(
        '/events.json',
        params,
      );

      return response._embedded?.events?.map(transformTicketmasterEvent) || [];
    } catch (error) {
      console.error('Get events by location error:', error);
      return [];
    }
  }

  // Mock authentication methods
  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: any;
  }> {
    await delay(1000);

    if (email === 'demo@citypulse.com' && password === 'password123') {
      return {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          avatar: null,
          bio: 'Event enthusiast and city explorer',
          preferences: {
            language: 'en',
            notifications: true,
            biometricEnabled: false,
          },
        },
      };
    }

    throw new ApiError('Invalid credentials', 401);
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{
    token: string;
    user: any;
  }> {
    await delay(1500);

    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
        bio: null,
        preferences: {
          language: 'en',
          notifications: true,
          biometricEnabled: false,
        },
      },
    };
  }

  async updateProfile(userId: string, userData: Partial<any>): Promise<any> {
    await delay(800);

    return {
      ...userData,
      id: userId,
    };
  }

  // Clear cache method
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size for debugging
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
