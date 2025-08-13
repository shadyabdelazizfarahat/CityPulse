import Config from 'react-native-config';
// API Configuration
export const API_CONFIG = {
  TICKETMASTER_BASE_URL: Config.TICKETMASTER_BASE_URL,
  TICKETMASTER_API_KEY: Config.TICKETMASTER_API_KEY,
  DEFAULT_COUNTRY: 'US',
  DEFAULT_LOCALE: 'en-us',
  PAGE_SIZE: 20,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: '@city_pulse_user',
  FAVORITES: '@city_pulse_favorites',
  LANGUAGE: '@city_pulse_language',
  AUTH_TOKEN: '@city_pulse_auth_token',
  BIOMETRIC_ENABLED: '@city_pulse_biometric',
  EVENT_CACHE: '@city_pulse_event_cache',
} as const;

// Screen Names
export const SCREENS = {
  SPLASH: 'Splash',
  AUTH: 'Auth',
  LOGIN: 'Login',
  REGISTER: 'Register',
  MAIN: 'Main',
  HOME: 'Home',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
  EVENT_DETAILS: 'EventDetails',
} as const;

// Localization
export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  EVENT_NOT_FOUND: 'Event not found.',
  LOCATION_PERMISSION: 'Location permission required.',
  BIOMETRIC_NOT_AVAILABLE: 'Biometric authentication not available.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  EVENT_FAVORITED: 'Event added to favorites!',
  EVENT_UNFAVORITED: 'Event removed from favorites!',
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Biometric Types
export const BIOMETRIC_TYPES = {
  TOUCH_ID: 'TouchID',
  FACE_ID: 'FaceID',
  FINGERPRINT: 'Biometrics',
} as const;

// Event Categories
export const EVENT_CATEGORIES = [
  { id: 'music', name: 'Music' },
  { id: 'sports', name: 'Sports' },
  { id: 'arts', name: 'Arts & Theater' },
  { id: 'family', name: 'Family' },
  { id: 'misc', name: 'Miscellaneous' },
] as const;

// Default Event Image
export const DEFAULT_EVENT_IMAGE =
  'https://via.placeholder.com/300x200?text=Event+Image';

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 40.7128,
  DEFAULT_LONGITUDE: -74.006,
  DEFAULT_ZOOM: 15,
  MARKER_SIZE: 30,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  EXPIRY_TIME: 30 * 60 * 1000, // 30 minutes
  MAX_CACHE_SIZE: 100, // Maximum number of cached items
} as const;
