import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { FeedItem } from '../../constants/exploreTypes';

interface Props {
  item: FeedItem;
  onPress: (item: FeedItem) => void;
  isHighlighted?: boolean;
}

const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

/** Meetup card — title, time, attendee count, avatar pile, distance */
export default function MeetupCard({ item, onPress, isHighlighted }: Props) {
  const going = item.metadata.going ? Number(item.metadata.going) : 0;
  const time = item.metadata.time ? String(item.metadata.time) : 'Upcoming';

  return (
    <TouchableOpacity
      style={[styles.card, isHighlighted && styles.cardHighlighted]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} meetup`}
    >
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="people" size={16} color={Colors.teal500} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      {going > 0 && (
        <Text style={styles.going}>{going} going</Text>
      )}

      <View style={styles.avatarPile}>
        {[1, 2, 3, 4].map((i) => (
          <Image
            key={i}
            source={{ uri: AVATAR_IMG }}
            style={[styles.avatar, { zIndex: 10 - i, marginLeft: i === 1 ? 0 : -8 }]}
          />
        ))}
      </View>

      {item.distance && (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.secondaryText} />
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginRight: Spacing.m,
  },
  cardHighlighted: {
    borderColor: Colors.teal500,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: Spacing.s,
  },
  iconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#d1fae5',
    borderRadius: Radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  time: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  going: {
    ...Typography.caption,
    color: Colors.teal500,
    fontWeight: '600',
    marginBottom: Spacing.s,
  },
  avatarPile: {
    flexDirection: 'row',
    marginBottom: Spacing.s,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
});
