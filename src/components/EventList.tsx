import { RootStackNavigationProp } from '@/navigation';
import { Event } from '@/types';
import { SCREENS } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { JSX, useCallback } from 'react';
import { Alert, FlatList, StyleProp, ViewStyle } from 'react-native';
import EventCard from './EventCard';
import { useTranslation } from '@/hooks';
import { useApp } from '@/contexts/AppContext';

const EventList = ({
  events,
  ListEmptyComponent,
  ListHeaderComponent,
  RefreshControlConponent,
  steakyHeaderIndecies,
  eventCardVariant,
  isFavoriteList,
  style,
}: {
  events: Event[];
  ListHeaderComponent?: JSX.Element;
  ListEmptyComponent: JSX.Element;
  RefreshControlConponent?: JSX.Element;
  steakyHeaderIndecies?: number[]
  eventCardVariant?: "featured" | "default" | "compact"
  isFavoriteList?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const { removeFromFavorites, isFavorite, addToFavorites } = useApp();
  const navigation = useNavigation<RootStackNavigationProp>();

  const renderEventItem = useCallback(
    ({ item }: { item: Event }) => {
      const handleEventPress = (event: Event) => {
        navigation.navigate(SCREENS.EVENT_DETAILS, { event });
      };

      const handleFavoritePress = async (event: Event) => {
        if (!isFavoriteList && isFavorite(event.id)) {
          await removeFromFavorites(event.id);
          Alert.alert(t('success.eventUnfavorited'));
        } else {
          await addToFavorites(event);
          Alert.alert(t('success.eventFavorited'));
        }
      };
      return (
        <EventCard
          event={item}
          onPress={() => handleEventPress(item)}
          onFavoritePress={() => handleFavoritePress(item)}
          variant={eventCardVariant ?? 'default'}
        />
      );
    },
    [
      addToFavorites,
      isFavorite,
      isFavoriteList,
      navigation,
      removeFromFavorites,
      t,
      eventCardVariant
    ],
  );
  return (
    <FlatList
      data={events}
      renderItem={renderEventItem}
      keyExtractor={item => item.id}
      stickyHeaderIndices={steakyHeaderIndecies}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={RefreshControlConponent}
      contentContainerStyle={style}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default EventList;
