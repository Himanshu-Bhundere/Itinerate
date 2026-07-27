import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { DestinationMetadata } from '../../constants/destinationTypes';

interface DestinationQuickFactsProps {
  metadata: DestinationMetadata;
}

export default function DestinationQuickFacts({ metadata }: DestinationQuickFactsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>At a Glance</Text>
      
      <View style={styles.grid}>
        <View style={styles.factCard}>
          <View style={[styles.iconBox, { backgroundColor: Colors.teal50 }]}>
            <Ionicons name="time" size={24} color={Colors.teal600} />
          </View>
          <Text style={styles.factLabel}>Recommended</Text>
          <Text style={styles.factValue}>{metadata.recommendedDuration}</Text>
        </View>

        <View style={styles.factCard}>
          <View style={[styles.iconBox, { backgroundColor: Colors.blue50 }]}>
            <Ionicons name="wallet" size={24} color={Colors.blue600} />
          </View>
          <Text style={styles.factLabel}>Avg Budget</Text>
          <Text style={styles.factValue}>${metadata.averageBudget}/day</Text>
        </View>

        <View style={styles.factCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="leaf" size={24} color={Colors.orange500} />
          </View>
          <Text style={styles.factLabel}>Best Season</Text>
          <Text style={styles.factValue}>{metadata.bestSeason}</Text>
        </View>

        <View style={styles.factCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.danger} />
          </View>
          <Text style={styles.factLabel}>Safety</Text>
          <Text style={styles.factValue}>{metadata.safetyIndex}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.primaryText,
    marginBottom: Spacing.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.m,
  },
  factCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.m,
    padding: Spacing.m,
    ...Shadows.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  factLabel: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  factValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryText,
  },
});
