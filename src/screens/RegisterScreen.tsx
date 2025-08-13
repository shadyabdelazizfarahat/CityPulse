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
import { useAuth } from '@/contexts';
import { useTranslation, useFormValidation } from '@/hooks';
import {
  COLORS,
  DIMENSIONS,
  FONTS,
  SCREENS,
  createRegisterValidationSchema,
} from '@/utils';
import { RootStackNavigationProp } from '@/navigation';
import { Button, Input, Loading } from '@/components';

// Types for the registration form
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterScreen = ({
  navigation,
}: {
  navigation: RootStackNavigationProp;
}) => {
  const { register, isLoading } = useAuth();
  const { t, isRTL } = useTranslation();

  // Initialize form validation
  const validationSchema = createRegisterValidationSchema(t);
  const { formData, errors, updateField, validateField, validateForm } =
    useFormValidation<RegisterFormData>(validationSchema, {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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

  // Handle input changes with validation
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    updateField(field, value);
  };

  // Handle input blur for real-time validation
  const handleInputBlur = (field: keyof RegisterFormData) => {
    validateField(field);
  };

  const navigateToLogin = () => {
    navigation.navigate(SCREENS.LOGIN);
  };

  // Helper function to get field props
  const getFieldProps = (field: keyof RegisterFormData) => ({
    value: formData[field],
    onChangeText: (value: string) => handleInputChange(field, value),
    onBlur: () => handleInputBlur(field),
    error: errors[field],
    isRTL,
    required: true,
  });

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
            {...getFieldProps('firstName')}
            label={t('auth.firstName')}
            placeholder={t('auth.firstName')}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          <Input
            {...getFieldProps('lastName')}
            ref={lastNameRef}
            label={t('auth.lastName')}
            placeholder={t('auth.lastName')}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          <Input
            {...getFieldProps('email')}
            ref={emailRef}
            label={t('auth.email')}
            placeholder={t('auth.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            leftIcon={<Text style={styles.inputIcon}>📧</Text>}
          />

          <Input
            {...getFieldProps('password')}
            ref={passwordRef}
            label={t('auth.password')}
            placeholder={t('auth.password')}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>{showPassword ? '👁️' : '🙈'}</Text>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            {...getFieldProps('confirmPassword')}
            ref={confirmPasswordRef}
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPassword')}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>
                {showConfirmPassword ? '👁️' : '🙈'}
              </Text>
            }
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
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
