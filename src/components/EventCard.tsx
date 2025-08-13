import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Event } from '../types';
import { COLORS, DIMENSIONS, FONTS } from '@/utils';
import { 
  formatDateTime, 
  getBestEventImage, 
  truncateText, 
  formatPriceRange,
  formatVenueAddress 
} from '../utils/helpers';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';


interface EventCardProps {
  event: Event;
  onPress: () => void;
  onFavoritePress?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  showFavoriteButton?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onFavoritePress,
  variant = 'default',
  showFavoriteButton = true,
}) => {
  const { isRTL } = useTranslation();
  const { isFavorite } = useApp();
  const isEventFavorite = isFavorite(event.id);

  const imageUrl = getBestEventImage(event.images, 300);
  const formattedDate = formatDateTime(event.startDate, event.startTime);
  const priceRange = event.priceRanges && formatPriceRange(event.priceRanges);
  const venueAddress = formatVenueAddress(event.venue);

  const renderFavoriteButton = () => {
    if (!showFavoriteButton || !onFavoritePress) return null;

    return (
      <TouchableOpacity
        style={[styles.favoriteButton, isRTL && styles.favoriteButtonRTL]}
        onPress={onFavoritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.favoriteIcon, isEventFavorite && styles.favoriteIconActive]}>
          {isEventFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCompactCard = () => (
    <TouchableOpacity
      style={[styles.compactCard, isRTL && styles.compactCardRTL]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: imageUrl }} style={styles.compactImage} />
      <View style={[styles.compactContent, isRTL && styles.compactContentRTL]}>
        <Text style={[styles.compactTitle, isRTL && styles.textRTL]} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={[styles.compactDate, isRTL && styles.textRTL]} numberOfLines={1}>
          {formattedDate}
        </Text>
        <Text style={[styles.compactVenue, isRTL && styles.textRTL]} numberOfLines={1}>
          {event.venue.name}
        </Text>
      </View>
      {renderFavoriteButton()}
    </TouchableOpacity>
  );

  const renderFeaturedCard = () => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.featuredImageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <Text style={[styles.featuredTitle, isRTL && styles.textRTL]} numberOfLines={2}>
            {event.name}
          </Text>
          <Text style={[styles.featuredDate, isRTL && styles.textRTL]}>
            {formattedDate}
          </Text>
        </View>
        {renderFavoriteButton()}
      </View>
    </TouchableOpacity>
  );

  const renderDefaultCard = () => (
    <TouchableOpacity
      style={styles.defaultCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.defaultImage} />
        {renderFavoriteButton()}
      </View>
      
      <View style={[styles.defaultContent, isRTL && styles.defaultContentRTL]}>
        <Text style={[styles.defaultTitle, isRTL && styles.textRTL]} numberOfLines={2}>
          {event.name}
        </Text>
        
        <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={[styles.infoText, isRTL && styles.textRTL]} numberOfLines={1}>
            {formattedDate}
          </Text>
        </View>
        
        <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={[styles.infoText, isRTL && styles.textRTL]} numberOfLines={1}>
            {truncateText(venueAddress, 30)}
          </Text>
        </View>
        
        {event.priceRanges && event.priceRanges.length > 0 && (
          <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={[styles.priceText, isRTL && styles.textRTL]}>
              {priceRange}
            </Text>
          </View>
        )}
        
        {event.categories && event.categories.length > 0 && (
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryText, isRTL && styles.textRTL]}>
              {event.categories[0].name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  switch (variant) {
    case 'compact':
      return renderCompactCard();
    case 'featured':
      return renderFeaturedCard();
    case 'default':
    default:
      return renderDefaultCard();
  }
};

const styles = StyleSheet.create({
  // Default Card Styles
  defaultCard: {
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.borderRadius,
    marginBottom: DIMENSIONS.margin,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  defaultImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  defaultContent: {
    padding: DIMENSIONS.padding,
  },
  defaultContentRTL: {
    alignItems: 'flex-end',
  },
  defaultTitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: DIMENSIONS.paddingSmall,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoRowRTL: {
    flexDirection: 'row-reverse',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    flex: 1,
  },
  priceText: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    flex: 1,
  },
  categoryContainer: {
    marginTop: DIMENSIONS.paddingSmall,
  },
  categoryText: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },

  // Compact Card Styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.borderRadius,
    marginBottom: DIMENSIONS.margin,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    height: 100,
  },
  compactCardRTL: {
    flexDirection: 'row-reverse',
  },
  compactImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  compactContent: {
    flex: 1,
    padding: DIMENSIONS.padding,
    justifyContent: 'space-between',
  },
  compactContentRTL: {
    alignItems: 'flex-end',
  },
  compactTitle: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  compactDate: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  compactVenue: {
    fontSize: FONTS.sizes.small,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // Featured Card Styles
  featuredCard: {
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.borderRadius,
    marginBottom: DIMENSIONS.margin,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    position: 'relative',
    height: 250,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: DIMENSIONS.padding,
  },
  featuredTitle: {
    fontSize: FONTS.sizes.xlarge,
    fontFamily: FONTS.bold,
    color: COLORS.background,
    marginBottom: 4,
  },
  featuredDate: {
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.regular,
    color: COLORS.background,
  },

  // Favorite Button Styles
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteButtonRTL: {
    right: undefined,
    left: 10,
  },
  favoriteIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  favoriteIconActive: {
    color: COLORS.error,
  },

  // RTL Text Styles
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default EventCard;