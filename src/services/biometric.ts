import ReactNativeBiometrics from 'react-native-biometrics';
import { BiometricResult, BiometricCapability } from '../types';

class BiometricService {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
  }

  async checkAvailability(): Promise<BiometricCapability> {
    try {
      const { available, biometryType, error } = await this.rnBiometrics.isSensorAvailable();
      
      return {
        available,
        biometryType,
        error,
      };
    } catch (error: any) {
      return {
        available: false,
        error: error.message || 'Failed to check biometric availability',
      };
    }
  }

  async authenticate(promptMessage: string = 'Authenticate with biometrics'): Promise<BiometricResult> {
    try {
      const result = await this.rnBiometrics.simplePrompt({
        promptMessage,
        fallbackPromptMessage: 'Use Password',
        cancelButtonText: 'Cancel',
      });

      return {
        success: result.success,
        error: result.success ? undefined : this.parseError(result.error),
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.parseError(error.message || error),
      };
    }
  }

  private parseError(errorMessage?: string): string {
    if (!errorMessage) return 'Authentication failed';
    
    const message = errorMessage.toLowerCase();
    
    // Handle specific error cases
    if (message.includes('usercancel') || message.includes('user cancel')) {
      return 'cancelled';
    } else if (message.includes('userfallback') || message.includes('user fallback')) {
      return 'fallback';
    } else if (message.includes('biometrynotavailable')) {
      return 'Biometric authentication is not available';
    } else if (message.includes('biometrynotenrolled')) {
      return 'Please set up biometric authentication in device settings';
    } else if (message.includes('biometrylockout')) {
      return 'Too many failed attempts. Please wait and try again';
    } else if (message.includes('systemcancel')) {
      return 'Authentication was cancelled by the system';
    } else {
      return 'Authentication failed';
    }
  }

  getBiometryTypeName(biometryType?: string): string {
    switch (biometryType) {
      case 'TouchID':
        return 'Touch ID';
      case 'FaceID':
        return 'Face ID';
      case 'Biometrics':
        return 'Fingerprint';
      default:
        return 'Biometric Authentication';
    }
  }
}

export const biometricService = new BiometricService();
export default biometricService;