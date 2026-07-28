import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { MARKER_CONFIGS, MarkerType } from '../../constants/exploreTypes';
import type { FeedItem } from '../../constants/exploreTypes';

interface Props {
  item: FeedItem;
  onPress: (item: FeedItem) => void;
  isHighlighted?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=200&auto=format&fit=crop';

/** Compact card for nearby places — thumbnail, name, type badge, distance */
export default function PlaceCard({ item, onPress, isHighlighted }: Props) {
  const markerConfig = MARKER_CONFIGS[item.type as MarkerType] ?? MARKER_CONFIGS.destination;

  return (
    <TouchableOpacity
      style={[styles.card, isHighlighted && styles.cardHighlighted]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} place`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl || DEFAULT_IMAGE }}
          style={styles.image}
        />
        <View style={[styles.typeBadge, { backgroundColor: markerConfig.color }]}>
          <Ionicons
            name={markerConfig.icon as keyof typeof Ionicons.glyphMap}
            size={10}
            color={Colors.white}
          />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
        <View style={styles.metaRow}>
          {item.distance && (
            <>
              <Ionicons name="location-outline" size={11} color={Colors.secondaryText} />
              <Text style={styles.distance}>{item.distance}</Text>
            </>
          )}
          {item.rating !== null && (
            <>
              <Ionicons name="star" size={11} color="#FACC15" />
              <Text style={styles.rating}>{item.rating}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 220,
    padding: Spacing.s,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginRight: Spacing.s,
  },
  cardHighlighted: {
    borderColor: Colors.blue500,
    borderWidth: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: Radius.s,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  title: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    ...Typography.micro,
    color: Colors.secondaryText,
    marginRight: 6,
  },
  rating: {
    ...Typography.micro,
    color: Colors.primaryText,
    fontWeight: '600',
  },
});
