import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { PlanCard } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  recommendations: PlanCard[];
  onSave: (planId: string) => void;
  savedIds: Set<string>;
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop';

/** Screen 07 – Personalized Recommendations horizontal carousel */
export default function RecommendationsCarousel({ recommendations, onSave, savedIds }: Props) {
  const router = useRouter();

  if (recommendations.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <Text style={styles.basedOn}>Based on your travel style & past activity</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="View all recommendations">
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendations.map((plan) => {
          const isSaved = savedIds.has(plan.id);
          return (
            <TouchableOpacity
              key={plan.id}
              style={styles.card}
              onPress={() => {
                trackHomeEvent('recommendation_opened', { plan_id: plan.id });
                router.push(`/plans/${plan.id}`);
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`View ${plan.title}`}
            >
              <Image
                source={{ uri: plan.image_url || DEFAULT_IMG }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{plan.title}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color={Colors.secondaryText} />
                    <Text style={styles.metaText}>{plan.duration_days || 3} days</Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={12} color="#FACC15" />
                    <Text style={styles.metaText}>4.8</Text>
                  </View>
                </View>
                {plan.profiles?.display_name && (
                  <Text style={styles.creator} numberOfLines={1}>
                    by {plan.profiles.display_name}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => onSave(plan.id)}
                accessibilityRole="button"
                accessibilityLabel={isSaved ? 'Unsave plan' : 'Save plan'}
              >
                <Ionicons
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isSaved ? Colors.danger : Colors.secondaryText}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
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
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  basedOn: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  viewAll: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.blue500,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
  },
  card: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardImage: {
    width: '100%',
    height: 120,
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
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  metaDot: {
    ...Typography.caption,
    color: Colors.divider,
  },
  creator: {
    ...Typography.micro,
    color: Colors.secondaryText,
  },
  saveBtn: {
    position: 'absolute',
    top: Spacing.s,
    right: Spacing.s,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
