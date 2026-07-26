import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  ButtonSize,
  Shadows,
} from '../../constants/tokens';

interface PermissionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onAllow: () => void;
  onSkip: () => void;
}

export default function PermissionCard({
  icon,
  title,
  description,
  onAllow,
  onSkip,
}: PermissionCardProps) {
  return (
    <View style={styles.card}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={Colors.blue500} />
      </View>

      {/* Text */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Allow button */}
      <TouchableOpacity
        style={styles.allowButton}
        onPress={onAllow}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Allow ${title}`}
      >
        <Text style={styles.allowText}>Allow</Text>
      </TouchableOpacity>

      {/* Not Now */}
      <TouchableOpacity
        onPress={onSkip}
        style={styles.skipButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Skip ${title}`}
      >
        <Text style={styles.skipText}>Not Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginHorizontal: Spacing.l,
    ...Shadows.card,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: Radius.circular,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    ...Typography.headingM,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  description: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  allowButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.blue500,
    borderRadius: ButtonSize.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  allowText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
  skipButton: {
    paddingVertical: Spacing.s,
  },
  skipText: {
    ...Typography.body,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
