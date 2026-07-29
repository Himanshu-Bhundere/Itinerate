import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { CommunityPick } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  picks: CommunityPick[];
}

/** Screen 10 – Community Picks section */
export default function CommunityPicks({ picks }: Props) {
  const router = useRouter();

  if (picks.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Community Picks</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="View all community picks">
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {picks.map((pick) => (
          <TouchableOpacity
            key={pick.id}
            style={styles.card}
            onPress={() => {
              trackHomeEvent('recommendation_opened', { plan_id: pick.id });
            }}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`View ${pick.title}`}
          >
            <Image source={{ uri: pick.image_url }} style={styles.cardImage} />
            <View style={styles.reasonBadge}>
              <Ionicons name="star" size={10} color={Colors.warning} />
              <Text style={styles.reasonText}>{pick.reason}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>{pick.title}</Text>
              <View style={styles.creatorRow}>
                <Text style={styles.creator}>{pick.creator}</Text>
                {pick.verified && (
                  <Ionicons name="checkmark-circle" size={14} color={Colors.blue500} />
                )}
              </View>
              <View style={styles.popularityRow}>
                <Ionicons name="heart" size={12} color={Colors.danger} />
                <Text style={styles.popularityText}>
                  {pick.popularity >= 1000
                    ? `${(pick.popularity / 1000).toFixed(1)}k`
                    : pick.popularity}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  viewAll: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.blue500,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
  },
  card: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  reasonBadge: {
    position: 'absolute',
    top: Spacing.s,
    left: Spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: Radius.circular,
  },
  reasonText: {
    ...Typography.micro,
    fontWeight: '600',
    color: Colors.white,
  },
  cardContent: {
    padding: Spacing.s,
    gap: 4,
  },
  cardTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creator: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  popularityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularityText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
