import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

import { RootStackParamList } from '../types';

import { COLORS } from '@/utils';

import { SafeAreaView } from 'react-native-safe-area-context';
import { EventDetailsScreen, SplashScreen } from '@/screens';
import MainTabNavigator from './MainNavigation';
import AuthStackNavigator from './AuthNavigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const AppNavigator: React.FC = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      <RootStack.Screen name="Main" component={MainTabNavigator} />
      <RootStack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.primary,
        }}
      />
    </RootStack.Navigator>
  );
};

export const AppNavigation: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigation;
