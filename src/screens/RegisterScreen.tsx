import React, { useState, useRef } from 'react';
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
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/helpers';
import { COLORS, DIMENSIONS, FONTS, SCREENS } from '@/utils';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { RootStackNavigationProp } from '@/navigation';

export const RegisterScreen = ({
  navigation,
}: {
  navigation: RootStackNavigationProp;
}) => {
  const { register, isLoading } = useAuth();
  const { t, isRTL } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) {
      newErrors.firstName = t('errors.nameRequired');
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name must be 2-50 characters';
    }

    if (!formData.lastName) {
      newErrors.lastName = t('errors.nameRequired');
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name must be 2-50 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(formData);
      navigation.replace(SCREENS.MAIN);
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('errors.registrationFailed'),
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const navigateToLogin = () => {
    navigation.navigate(SCREENS.LOGIN);
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
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('auth.getStarted')}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.firstName')}
            value={formData.firstName}
            onChangeText={value => handleInputChange('firstName', value)}
            placeholder={t('auth.firstName')}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
            error={errors.firstName}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
            isRTL={isRTL}
            required
          />

          <Input
            ref={lastNameRef}
            label={t('auth.lastName')}
            value={formData.lastName}
            onChangeText={value => handleInputChange('lastName', value)}
            placeholder={t('auth.lastName')}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            error={errors.lastName}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
            isRTL={isRTL}
            required
          />

          <Input
            ref={emailRef}
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
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            error={errors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>{showPassword ? '👁️' : '🙈'}</Text>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
            isRTL={isRTL}
            required
          />

          <Input
            ref={confirmPasswordRef}
            label={t('auth.confirmPassword')}
            value={formData.confirmPassword}
            onChangeText={value => handleInputChange('confirmPassword', value)}
            placeholder={t('auth.confirmPassword')}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            error={errors.confirmPassword}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>
                {showConfirmPassword ? '👁️' : '🙈'}
              </Text>
            }
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            isRTL={isRTL}
            required
          />

          <Button
            title={t('auth.createAccount')}
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
            fullWidth
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.loginPrompt}
            onPress={navigateToLogin}
          >
            <Text style={[styles.loginText, isRTL && styles.textRTL]}>
              {t('auth.alreadyHaveAccount')}{' '}
              <Text style={styles.loginLink}>{t('auth.signIn')}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.terms}>
          <Text style={[styles.termsText, isRTL && styles.textRTL]}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
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
  title: {
    fontSize: FONTS.sizes.xxxlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: DIMENSIONS.paddingSmall,
  },
  subtitle: {
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
  registerButton: {
    marginTop: DIMENSIONS.margin,
    marginBottom: DIMENSIONS.margin,
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
  loginPrompt: {
    alignItems: 'center',
    marginTop: DIMENSIONS.margin,
  },
  loginText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loginLink: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  terms: {
    marginTop: DIMENSIONS.marginLarge,
    paddingHorizontal: DIMENSIONS.padding,
  },
  termsText: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default RegisterScreen;
