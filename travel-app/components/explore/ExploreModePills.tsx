import React, { useRef, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { EXPLORE_MODES, ExploreMode } from '../../constants/exploreTypes';

interface Props {
  activeMode: ExploreMode;
  onModeChange: (mode: ExploreMode) => void;
}

/** 15 horizontal scrollable mode pills – switching modes never reloads the map */
export default function ExploreModePills({ activeMode, onModeChange }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const handlePress = useCallback((mode: ExploreMode, index: number) => {
    onModeChange(mode);
    // Auto-scroll to keep active pill visible
    scrollRef.current?.scrollTo({ x: Math.max(0, index * 100 - 60), animated: true });
  }, [onModeChange]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {EXPLORE_MODES.map((mode, index) => {
        const isActive = activeMode === mode.key;
        return (
          <TouchableOpacity
            key={mode.key}
            style={[
              styles.pill,
              isActive && { backgroundColor: mode.color, borderColor: mode.color },
            ]}
            onPress={() => handlePress(mode.key, index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={mode.label}
            activeOpacity={0.7}
          >
            <Ionicons
              name={mode.icon as keyof typeof Ionicons.glyphMap}
              size={16}
              color={isActive ? Colors.white : Colors.secondaryText}
              style={styles.pillIcon}
            />
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    gap: Spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginRight: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  pillTextActive: {
    color: Colors.white,
  },
});
