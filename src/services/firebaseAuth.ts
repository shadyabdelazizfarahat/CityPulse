import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User } from '../types';

export interface FirebaseAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

class FirebaseAuthService {
  
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<FirebaseAuthResult> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update the user's display name
      await userCredential.user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
      
      // Create user object
      const user: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || email,
        firstName,
        lastName,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.parseAuthError(error),
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<FirebaseAuthResult> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Extract names from display name or use defaults
      const displayName = userCredential.user.displayName || '';
      const [firstName = 'User', lastName = ''] = displayName.split(' ');

      const user: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || email,
        firstName,
        lastName,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.parseAuthError(error),
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<FirebaseAuthResult> {
    try {
      await auth().signOut();
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.parseAuthError(error),
      };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return auth().currentUser !== null;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void): () => void {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<FirebaseAuthResult> {
    try {
      await auth().sendPasswordResetEmail(email);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.parseAuthError(error),
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(firstName: string, lastName: string): Promise<FirebaseAuthResult> {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return {
          success: false,
          error: 'No user is currently signed in',
        };
      }

      await currentUser.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });

      const user: User = {
        id: currentUser.uid,
        email: currentUser.email || '',
        firstName,
        lastName,
      };

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.parseAuthError(error),
      };
    }
  }

  /**
   * Parse Firebase Auth errors into user-friendly messages
   */
  private parseAuthError(error: any): string {
    const errorCode = error.code;
    const errorMessage = error.message;

    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      default:
        console.error('Firebase Auth Error:', errorCode, errorMessage);
        return errorMessage || 'An error occurred during authentication.';
    }
  }

  /**
   * Convert Firebase user to app User type
   */
  private firebaseUserToAppUser(firebaseUser: FirebaseAuthTypes.User): User {
    const displayName = firebaseUser.displayName || '';
    const [firstName = 'User', lastName = ''] = displayName.split(' ');

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      firstName,
      lastName,
    };
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;