import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Event, Language } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { safeJsonParse } from '../utils/helpers';

class StorageService {
  // Generic storage methods
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const serializedValue = await AsyncStorage.getItem(key);
      return safeJsonParse(serializedValue, defaultValue);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // User-specific methods
  async saveUser(user: User): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, user);
  }

  async getUser(): Promise<User | null> {
    return await this.getItem<User | null>(STORAGE_KEYS.USER_DATA, null);
  }

  async removeUser(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Auth token methods
  async saveAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return await this.getItem<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  }

  async removeAuthToken(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Favorites methods
  async saveFavorites(favorites: Event[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.FAVORITES, favorites);
  }

  async getFavorites(): Promise<Event[]> {
    return await this.getItem<Event[]>(STORAGE_KEYS.FAVORITES, []);
  }

  async addToFavorites(event: Event): Promise<Event[]> {
    const favorites = await this.getFavorites();
    if (!favorites.some(e => e.id === event.id)) {
      favorites.push(event);
      await this.saveFavorites(favorites);
    }
    return favorites;
  }

  async removeFromFavorites(eventId: string): Promise<Event[]> {
    const favorites = await this.getFavorites();
    const updatedFavorites = favorites.filter(e => e.id !== eventId);
    await this.saveFavorites(updatedFavorites);
    return updatedFavorites;
  }

  // Language preference methods
  async saveLanguage(language: Language): Promise<void> {
    await this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  async getLanguage(): Promise<Language> {
    return await this.getItem<Language>(STORAGE_KEYS.LANGUAGE, 'en');
  }

  // Biometric settings methods
  async saveBiometricEnabled(enabled: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
  }

  async getBiometricEnabled(): Promise<boolean> {
    return await this.getItem<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED, false);
  }

  // Event cache methods
  async saveEventCache(cacheData: { [key: string]: Event }): Promise<void> {
    await this.setItem(STORAGE_KEYS.EVENT_CACHE, cacheData);
  }

  async getEventCache(): Promise<{ [key: string]: Event }> {
    return await this.getItem<{ [key: string]: Event }>(STORAGE_KEYS.EVENT_CACHE, {});
  }

  async saveEventToCache(event: Event): Promise<void> {
    const cache = await this.getEventCache();
    cache[event.id] = event;
    await this.saveEventCache(cache);
  }

  async getEventFromCache(eventId: string): Promise<Event | null> {
    const cache = await this.getEventCache();
    return cache[eventId] || null;
  }

  async clearEventCache(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.EVENT_CACHE);
  }

  // Search history methods
  async saveSearchHistory(searches: string[]): Promise<void> {
    await this.setItem('@city_pulse_search_history', searches);
  }

  async getSearchHistory(): Promise<string[]> {
    return await this.getItem<string[]>('@city_pulse_search_history', []);
  }

  async addToSearchHistory(searchTerm: string): Promise<void> {
    const history = await this.getSearchHistory();
    const filteredHistory = history.filter(term => term !== searchTerm);
    const updatedHistory = [searchTerm, ...filteredHistory].slice(0, 10); // Keep only last 10 searches
    await this.saveSearchHistory(updatedHistory);
  }

  async clearSearchHistory(): Promise<void> {
    await this.saveSearchHistory([]);
  }

  // App settings methods
  async saveAppSettings(settings: { [key: string]: any }): Promise<void> {
    await this.setItem('@city_pulse_app_settings', settings);
  }

  async getAppSettings(): Promise<{ [key: string]: any }> {
    return await this.getItem<{ [key: string]: any }>('@city_pulse_app_settings', {});
  }

  async updateAppSetting(key: string, value: any): Promise<void> {
    const settings = await this.getAppSettings();
    settings[key] = value;
    await this.saveAppSettings(settings);
  }

  // Bulk operations
  async saveBulkData(data: { [key: string]: any }): Promise<void> {
    try {
      const pairs = Object.entries(data).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('Error saving bulk data:', error);
      throw error;
    }
  }

  async getBulkData(keys: string[]): Promise<{ [key: string]: any }> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: { [key: string]: any } = {};
      
      values.forEach(([key, value]) => {
        result[key] = safeJsonParse(value, null);
      });
      
      return result;
    } catch (error) {
      console.error('Error getting bulk data:', error);
      return {};
    }
  }

  // Migration methods (useful for app updates)
  async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating data from ${fromVersion} to ${toVersion}`);
    
    try {
      // Add migration logic here based on version differences
      // For now, this is a placeholder
      
      // Example: Migrate old favorite format to new format
      if (fromVersion === '1.0.0' && toVersion === '1.1.0') {
        // Perform specific migration
      }
      
      // Update version in storage
      await this.updateAppSetting('version', toVersion);
    } catch (error) {
      console.error('Data migration failed:', error);
      throw error;
    }
  }

  // Utility methods
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      const cityPulseKeys = keys.filter(key => key.startsWith('@city_pulse'));
      const values = await AsyncStorage.multiGet(cityPulseKeys);
      
      let totalSize = 0;
      values.forEach(([, value]) => {
        if (value) {
          totalSize += value.length;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  async cleanupExpiredData(): Promise<void> {
    try {
      // Clean up expired cache data
      const cache = await this.getEventCache();
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      const cleanedCache: { [key: string]: Event } = {};
      Object.entries(cache).forEach(([key, event]) => {
        const eventDate = new Date(event.startDate).getTime();
        if (eventDate > oneWeekAgo) {
          cleanedCache[key] = event;
        }
      });
      
      await this.saveEventCache(cleanedCache);
      
      // Limit search history
      const searchHistory = await this.getSearchHistory();
      if (searchHistory.length > 10) {
        await this.saveSearchHistory(searchHistory.slice(0, 10));
      }
      
    } catch (error) {
      console.error('Error cleaning up expired data:', error);
    }
  }
}

// Create and export singleton instance
export const storageService = new StorageService();
export default storageService;