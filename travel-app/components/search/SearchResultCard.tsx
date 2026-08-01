import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import type { SearchResult } from '../../constants/searchTypes';

interface SearchResultCardProps {
  result: SearchResult;
  onPress: (result: SearchResult) => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';

function getEntityIcon(type: string): keyof typeof Ionicons.glyphMap {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    destination: 'location',
    city: 'business',
    country: 'globe',
    place: 'pin',
    trek: 'walk',
    itinerary: 'map',
    creator: 'person',
    organization: 'people',
    community: 'chatbubbles',
    meetup: 'calendar',
    event: 'ticket',
    activity: 'flash',
    restaurant: 'restaurant',
    hotel: 'bed',
    viewpoint: 'eye',
    waterfall: 'water',
    lake: 'water',
    beach: 'sunny',
    mountain: 'triangle',
    campsite: 'bonfire',
  };
  return icons[type] ?? 'search';
}

function getEntityColor(type: string): string {
  const colors: Record<string, string> = {
    destination: Colors.blue500,
    itinerary: Colors.teal500,
    creator: Colors.orange500,
    organization: '#9333EA',
    community: '#E11D48',
    activity: '#16A34A',
    trek: '#65A30D',
  };
  return colors[type] ?? Colors.blue500;
}

export default function SearchResultCard({ result, onPress }: SearchResultCardProps) {
  const entityColor = getEntityColor(result.type);
  const duration = result.metadata.duration as number | undefined;
  const category = result.metadata.category as string | undefined;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(result)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${result.title}, ${result.type}`}
    >
      {/* Image */}
      <Image
        source={{ uri: result.imageUrl || DEFAULT_IMAGE }}
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Type badge */}
        <View style={[styles.typeBadge, { backgroundColor: entityColor + '15' }]}>
          <Ionicons name={getEntityIcon(result.type)} size={12} color={entityColor} />
          <Text style={[styles.typeText, { color: entityColor }]}>
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>{result.title}</Text>

        {result.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{result.subtitle}</Text>
        ) : null}

        {/* Meta row */}
        <View style={styles.metaRow}>
          {result.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={12} color={Colors.secondaryText} />
              <Text style={styles.metaText}>{result.location}</Text>
            </View>
          )}
          {duration ? (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color={Colors.secondaryText} />
              <Text style={styles.metaText}>{duration} Days</Text>
            </View>
          ) : null}
          {result.rating !== null && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{result.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={10} color={Colors.white} />
            </View>
          )}
          {category ? (
            <Text style={styles.categoryText}>{category}</Text>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.divider} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginBottom: Spacing.s,
    ...Shadows.card,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: Radius.s,
    marginRight: Spacing.m,
  },
  content: {
    flex: 1,
    marginRight: Spacing.s,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: Radius.circular,
    gap: 4,
    marginBottom: 4,
  },
  typeText: {
    ...Typography.micro,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.body,
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
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    gap: 2,
  },
  ratingText: {
    ...Typography.micro,
    fontWeight: '700',
    color: Colors.white,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
