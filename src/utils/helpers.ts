import { Event, TicketmasterEvent, Venue } from '../types';
import { VALIDATION, DEFAULT_EVENT_IMAGE } from './constants';

export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

export const validateName = (name: string): boolean => {
  return name.length >= VALIDATION.NAME_MIN_LENGTH && name.length <= VALIDATION.NAME_MAX_LENGTH;
};

export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (timeString: string, locale: string = 'en-US'): string => {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return timeString;
  }
};

export const formatDateTime = (dateString: string, timeString?: string, locale: string = 'en-US'): string => {
  const formattedDate = formatDate(dateString, locale);
  if (timeString) {
    const formattedTime = formatTime(timeString, locale);
    return `${formattedDate} at ${formattedTime}`;
  }
  return formattedDate;
};

export const transformTicketmasterEvent = (tmEvent: TicketmasterEvent): Event => {
  const venue = tmEvent._embedded?.venues?.[0];
  const transformedVenue: Venue = {
    id: venue?.id || '',
    name: venue?.name || 'TBA',
    address: {
      line1: venue?.address?.line1,
      line2: venue?.address?.line2,
      line3: venue?.address?.line3,
    },
    city: {
      name: venue?.city?.name || '',
    },
    location: venue?.location ? {
      latitude: venue.location.latitude,
      longitude: venue.location.longitude,
    } : undefined,
  };

  return {
    id: tmEvent.id,
    name: tmEvent.name,
    description: tmEvent.description || tmEvent.info,
    startDate: tmEvent.dates.start.localDate,
    startTime: tmEvent.dates.start.localTime,
    endDate: tmEvent.dates.end?.localDate,
    venue: transformedVenue,
    images: tmEvent.images.length > 0 ? tmEvent.images : [{
      url: DEFAULT_EVENT_IMAGE,
      width: 300,
      height: 200,
      fallback: true,
    }],
    priceRanges: tmEvent.priceRanges,
    categories: tmEvent.classifications?.map(c => ({
      id: c.genre.id,
      name: c.genre.name,
    })),
    url: tmEvent.url,
    info: tmEvent.info,
    pleaseNote: tmEvent.pleaseNote,
    accessibility: tmEvent.accessibility?.info,
  };
};

export const getBestEventImage = (images: any[], preferredWidth: number = 640): string => {
  if (!images || images.length === 0) {
    return DEFAULT_EVENT_IMAGE;
  }

  // Sort by width and find the closest to preferred width
  const sortedImages = images
    .filter(img => img.url && img.width && img.height)
    .sort((a, b) => Math.abs(a.width - preferredWidth) - Math.abs(b.width - preferredWidth));

  return sortedImages[0]?.url || DEFAULT_EVENT_IMAGE;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const formatPriceRange = (priceRanges: any[], currency: string = 'USD'): string => {
  if (!priceRanges || priceRanges.length === 0) {
    return 'Price TBA';
  }

  const priceRange = priceRanges[0];
  const currencySymbol = getCurrencySymbol(currency);
  
  if (priceRange.min === priceRange.max) {
    return `${currencySymbol}${priceRange.min}`;
  }
  
  return `${currencySymbol}${priceRange.min} - ${currencySymbol}${priceRange.max}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  };
  return symbols[currencyCode] || currencyCode;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const isRTL = (language: string): boolean => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(language);
};

export const formatVenueAddress = (venue: Venue): string => {
  const parts = [];
  
  if (venue.address.line1) parts.push(venue.address.line1);
  if (venue.address.line2) parts.push(venue.address.line2);
  if (venue.city.name) parts.push(venue.city.name);
  
  return parts.join(', ');
};

export const safeJsonParse = <T>(jsonString: string | null, fallback: T): T => {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};

/**
 * Creates a delay promise (useful for testing loading states)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};