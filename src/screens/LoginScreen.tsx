import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { validateEmail, validatePassword } from '../utils/helpers';
import { COLORS, DIMENSIONS, FONTS, SCREENS } from '@/utils';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { BiometricCapability } from '@/types';
import { RootStackNavigationProp } from '@/navigation';

export const LoginScreen = ({
  navigation,
}: {
  navigation: RootStackNavigationProp;
}) => {
  const {
    login,
    authenticateWithBiometrics,
    checkBiometricAvailability,
    isLoading,
  } = useAuth();
  const { t, isRTL } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [biometricCapability, setBiometricCapability] =
    useState<BiometricCapability>({
      available: false,
    });
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    checkBiometric();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkBiometric = async () => {
    try {
      const capability = await checkBiometricAvailability();
      setBiometricCapability(capability);
    } catch (error) {
      console.error('Failed to check biometric capability:', error);
      setBiometricCapability({ available: false });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (!validatePassword(formData.password)) {
      newErrors.password = t('errors.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    const onSuccess = () => {
      navigation.replace(SCREENS.MAIN);
    };
    const onError = (error?: string) => {
      Alert.alert('Authentication Failed', error, [
        { text: 'Cancel', style: 'cancel' },
      ]);
    };
    try {
      await login(
        { email: formData.email, password: formData.password },
        onSuccess,
        onError
      );
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('errors.invalidCredentials'),
      );
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        navigation.replace(SCREENS.MAIN);
      } else {
        Alert.alert('No User Found, please signup')
      }
    } catch (error: any) {
      // Don't show error for user cancellation
      if (
        !error.message?.includes('cancelled') &&
        !error.message?.includes('cancel')
      ) {
        Alert.alert(
          t('common.error'),
          error.message || t('errors.biometricNotAvailable'),
        );
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const navigateToRegister = () => {
    navigation.navigate(SCREENS.REGISTER as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <Text style={styles.welcomeTitle}>{t('auth.welcomeBack')}</Text>
          <Text style={styles.welcomeSubtitle}>
            {t('auth.signIn')} {t('navigation.home')}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.email')}
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            placeholder={t('auth.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.email}
            leftIcon={<Text style={styles.inputIcon}>📧</Text>}
            isRTL={isRTL}
            required
          />

          <Input
            ref={passwordRef}
            label={t('auth.password')}
            value={formData.password}
            onChangeText={value => handleInputChange('password', value)}
            placeholder={t('auth.password')}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            error={errors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>{showPassword ? '👁️' : '🙈'}</Text>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
            isRTL={isRTL}
            required
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, isRTL && styles.textRTL]}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <Button
            title={t('auth.signIn')}
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
            fullWidth
          />

          {biometricCapability.available && (
            <Button
              title={t('auth.useBiometric')}
              onPress={handleBiometricLogin}
              variant="outline"
              style={styles.biometricButton}
              icon={<Text style={styles.biometricIcon}>👆</Text>}
              fullWidth
            />
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerPrompt}
            onPress={navigateToRegister}
          >
            <Text style={[styles.registerText, isRTL && styles.textRTL]}>
              {t('auth.dontHaveAccount')}{' '}
              <Text style={styles.registerLink}>{t('auth.signUp')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Loading visible={isLoading} overlay />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: DIMENSIONS.padding,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.marginLarge * 2,
  },
  headerRTL: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FONTS.sizes.xxxlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: DIMENSIONS.paddingSmall,
  },
  welcomeSubtitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputIcon: {
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: DIMENSIONS.marginLarge,
  },
  forgotPasswordText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  loginButton: {
    marginBottom: DIMENSIONS.margin,
  },
  biometricButton: {
    marginBottom: DIMENSIONS.margin,
  },
  biometricIcon: {
    fontSize: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: DIMENSIONS.marginLarge,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: DIMENSIONS.margin,
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  registerPrompt: {
    alignItems: 'center',
    marginTop: DIMENSIONS.margin,
  },
  registerText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  registerLink: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default LoginScreen;
