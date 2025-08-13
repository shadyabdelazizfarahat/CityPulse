import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  required?: boolean;
  isRTL?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      required = false,
      isRTL = false,
      ...textInputProps
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, isRTL && styles.labelRTL, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        
        <View style={[
          styles.inputContainer,
          hasError && styles.inputContainerError,
          isRTL && styles.inputContainerRTL,
        ]}>
          {leftIcon && !isRTL && (
            <View style={styles.leftIcon}>{leftIcon}</View>
          )}
          
          {rightIcon && isRTL && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon && !isRTL ? styles.inputWithLeftIcon : null,
              rightIcon && !isRTL ? styles.inputWithRightIcon : null,
              leftIcon && isRTL ? styles.inputWithRightIcon : null,
              rightIcon && isRTL ? styles.inputWithLeftIcon : null,
              hasError && styles.inputError,
              isRTL && styles.inputRTL,
              inputStyle,
            ]}
            placeholderTextColor={COLORS.textSecondary}
            textAlign={isRTL ? 'right' : 'left'}
            {...textInputProps}
          />

          {rightIcon && !isRTL && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
          
          {leftIcon && isRTL && (
            <View style={styles.leftIcon}>{leftIcon}</View>
          )}
        </View>

        {hasError && (
          <Text style={[styles.error, isRTL && styles.errorRTL, errorStyle]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: DIMENSIONS.margin,
  },
  label: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: DIMENSIONS.paddingSmall,
  },
  labelRTL: {
    textAlign: 'right',
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius,
    backgroundColor: COLORS.background,
    height: DIMENSIONS.inputHeight,
    paddingHorizontal: DIMENSIONS.padding,
  },
  inputContainerRTL: {
    flexDirection: 'row-reverse',
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    padding: 0, // Remove default padding
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputWithLeftIcon: {
    marginLeft: DIMENSIONS.paddingSmall,
  },
  inputWithRightIcon: {
    marginRight: DIMENSIONS.paddingSmall,
  },
  inputError: {
    color: COLORS.error,
  },
  leftIcon: {
    marginRight: DIMENSIONS.paddingSmall,
  },
  rightIcon: {
    marginLeft: DIMENSIONS.paddingSmall,
    padding: 4,
  },
  error: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: 4,
  },
  errorRTL: {
    textAlign: 'right',
  },
});

Input.displayName = 'Input';

export default Input;