import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { FeedItem } from '../../constants/exploreTypes';

interface Props {
  item: FeedItem;
  onPress: (item: FeedItem) => void;
  onSave?: (item: FeedItem) => void;
  isHighlighted?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop';

/** Explore feed card for destinations — image-forward with category badge */
export default function DestinationCard({ item, onPress, onSave, isHighlighted }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isHighlighted && styles.cardHighlighted]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} destination`}
    >
      <ImageBackground
        source={{ uri: item.imageUrl || DEFAULT_IMAGE }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />

        <View style={styles.topRow}>
          {item.metadata.category && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {String(item.metadata.category).toUpperCase()}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => onSave?.(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={`Save ${item.title}`}
          >
            <Ionicons name="heart-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}>
            {item.distance && (
              <View style={styles.metaChip}>
                <Ionicons name="navigate-outline" size={11} color={Colors.white} />
                <Text style={styles.metaText}>{item.distance}</Text>
              </View>
            )}
            {item.rating !== null && (
              <View style={styles.metaChip}>
                <Ionicons name="star" size={11} color="#FACC15" />
                <Text style={styles.metaText}>{item.rating}</Text>
              </View>
            )}
            {item.metadata.duration && (
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={11} color={Colors.white} />
                <Text style={styles.metaText}>{item.metadata.duration}d</Text>
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
    width: 200,
    height: 260,
    marginRight: Spacing.m,
    borderRadius: Radius.l,
    overflow: 'hidden',
  },
  cardHighlighted: {
    borderWidth: 2,
    borderColor: Colors.blue500,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Radius.l,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: 3,
    borderRadius: Radius.s,
    backgroundColor: Colors.teal500,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomRow: {
    zIndex: 1,
  },
  title: {
    color: Colors.white,
    ...Typography.body,
    fontWeight: '800',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  metaText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});
