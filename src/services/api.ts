import { Event, TicketmasterResponse, SearchParams, ApiError } from '../types';
import { transformTicketmasterEvent } from '../utils/helpers';
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
        ...params,
      });
      for (const [key, value] of searchParams) {
        url.searchParams.set(key, value);
      }
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

  async getPopularEvents(city?: string): Promise<Event[]> {
    try {
      const params: any = {
        size: API_CONFIG.PAGE_SIZE,
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
