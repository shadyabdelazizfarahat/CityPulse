import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  Modal,
} from 'react-native';
import { COLORS, FONTS, DIMENSIONS } from '@/utils';

interface LoadingProps {
  visible?: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  visible = true,
  text,
  overlay = false,
  size = 'large',
  color = COLORS.primary,
  style,
}) => {
  const content = (
    <View style={[styles.container, overlay && styles.overlayContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent
      >
        {content}
      </Modal>
    );
  }

  return visible ? content : null;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.padding,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: DIMENSIONS.margin,
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default Loading;