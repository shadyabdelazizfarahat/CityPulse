import useTranslation from '@/hooks/useTranslation';
import { FavoritesScreen, HomeScreen, ProfileScreen } from '@/screens';
import { MainTabParamList } from '@/types';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';

const MainTab = createBottomTabNavigator<MainTabParamList>();

const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({
  emoji,
  focused,
}) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
    {emoji}
  </Text>
);

interface TabScreen {
  name: keyof MainTabParamList;
  component: React.FC<any>;
  options: BottomTabNavigationOptions;
}

const MainTabNavigator: React.FC = () => {
  const { t, isRTL } = useTranslation();

  const HomeIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <TabIcon emoji="🏠" focused={focused} />
    ),
    [],
  );

  const FavoriteIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <TabIcon emoji="❤️" focused={focused} />
    ),
    [],
  );

  const ProfileIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <TabIcon emoji="👤" focused={focused} />
    ),
    [],
  );

  const screens: TabScreen[] = [
    {
      name: 'Home',
      component: HomeScreen,
      options: {
        title: t('navigation.home'),
        tabBarIcon: HomeIcon,
      },
    },
    {
      name: 'Favorites',
      component: FavoritesScreen,
      options: {
        title: t('navigation.favorites'),
        tabBarIcon: FavoriteIcon,
      },
    },
    {
      name: 'Profile',
      component: ProfileScreen,
      options: {
        title: t('navigation.profile'),
        tabBarIcon: ProfileIcon,
      },
    },
  ];
  const screensToRender = isRTL ? screens.reverse() : screens;

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar],
        tabBarLabelStyle: [styles.tabBarLabel, isRTL && styles.tabBarLabelRTL],
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
      initialRouteName="Home"
    >
      {screensToRender.map(screen => (
        <MainTab.Screen
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </MainTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: DIMENSIONS.tabBarHeight,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  tabBarLabelRTL: {
    textAlign: 'center',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
});

export default MainTabNavigator;
