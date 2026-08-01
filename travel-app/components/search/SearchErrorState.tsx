import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, ButtonSize, Shadows } from '../../constants/tokens';

interface SearchErrorStateProps {
  message: string;
  onRetry: () => void;
  onContinueOffline?: () => void;
  onReportIssue?: () => void;
}

export default function SearchErrorState({
  message,
  onRetry,
  onContinueOffline,
  onReportIssue,
}: SearchErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={Colors.danger} />
      </View>

      <Text style={styles.title}>Search Failed</Text>
      <Text style={styles.subtitle}>{message}</Text>

      {/* Retry */}
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.8}
        accessibilityLabel="Retry search"
      >
        <Ionicons name="refresh" size={20} color={Colors.white} />
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>

      {/* Secondary actions */}
      <View style={styles.secondaryRow}>
        {onContinueOffline && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onContinueOffline}
            activeOpacity={0.7}
            accessibilityLabel="Continue offline"
          >
            <Ionicons name="airplane-outline" size={16} color={Colors.blue500} />
            <Text style={styles.secondaryText}>Continue Offline</Text>
          </TouchableOpacity>
        )}
        {onReportIssue && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onReportIssue}
            activeOpacity={0.7}
            accessibilityLabel="Report issue"
          >
            <Ionicons name="flag-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.secondaryTextMuted}>Report Issue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: Radius.circular,
    backgroundColor: '#FEF2F2',
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
  subtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    height: ButtonSize.primary,
    paddingHorizontal: Spacing.xl,
    borderRadius: ButtonSize.radius,
    backgroundColor: Colors.blue500,
    marginBottom: Spacing.l,
    ...Shadows.card,
  },
  retryText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.l,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.s,
  },
  secondaryText: {
    ...Typography.bodySmall,
    color: Colors.blue500,
    fontWeight: '600',
  },
  secondaryTextMuted: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
