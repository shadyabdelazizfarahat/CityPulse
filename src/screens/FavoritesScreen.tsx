import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@/hooks';
import { useApp } from '@/contexts';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';
import { EventList } from '@/components';

export const FavoritesScreen = () => {
  const { t, isRTL } = useTranslation();
  const { favorites } = useApp();

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={[styles.emptyTitle, isRTL && styles.textRTL]}>
          {t('favorites.empty')}
        </Text>
        <Text style={[styles.emptySubtitle, isRTL && styles.textRTL]}>
          {t('favorites.emptySubtitle')}
        </Text>
      </View>
    ),
    [isRTL, t],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t('favorites.title')}
        </Text>
      </View>
      <EventList
        events={favorites}
        ListEmptyComponent={ListEmptyComponent}
        style={styles.list}
        eventCardVariant="featured"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.padding * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: DIMENSIONS.margin,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: DIMENSIONS.paddingSmall,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  list: {
    padding: DIMENSIONS.padding,
  },
  favoriteItem: {
    padding: DIMENSIONS.padding,
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.paddingSmall,
    borderRadius: DIMENSIONS.borderRadius,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default FavoritesScreen;
