import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  LogBox,
  I18nManager,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen'
// Context Providers
import { AuthProvider } from './src/contexts/AuthContext';
import { AppProvider } from './src/contexts/AppContext';

// Navigation
import AppNavigation from './src/navigation';

// Constants
import { COLORS } from '@/utils';

// Ignore specific warnings for demo purposes
LogBox.ignoreLogs([
  'Warning: Failed prop type',
  'Warning: Each child in a list should have a unique "key" prop',
  'VirtualizedLists should never be nested',
]);

const App: React.FC = () => {
  useEffect(() => {
    // Configure RTL support
    // Note: In a real app, you might want to set this based on user preference
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(false); // Set to true for RTL languages
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor={COLORS.primary}
          barStyle="light-content"
          translucent={false}
        />
        <AppProvider>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;