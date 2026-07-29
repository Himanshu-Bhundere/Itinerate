import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';

interface Props {
  message: string;
  onRetry: () => void;
}

/** Screen 19 – Error Recovery state */
export default function HomeErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="cloud-offline-outline" size={64} color={Colors.secondaryText} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        style={styles.retryBtn}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading"
      >
        <Ionicons name="refresh" size={18} color={Colors.white} />
        <Text style={styles.retryBtnText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.supportBtn}
        accessibilityRole="button"
        accessibilityLabel="Contact support"
      >
        <Text style={styles.supportBtnText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.divider + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    ...Typography.headingM,
    fontWeight: '700',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  message: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.l,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
    backgroundColor: Colors.blue500,
    width: '100%',
    height: 48,
    borderRadius: Radius.s,
    marginBottom: Spacing.m,
  },
  retryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.white,
  },
  supportBtn: {
    padding: Spacing.s,
  },
  supportBtnText: {
    ...Typography.bodySmall,
    fontWeight: '500',
    color: Colors.blue500,
  },
});
