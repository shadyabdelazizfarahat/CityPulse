import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[size],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? COLORS.border : COLORS.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? COLORS.border : COLORS.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? COLORS.border : COLORS.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text` as keyof typeof styles],
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.textSecondary : COLORS.background,
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.textSecondary : COLORS.primary,
        };
      case 'text':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.textSecondary : COLORS.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === 'primary' || variant === 'secondary'
                ? COLORS.background
                : COLORS.primary
            }
          />
          <Text style={[getTextStyle(), styles.leftMargin]}>{title}</Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.contentContainer}>
          {iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), icon ? styles.textWithIcon : null]}>
            {title}
          </Text>
          {iconPosition === 'right' && icon}
        </View>
      );
    }

    return <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: DIMENSIONS.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    height: 32,
    paddingHorizontal: 12,
  },
  medium: {
    height: DIMENSIONS.buttonHeight,
    paddingHorizontal: DIMENSIONS.padding,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },
  text: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: FONTS.sizes.small,
  },
  mediumText: {
    fontSize: FONTS.sizes.medium,
  },
  largeText: {
    fontSize: FONTS.sizes.large,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWithIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  leftMargin: { 
    marginLeft: 8
  }
});

export default Button;
