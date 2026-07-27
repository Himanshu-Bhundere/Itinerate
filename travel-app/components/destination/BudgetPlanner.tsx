import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { BudgetTier } from '../../constants/destinationTypes';

interface BudgetPlannerProps {
  budgetTiers: BudgetTier[];
}

export default function BudgetPlanner({ budgetTiers }: BudgetPlannerProps) {
  const [activeTierId, setActiveTierId] = useState<BudgetTier['id']>(
    budgetTiers[0]?.id || 'comfort'
  );

  const activeTier = budgetTiers.find(t => t.id === activeTierId);

  if (!budgetTiers.length || !activeTier) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Budget Planner</Text>
      <Text style={styles.sectionSubtitle}>Estimated daily costs per person</Text>

      {/* Tier Selector */}
      <View style={styles.segmentedControl}>
        {budgetTiers.map((tier) => {
          const isActive = tier.id === activeTierId;
          return (
            <Pressable
              key={tier.id}
              style={[styles.segment, isActive && styles.segmentActive]}
              onPress={() => setActiveTierId(tier.id)}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {tier.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Cost Breakdown */}
      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Daily Total</Text>
          <Text style={styles.totalAmount}>${activeTier.totalCost}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownIcon}>
            <Ionicons name="bed" size={20} color={Colors.blue600} />
          </View>
          <Text style={styles.breakdownLabel}>Accommodation</Text>
          <Text style={styles.breakdownValue}>${activeTier.accommodationCost}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownIcon}>
            <Ionicons name="restaurant" size={20} color={Colors.orange500} />
          </View>
          <Text style={styles.breakdownLabel}>Food & Drink</Text>
          <Text style={styles.breakdownValue}>${activeTier.foodCost}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownIcon}>
            <Ionicons name="bus" size={20} color={Colors.teal600} />
          </View>
          <Text style={styles.breakdownLabel}>Local Transport</Text>
          <Text style={styles.breakdownValue}>${activeTier.transportCost}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownIcon}>
            <Ionicons name="ticket" size={20} color={Colors.information} />
          </View>
          <Text style={styles.breakdownLabel}>Activities</Text>
          <Text style={styles.breakdownValue}>${activeTier.activitiesCost}</Text>
        </View>
      </View>
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
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: Spacing.m,
    backgroundColor: Colors.disabledBg,
    borderRadius: Radius.s,
    padding: 4,
    marginBottom: Spacing.m,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.s,
    alignItems: 'center',
    borderRadius: Radius.xs,
  },
  segmentActive: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.card,
  },
  segmentText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: Colors.primaryText,
    fontWeight: '700',
  },
  card: {
    marginHorizontal: Spacing.m,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.l,
    padding: Spacing.m,
    ...Shadows.card,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  totalAmount: {
    ...Typography.headingL,
    color: Colors.blue600,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.m,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.circular,
    backgroundColor: Colors.disabledBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  breakdownLabel: {
    ...Typography.body,
    color: Colors.primaryText,
    flex: 1,
  },
  breakdownValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryText,
  },
});
