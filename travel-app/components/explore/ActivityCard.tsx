import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { FeedItem } from '../../constants/exploreTypes';

interface Props {
  item: FeedItem;
  onPress: (item: FeedItem) => void;
  isHighlighted?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop';

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#16A34A',
  moderate: '#F59E0B',
  hard: '#DC2626',
  expert: '#7C3AED',
};

/** Activity card for treks/adventures — difficulty badge, duration, price */
export default function ActivityCard({ item, onPress, isHighlighted }: Props) {
  const difficulty = item.metadata.difficulty ? String(item.metadata.difficulty) : null;
  const diffColor = difficulty ? (DIFFICULTY_COLORS[difficulty.toLowerCase()] ?? Colors.secondaryText) : Colors.secondaryText;

  return (
    <TouchableOpacity
      style={[styles.card, isHighlighted && styles.cardHighlighted]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} activity`}
    >
      <ImageBackground
        source={{ uri: item.imageUrl || DEFAULT_IMAGE }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />

        {/* Top badges */}
        <View style={styles.topRow}>
          {difficulty && (
            <View style={[styles.diffBadge, { backgroundColor: diffColor }]}>
              <Ionicons name="fitness-outline" size={10} color={Colors.white} />
              <Text style={styles.diffText}>{difficulty.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Bottom info */}
        <View style={styles.bottomRow}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}>
            {item.distance && (
              <View style={styles.metaChip}>
                <Ionicons name="navigate-outline" size={10} color={Colors.white} />
                <Text style={styles.metaText}>{item.distance}</Text>
              </View>
            )}
            {item.metadata.duration && (
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={10} color={Colors.white} />
                <Text style={styles.metaText}>{item.metadata.duration}h</Text>
              </View>
            )}
            {item.metadata.price && (
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>₹{item.metadata.price}</Text>
              </View>
            )}
            {item.rating !== null && (
              <View style={styles.metaChip}>
                <Ionicons name="star" size={10} color="#FACC15" />
                <Text style={styles.metaText}>{item.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 220,
    marginRight: Spacing.m,
    borderRadius: Radius.l,
    overflow: 'hidden',
  },
  cardHighlighted: {
    borderWidth: 2,
    borderColor: Colors.teal500,
  },
  image: {
    width: '100%',
    height: '100%',
    padding: Spacing.s,
    justifyContent: 'space-between',
  },
  imageStyle: {
    borderRadius: Radius.l,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: Radius.l,
  },
  topRow: {
    flexDirection: 'row',
    zIndex: 1,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  diffText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomRow: {
    zIndex: 1,
  },
  title: {
    color: Colors.white,
    ...Typography.bodySmall,
    fontWeight: '800',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  metaText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
});
