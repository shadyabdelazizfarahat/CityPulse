import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from '@/types';
import {
  storageService,
  biometricService,
  firebaseAuthService,
} from '@/services';
import * as Keychain from 'react-native-keychain';

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials,
    onSuccess?: () => void,
    onError?: (error?: string) => void,
  ) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
  checkBiometricAvailability: () => Promise<{
    available: boolean;
    biometryType?: string;
  }>;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'RESTORE_SESSION'; payload: { user: User } };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'RESTORE_SESSION':
      return {
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);

  // Restore session on app start
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const user = await storageService.getUser();
      if (user) {
        dispatch({
          type: 'RESTORE_SESSION',
          payload: { user },
        });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    credentials: LoginCredentials,
    onSucces?: () => void,
    onError?: (error?: string) => void,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await firebaseAuthService.signIn(
        credentials.email,
        credentials.password,
      );

      if (result.success && result.user) {
        // Save user data locally
        await storageService.saveUser(result.user);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user },
        });
        onSucces?.();
      } else {
        onError?.(result.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      onError?.(String(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    credentials: RegisterCredentials,
    onSuccess?: () => void,
    onError?: (error?: string) => void,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await firebaseAuthService.signUp(
        credentials.email,
        credentials.password,
        credentials.firstName,
        credentials.lastName,
      );
      if (result.success && result.user) {
        await Promise.all([
          storageService.saveUser(result.user),
          Keychain.setGenericPassword(credentials.email, credentials.password, {
            service: 'service_key',
          }),
        ]);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user },
        });
        onSuccess?.();
      } else {
        onError?.(result.error);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await Promise.all([storageService.removeUser()]);
      await firebaseAuthService.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await biometricService.authenticate(
        'Please verify your identity to login',
      );

      if (result.success) {
        // If biometric auth succeeded and user isn't logged in, restore session
        const credentials = await Keychain.getGenericPassword({
          service: 'service_key',
        });
        if (credentials) {
          await login({
            email: credentials.username,
            password: credentials.password,
          });
        } else {
          return false;
        }
        return true;
      } else {
        console.error('Biometric authentication failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  const checkBiometricAvailability = async () => {
    try {
      const capability = await biometricService.checkAvailability();
      return {
        available: capability.available,
        biometryType: capability.biometryType,
        error: capability.error,
      };
    } catch (error: any) {
      console.error('Check biometric availability failed:', error);
      return {
        available: false,
        error: error.message || 'Failed to check biometric availability',
        enrolled: false,
        hasHardware: false,
      };
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    authenticateWithBiometrics,
    checkBiometricAvailability,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
