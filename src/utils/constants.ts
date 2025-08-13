import Config from 'react-native-config';
// API Configuration
export const API_CONFIG = {
  TICKETMASTER_BASE_URL: Config.TICKETMASTER_BASE_URL,
  TICKETMASTER_API_KEY: Config.TICKETMASTER_API_KEY,
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

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 40.7128,
  DEFAULT_LONGITUDE: -74.006,
  DEFAULT_ZOOM: 15,
  MARKER_SIZE: 30,
} as const;
