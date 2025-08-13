import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Event, Language } from '../types';
import { storageService } from '../services/storage';
import { isRTL } from '../utils/helpers';

interface AppState {
  language: Language;
  isRTL: boolean;
  favorites: Event[];
  searchHistory: string[];
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  setLanguage: (language: Language) => Promise<void>;
  addToFavorites: (event: Event) => Promise<void>;
  removeFromFavorites: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
  clearFavorites: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_FAVORITES'; payload: Event[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INITIALIZE_APP'; payload: Partial<AppState> };

const initialState: AppState = {
  language: 'en',
  isRTL: false,
  favorites: [],
  searchHistory: [],
  isLoading: true,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
        isRTL: isRTL(action.payload),
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'INITIALIZE_APP':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app data on startup
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [language, favorites] = await Promise.all([
        storageService.getLanguage(),
        storageService.getFavorites(),
      ]);

      dispatch({
        type: 'INITIALIZE_APP',
        payload: {
          language,
          isRTL: isRTL(language),
          favorites,
        },
      });

      storageService.cleanupExpiredData().catch(console.error);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to initialize app',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setLanguage = async (language: Language): Promise<void> => {
    try {
      await storageService.saveLanguage(language);
      dispatch({ type: 'SET_LANGUAGE', payload: language });
    } catch (error) {
      console.error('Failed to set language:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to change language',
      });
    }
  };

  const addToFavorites = async (event: Event): Promise<void> => {
    try {
      const updatedFavorites = await storageService.addToFavorites(event);
      dispatch({ type: 'SET_FAVORITES', payload: updatedFavorites });
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to add to favorites',
      });
    }
  };

  const removeFromFavorites = async (eventId: string): Promise<void> => {
    try {
      const updatedFavorites = await storageService.removeFromFavorites(
        eventId,
      );
      dispatch({ type: 'SET_FAVORITES', payload: updatedFavorites });
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to remove from favorites',
      });
    }
  };

  const isFavorite = (eventId: string): boolean => {
    return state.favorites.some(e => e.id === eventId);
  };

  const clearFavorites = async (): Promise<void> => {
    try {
      await storageService.saveFavorites([]);
      dispatch({ type: 'SET_FAVORITES', payload: [] });
    } catch (error) {
      console.error('Failed to clear favorites:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to clear favorites',
      });
    }
  };

  const setError = (error: string | null): void => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AppContextType = {
    ...state,
    setLanguage,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
