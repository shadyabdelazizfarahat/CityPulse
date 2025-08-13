import { useState, useCallback } from 'react';
import { Event, SearchParams, LoadingState } from '../types';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { debounce } from '../utils/helpers';

interface UseEventsReturn extends LoadingState {
  events: Event[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  searchEvents: (params: SearchParams) => void;
  getPopularEvents: (city?: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);

  const handleError = (err: any, defaultMessage: string) => {
    console.error(err);
    const errorMessage = err?.message || defaultMessage;
    setError(errorMessage);
  };

  const searchEvents = useCallback(async (params: SearchParams): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setLastSearchParams(params);
      const result = await apiService.searchEvents(params);
      
      if (params.page && params.page > 0) {
        // If this is a pagination request, append to existing events
        setEvents(prevEvents => [...prevEvents, ...result.events]);
      } else {
        // New search, replace events
        setEvents(result.events);
      }

      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setTotalElements(result.totalElements);

      // Cache events for offline access
      result.events.forEach(event => {
        storageService.saveEventToCache(event).catch(console.error);
      });

    } catch (err) {
      handleError(err, 'Failed to search events');
      
      // Try to load cached events as fallback
      if (!params.page || params.page === 0) {
        try {
          const cache = await storageService.getEventCache();
          const cachedEvents = Object.values(cache).slice(0, 20);
          if (cachedEvents.length > 0) {
            setEvents(cachedEvents);
            setError('Showing cached results. Please check your connection.');
          }
        } catch (cacheError) {
          console.error('Failed to load cached events:', cacheError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((params: SearchParams) => {
      searchEvents(params);
    }, 500),
    [searchEvents]
  );

  const getPopularEvents = useCallback(async (city?: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const popularEvents = await apiService.getPopularEvents(city);
      setEvents(popularEvents);
      setTotalPages(1);
      setCurrentPage(0);
      setTotalElements(popularEvents.length);

      // Cache events
      popularEvents.forEach(event => {
        storageService.saveEventToCache(event).catch(console.error);
      });

    } catch (err) {
      handleError(err, 'Failed to get popular events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(async (): Promise<void> => {
    if (lastSearchParams) {
      await searchEvents({ ...lastSearchParams, page: 0 });
    }
  }, [lastSearchParams, searchEvents]);

  return {
    events,
    totalPages,
    currentPage,
    totalElements,
    isLoading,
    error,
    searchEvents: debouncedSearch,
    getPopularEvents,
    refreshEvents,
  };
};

export default useEvents;