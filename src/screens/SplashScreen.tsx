import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SCREENS } from '@/utils';
import { useAuth } from '../contexts/AuthContext';
import { RootStackNavigationProp } from '@/navigation';


export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Navigate after animations complete
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace(SCREENS.MAIN);
        } else {
          navigation.replace(SCREENS.AUTH);
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
    return
  }, [isLoading, isAuthenticated, navigation]);

  const startAnimations = () => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        {/* App Icon/Logo */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🎵</Text>
          <View style={styles.pulseRing} />
        </View>
        
        <Text style={styles.title}>City Pulse</Text>
        <Text style={styles.subtitle}>Discover Local Events</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, styles.dot1]} />
            <Animated.View style={[styles.dot, styles.dot2]} />
            <Animated.View style={[styles.dot, styles.dot3]} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 80,
    textAlign: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    marginHorizontal: 4,
  },
  dot1: {
    // Animation will be added via useEffect if needed
  },
  dot2: {
    // Animation will be added via useEffect if needed
  },
  dot3: {
    // Animation will be added via useEffect if needed
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

export default SplashScreen;