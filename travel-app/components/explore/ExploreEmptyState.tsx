import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface Props {
  mode: string;
  onAdjust: () => void;
}

/** Screen 16 — no places found in the visible map region */
export default function ExploreEmptyState({ mode, onAdjust }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="search-outline" size={36} color={Colors.placeholder} />
      </View>

      <Text style={styles.title}>Nothing Here Yet</Text>
      <Text style={styles.subtitle}>
        No {mode} results found in this area. Try zooming out or switching modes.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onAdjust}
        accessibilityRole="button"
        accessibilityLabel="Adjust filters"
      >
        <Ionicons name="options-outline" size={16} color={Colors.blue500} />
        <Text style={styles.buttonText}>Adjust Filters</Text>
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
    backgroundColor: Colors.disabledBg,
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.blue500,
    marginTop: Spacing.s,
  },
  buttonText: {
    ...Typography.bodySmall,
    color: Colors.blue500,
    fontWeight: '600',
  },
});
