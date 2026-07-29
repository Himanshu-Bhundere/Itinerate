import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { PlanCard } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  drafts: PlanCard[];
}

/** Screen 05 – Continue Planning section */
export default function ContinuePlanningSection({ drafts }: Props) {
  const router = useRouter();

  if (drafts.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Continue Planning</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {drafts.map((draft) => (
          <TouchableOpacity
            key={draft.id}
            style={styles.card}
            onPress={() => {
              trackHomeEvent('widget_clicked', { widget: 'continue_planning', plan_id: draft.id });
              router.push(`/plans/${draft.id}`);
            }}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Continue planning ${draft.title}`}
          >
            <View style={styles.cardHeader}>
              <View style={styles.draftBadge}>
                <Text style={styles.draftBadgeText}>Draft</Text>
              </View>
              <TouchableOpacity
                onPress={() => trackHomeEvent('widget_clicked', { widget: 'delete_draft', plan_id: draft.id })}
                accessibilityRole="button"
                accessibilityLabel="Delete draft"
              >
                <Ionicons name="trash-outline" size={16} color={Colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardTitle} numberOfLines={2}>{draft.title}</Text>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(draft.progress || 30)}%` }]} />
              </View>
              <Text style={styles.progressText}>{draft.progress || 30}%</Text>
            </View>

            <Text style={styles.lastEdited}>
              Last edited {new Date(draft.updated_at).toLocaleDateString()}
            </Text>

            <TouchableOpacity style={styles.continueBtn}>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
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
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
  },
  card: {
    width: 220,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    gap: Spacing.s,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draftBadge: {
    backgroundColor: Colors.orange500 + '20',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: Radius.circular,
  },
  draftBadgeText: {
    ...Typography.micro,
    fontWeight: '600',
    color: Colors.orange500,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.blue500,
    borderRadius: 2,
  },
  progressText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.blue500,
  },
  lastEdited: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.blue500,
    height: 36,
    borderRadius: Radius.xs,
  },
  continueBtnText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.white,
  },
});
