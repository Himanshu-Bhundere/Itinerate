import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/tokens';
import PlaceCard from '../explore/PlaceCard';
import type { FeedItem } from '../../constants/exploreTypes';

interface DestinationPlacesListProps {
  title: string;
  places: FeedItem[];
  onPressPlace: (item: FeedItem) => void;
}

export default function DestinationPlacesList({
  title,
  places,
  onPressPlace,
}: DestinationPlacesListProps) {
  if (!places.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={220 + Spacing.s}
        decelerationRate="fast"
      >
        {places.map((place) => (
          <PlaceCard 
            key={place.id}
            item={place}
            onPress={onPressPlace}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.primaryText,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  scrollContent: {
    paddingHorizontal: Spacing.m,
  },
});
