import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, DIMENSIONS } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  margin?: number;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = DIMENSIONS.padding,
  margin = DIMENSIONS.margin,
  disabled = false,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      padding,
      margin,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...styles.elevated,
        };
      case 'outlined':
        return {
          ...baseStyle,
          ...styles.outlined,
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          ...styles.default,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: DIMENSIONS.borderRadius,
    backgroundColor: COLORS.background,
  },
  default: {
    elevation: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  elevated: {
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default Card;