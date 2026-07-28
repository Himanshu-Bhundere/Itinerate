import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface Props {
  onAllow: () => void;
  onSkip: () => void;
}

/** Screen 02 — location permission CTA with illustration */
export default function ExplorePermissionRequest({ onAllow, onSkip }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="location" size={40} color={Colors.blue500} />
      </View>

      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.subtitle}>
        Let us show you amazing places nearby. Your location stays private and is never shared.
      </Text>

      <TouchableOpacity
        style={styles.allowBtn}
        onPress={onAllow}
        accessibilityRole="button"
        accessibilityLabel="Allow location access"
      >
        <Ionicons name="locate-outline" size={18} color={Colors.white} />
        <Text style={styles.allowText}>Allow Location Access</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipBtn}
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip for now"
      >
        <Text style={styles.skipText}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.m,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  title: {
    ...Typography.headingM,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.l,
  },
  allowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    backgroundColor: Colors.blue500,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: Radius.circular,
    marginTop: Spacing.m,
  },
  allowText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  skipBtn: {
    paddingVertical: Spacing.s,
  },
  skipText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
