import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../../constants/tokens';

export default function TimelineModule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itinerary Timeline</Text>
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>Timeline view will appear here</Text>
        <Text style={styles.subText}>Day-by-day breakdown of activities and events</Text>
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
  placeholderCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderStyle: 'dashed',
    borderRadius: Radius.m,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.placeholder,
  },
  subText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    textAlign: 'center',
  }
});
