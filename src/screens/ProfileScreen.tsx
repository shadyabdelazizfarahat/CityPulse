import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/navigation';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage } = useApp();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Auth');
  }, [isAuthenticated, navigation]);

  const handleLanguageToggle = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    await setLanguage(newLanguage);
  };

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), 'Are you sure you want to logout?', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('auth.logout'), onPress: logout, style: 'destructive' },
    ]);
  };

  const renderProfileInfo = () => (
    <View style={styles.profileInfo}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </Text>
      </View>
      <Text style={[styles.name, isRTL && styles.textRTL]}>
        {user?.firstName} {user?.lastName}
      </Text>
      <Text style={[styles.email, isRTL && styles.textRTL]}>
        {user?.email}
      </Text>
    </View>
  );

  const renderSettingsItem = (
    title: string,
    onPress: () => void,
    icon?: string,
  ) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        {icon && <Text style={styles.settingsIcon}>{icon}</Text>}
        <Text style={[styles.settingsTitle, isRTL && styles.textRTL]}>
          {title}
        </Text>
      </View>
      <Text style={styles.settingsArrow}>{isRTL ? '‹' : '›'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t('profile.title')}
        </Text>
      </View>

      <View style={styles.content}>
        {renderProfileInfo()}

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('profile.preferences')}
            </Text>

            {renderSettingsItem(
              `${t('profile.language')} ${
                language === 'en' ? 'Arabic' : 'الإنجليزية'
              }`,
              handleLanguageToggle,
              '🌍',
            )}
          </View>
          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    padding: DIMENSIONS.padding,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxlarge,
    fontFamily: FONTS.bold,
    color: COLORS.background,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    padding: DIMENSIONS.padding * 2,
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.margin,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONS.margin,
  },
  avatarText: {
    fontSize: FONTS.sizes.xxlarge,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  name: {
    fontSize: FONTS.sizes.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: DIMENSIONS.margin,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: DIMENSIONS.paddingSmall,
    paddingHorizontal: DIMENSIONS.padding,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: DIMENSIONS.padding,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: DIMENSIONS.margin,
  },
  settingsTitle: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },
  settingsArrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    marginBottom: DIMENSIONS.margin * 2,
    width: '80%',
    alignSelf: 'center',
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default ProfileScreen;
