import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { AIRecommendation } from '../../constants/exploreTypes';

interface Props {
  suggestion: AIRecommendation;
  onPress: (suggestion: AIRecommendation) => void;
  onDismiss: (id: string) => void;
}

const TYPE_ICONS: Record<string, { bg: string; fg: string }> = {
  time: { bg: '#EFF6FF', fg: '#2563EB' },
  weather: { bg: '#F0FDFA', fg: '#14B8A6' },
  preference: { bg: '#F3E8FF', fg: '#9333EA' },
  crowd: { bg: '#FEF3C7', fg: '#F59E0B' },
};

/** Screen 14 — subtle AI suggestion banner. Never dominates the interface. */
export default function AIRecommendationBanner({ suggestion, onPress, onDismiss }: Props) {
  const colors = TYPE_ICONS[suggestion.type] ?? TYPE_ICONS.time;

  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: colors.bg, borderColor: colors.fg + '30' }]}
      onPress={() => onPress(suggestion)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`AI suggestion: ${suggestion.message}`}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.fg + '20' }]}>
        <Ionicons
          name={suggestion.icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={colors.fg}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.aiLabel}>
          <Ionicons name="sparkles" size={10} color="#9333EA" />
          <Text style={styles.aiLabelText}>AI</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{suggestion.message}</Text>
      </View>

      <TouchableOpacity
        onPress={() => onDismiss(suggestion.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Dismiss suggestion"
      >
        <Ionicons name="close" size={16} color={Colors.placeholder} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    marginHorizontal: Spacing.l,
    marginVertical: Spacing.s,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  aiLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9333EA',
    letterSpacing: 0.5,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
    lineHeight: 18,
  },
});
