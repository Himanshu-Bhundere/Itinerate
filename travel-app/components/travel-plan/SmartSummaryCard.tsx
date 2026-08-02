import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { TravelPlanMetadata } from '../../constants/travelPlanTypes';

interface SmartSummaryCardProps {
  metadata: TravelPlanMetadata;
}

export default function SmartSummaryCard({ metadata }: SmartSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {metadata.duration_days && (
          <View style={styles.item}>
            <Ionicons name="time-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.text}>{metadata.duration_days} Days</Text>
          </View>
        )}
        {metadata.budget_level && metadata.budget_level !== 'not-set' && (
          <View style={styles.item}>
            <Ionicons name="wallet-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.text}>{metadata.budget_level}</Text>
          </View>
        )}
        {metadata.difficulty && (
          <View style={styles.item}>
            <Ionicons name="trending-up-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.text}>{metadata.difficulty}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        {metadata.totalDistance && (
          <View style={styles.item}>
            <Ionicons name="map-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.text}>{metadata.totalDistance}</Text>
          </View>
        )}
        {metadata.weatherOverview && (
          <View style={styles.item}>
            <Ionicons name="partly-sunny-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.text}>{metadata.weatherOverview}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginHorizontal: Spacing.m,
    marginTop: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.m,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.s,
  }
});
