import { useState } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { fallback as fallbackImage } from '../images';

export default function Image({
  src,
  resizeMode = FastImage.resizeMode.cover,
  width,
  height,
  style,
  activityIndicatorSize = null,
}: {
  src: string;
  alt?: string;
  resizeMode?: FastImageProps['resizeMode'];
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  activityIndicatorSize?: 'small' | 'large' | null;
}) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.container, { width, height }, style]}>
      {src && loading && activityIndicatorSize ? (
        <ActivityIndicator animating={loading} size={activityIndicatorSize} />
      ) : null}
      {hasError && (
        <View style={styles.error}>
          <FastImage
            style={[styles.image, { width, height }]}
            source={fallbackImage}
            resizeMode={resizeMode}
            onLoadEnd={() => setLoading(false)}
            onError={() => setHasError(true)}
          />
        </View>
      )}
      <FastImage
        style={[styles.image, { width, height }]}
        source={{ uri: src }}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
        onError={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
