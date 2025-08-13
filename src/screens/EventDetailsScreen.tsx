import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from '@/hooks';
import { useApp } from '@/contexts';
import { RootStackParamList } from '@/types';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';
import {
  formatDateTime,
  getBestEventImage,
  formatPriceRange,
  formatVenueAddress,
} from '@/utils';
import { Button, Card, Image } from '@/components';
import MapView, { Marker } from 'react-native-maps';

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

export const EventDetailsScreen: React.FC = () => {
  const route = useRoute<EventDetailsRouteProp>();
  const { event } = route.params;
  const { t, isRTL } = useTranslation();
  const { addToFavorites, removeFromFavorites, isFavorite } = useApp();

  const isEventFavorite = isFavorite(event.id);
  const imageUrl = getBestEventImage(event.images, 800);
  const formattedDate = formatDateTime(event.startDate, event.startTime);
  const priceRange = event.priceRanges
    ? formatPriceRange(event.priceRanges)
    : '';
  const venueAddress = formatVenueAddress(event.venue);
  const latitude = event.venue.location?.latitude
  const longitude = event.venue.location?.longitude
  const lat = latitude ? parseFloat(latitude) : null
  const lng = longitude ? parseFloat(longitude) : null

  const handleFavoriteToggle = async () => {
    try {
      if (isEventFavorite) {
        await removeFromFavorites(event.id);
        Alert.alert(t('success.eventUnfavorited'));
      } else {
        await addToFavorites(event);
        Alert.alert(t('success.eventFavorited'));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleGetTickets = () => {
    if (event.url) {
      Linking.openURL(event.url).catch(() => {
        Alert.alert(t('common.error'), 'Unable to open ticket URL');
      });
    } else {
      Alert.alert('Tickets', 'Ticket information not available');
    }
  };

  const handleViewOnMap = () => {
    if (event.venue.location) {
      const { latitude, longitude } = event.venue.location;
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(t('common.error'), 'Unable to open map');
      });
    } else {
      Alert.alert('Map', 'Location information not available');
    }
  };

  const renderInfoRow = (icon: string, label: string, value: string) => (
    <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, isRTL && styles.textRTL]}>{label}</Text>
        <Text style={[styles.infoValue, isRTL && styles.textRTL]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        {imageUrl && <Image src={imageUrl} style={styles.image} />}
        <TouchableOpacity
          style={[styles.favoriteButton, isRTL && styles.favoriteButtonRTL]}
          onPress={handleFavoriteToggle}
        >
          <Text
            style={[
              styles.favoriteIcon,
              isEventFavorite && styles.favoriteIconActive,
            ]}
          >
            {isEventFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {event.name}
        </Text>

        {event.categories && event.categories.length > 0 && (
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryText, isRTL && styles.textRTL]}>
              {event.categories[0].name}
            </Text>
          </View>
        )}

        {lat && lng &&<Card style={styles.mapCard}>
          <MapView
            style={styles.container}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              title={event.name}
            />
          </MapView>
        </Card>}

        <Card style={styles.infoCard}>
          {renderInfoRow('📅', t('eventDetails.when'), formattedDate)}
          {renderInfoRow(
            '📍',
            t('eventDetails.where'),
            `${event.venue.name}, ${venueAddress}`,
          )}
          {event.priceRanges &&
            event.priceRanges.length > 0 &&
            renderInfoRow('💰', t('eventDetails.price'), priceRange)}
        </Card>

        {event.description && (
          <Card style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('eventDetails.description')}
            </Text>
            <Text style={[styles.descriptionText, isRTL && styles.textRTL]}>
              {event.description}
            </Text>
          </Card>
        )}

        {event.info && (
          <Card style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('eventDetails.eventInfo')}
            </Text>
            <Text style={[styles.descriptionText, isRTL && styles.textRTL]}>
              {event.info}
            </Text>
          </Card>
        )}

        {event.pleaseNote && (
          <Card style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('eventDetails.pleaseNote')}
            </Text>
            <Text style={[styles.descriptionText, isRTL && styles.textRTL]}>
              {event.pleaseNote}
            </Text>
          </Card>
        )}

        {event.accessibility && (
          <Card style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('eventDetails.accessibility')}
            </Text>
            <Text style={[styles.descriptionText, isRTL && styles.textRTL]}>
              {event.accessibility}
            </Text>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={t('eventDetails.getTickets')}
            onPress={handleGetTickets}
            style={styles.button}
            fullWidth
          />

          {event.venue.location && (
            <Button
              title={t('eventDetails.viewOnMap')}
              onPress={handleViewOnMap}
              variant="outline"
              style={styles.button}
              icon={<Text style={styles.buttonIcon}>🗺️</Text>}
              fullWidth
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteButtonRTL: {
    right: undefined,
    left: 16,
  },
  favoriteIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  favoriteIconActive: {
    color: COLORS.error,
  },
  content: {
    padding: DIMENSIONS.padding,
  },
  title: {
    fontSize: FONTS.sizes.xxlarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: DIMENSIONS.margin,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    marginBottom: DIMENSIONS.margin,
  },
  categoryText: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infoCard: {
    marginBottom: DIMENSIONS.margin,
  },
  mapCard: {
    width: '100%',
    height: 300,
    alignSelf: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: DIMENSIONS.margin,
  },
  infoRowRTL: {
    flexDirection: 'row-reverse',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: DIMENSIONS.margin,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 20,
  },
  descriptionCard: {
    marginBottom: DIMENSIONS.margin,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: DIMENSIONS.paddingSmall,
  },
  descriptionText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: DIMENSIONS.margin,
    gap: DIMENSIONS.margin,
  },
  button: {
    marginBottom: DIMENSIONS.paddingSmall,
  },
  buttonIcon: {
    fontSize: 16,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default EventDetailsScreen;
