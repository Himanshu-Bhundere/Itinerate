import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface Props {
  message: string;
  onRetry: () => void;
}

/** Screen 21 — error state with retry button */
export default function ExploreErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={36} color={Colors.danger} />
      </View>

      <Text style={styles.title}>Something Went Wrong</Text>
      <Text style={styles.subtitle}>{message}</Text>

      <TouchableOpacity
        style={styles.retryBtn}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading"
      >
        <Ionicons name="refresh-outline" size={16} color={Colors.white} />
        <Text style={styles.retryText}>Try Again</Text>
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  title: {
    ...Typography.headingS,
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
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.blue500,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: Radius.circular,
    marginTop: Spacing.s,
  },
  retryText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
});
