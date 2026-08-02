import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../../constants/tokens';
import { TravelPlanMetadata } from '../../../constants/travelPlanTypes';

interface OverviewModuleProps {
  metadata: TravelPlanMetadata;
}

export default function OverviewModule({ metadata }: OverviewModuleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Overview</Text>
      <View style={styles.card}>
        <Text style={styles.description}>
          {metadata.description || 'No description provided for this trip.'}
        </Text>
      </View>
      
      {/* Destinations Preview Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destinations</Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Destination details will appear here</Text>
        </View>
      </View>

      {/* Highlights Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Highlights</Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Highlights and must-sees</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.m,
    gap: Spacing.m,
  },
  title: {
    ...Typography.headingM,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.m,
    padding: Spacing.m,
  },
  description: {
    ...Typography.body,
    color: Colors.secondaryText,
    lineHeight: 22,
  },
  section: {
    marginTop: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  placeholderCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderStyle: 'dashed',
    borderRadius: Radius.m,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.placeholder,
  }
});
