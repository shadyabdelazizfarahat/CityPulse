import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Input, Button, Loading, EventList } from '@/components';
import { useTranslation } from '@/hooks';
import { useEvents } from '@/hooks';

import { COLORS, DIMENSIONS, FONTS } from '@/utils';

export const HomeScreen = () => {
  const { t, isRTL } = useTranslation();
  const {
    events,
    isLoading,
    error,
    searchEvents,
    getPopularEvents,
    refreshEvents,
  } = useEvents();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPopularEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPopularEvents = async () => {
    try {
      await getPopularEvents();
      // eslint-disable-next-line no-catch-shadow
    } catch (error) {
      console.error('Failed to load popular events:', error);
    }
  };

  const ListemptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎭</Text>
        <Text style={[styles.emptyTitle, isRTL && styles.textRTL]}>
          {t('home.noResults')}
        </Text>
        <Text style={[styles.emptySubtitle, isRTL && styles.textRTL]}>
          {t('home.tryDifferentSearch')}
        </Text>
      </View>
    ),
    [isRTL, t],
  );

  const ListHeaderComponent = useMemo(() => {
    const handleSearch = async () => {
      if (!searchKeyword.trim() && !searchCity.trim()) {
        Alert.alert(t('common.error'), 'Please enter both keyword and city');
        return;
      }

      try {
        searchEvents({
          keyword: searchKeyword.trim(),
          city: searchCity.trim(),
          page: 0,
          size: 20,
        });
        // eslint-disable-next-line no-catch-shadow
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    return (
      <View style={styles.searchSection}>
        <Input
          placeholder={t('home.searchPlaceholder')}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          leftIcon={<Text style={styles.inputIcon}>🔍</Text>}
          isRTL={isRTL}
          containerStyle={styles.searchInput}
        />
        <Input
          placeholder={t('home.cityPlaceholder')}
          value={searchCity}
          onChangeText={setSearchCity}
          leftIcon={<Text style={styles.inputIcon}>📍</Text>}
          isRTL={isRTL}
          containerStyle={styles.searchInput}
        />
        <Button
          title={t('home.searchButton')}
          onPress={handleSearch}
          loading={isLoading}
          style={styles.searchButton}
          fullWidth
        />
      </View>
    );
  }, [isLoading, isRTL, searchCity, searchEvents, searchKeyword, t]);

  const RefreshControlComponent = useMemo(() => {
    const handleRefresh = async () => {
      setRefreshing(true);
      try {
        await refreshEvents();
      } finally {
        setRefreshing(false);
      }
    };
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={[COLORS.primary]}
        tintColor={COLORS.primary}
      />
    );
  }, [refreshEvents, refreshing]);

  const renderContent = () => {
    if (isLoading && events.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Loading text={t('common.loading')} />
        </View>
      );
    }

    if (error && events.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title={t('common.retry')}
            onPress={loadPopularEvents}
            variant="outline"
            style={styles.retryButton}
          />
        </View>
      );
    }

    return (
      <EventList
        style={styles.eventsList}
        events={events}
        steakyHeaderIndecies={[0]}
        RefreshControlConponent={RefreshControlComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListemptyComponent}
      />
    );
  };

  return <View style={styles.scrollView}>{renderContent()}</View>;
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
  },
  header: {
    padding: DIMENSIONS.padding,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxxlarge,
    fontFamily: FONTS.bold,
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchSection: {
    padding: DIMENSIONS.padding,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    marginBottom: DIMENSIONS.paddingSmall,
  },
  inputIcon: {
    fontSize: 16,
  },
  searchButton: {
    marginTop: DIMENSIONS.paddingSmall,
  },
  eventsList: {
    padding: DIMENSIONS.padding,
    paddingTop: DIMENSIONS.paddingSmall,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.padding * 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.padding * 2,
  },
  errorText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: DIMENSIONS.margin,
  },
  retryButton: {
    minWidth: 120,
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
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default HomeScreen;
