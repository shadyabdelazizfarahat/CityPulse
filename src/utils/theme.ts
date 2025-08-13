export const COLORS = {
  primary: '#FF6B35',
  secondary: '#2E86AB',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
  info: '#17A2B8',
  dark: '#343A40',
  light: '#F8F9FA',

  // Gradient colors
  gradientStart: '#FF6B35',
  gradientEnd: '#FF8E53',

  // Dark theme colors
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkText: '#FFFFFF',
  darkTextSecondary: '#B3B3B3',
} as const;

// Dimensions
export const DIMENSIONS = {
  borderRadius: 8,
  borderRadiusLarge: 16,
  padding: 16,
  paddingSmall: 8,
  paddingLarge: 24,
  margin: 16,
  marginSmall: 8,
  marginLarge: 24,
  iconSize: 24,
  iconSizeLarge: 32,
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: 56,
  tabBarHeight: 60,
} as const;

// Fonts
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  sizes: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 24,
    xxxlarge: 32,
  },
} as const;

// Animation
export const ANIMATION = {
  duration: {
    short: 200,
    medium: 300,
    long: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

