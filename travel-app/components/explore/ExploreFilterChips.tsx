import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { ExploreMode, ExploreSubFilter, MODE_SUB_FILTERS } from '../../constants/exploreTypes';

interface Props {
  activeMode: ExploreMode;
  activeFilters: string[];
  onToggle: (filterId: string) => void;
}

/** Sub-filter chips that change based on active explore mode */
export default function ExploreFilterChips({ activeMode, activeFilters, onToggle }: Props) {
  const filters = MODE_SUB_FILTERS[activeMode];
  if (!filters || filters.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.chip,
              isActive && { backgroundColor: filter.color + '15', borderColor: filter.color },
            ]}
            onPress={() => onToggle(filter.id)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isActive }}
            accessibilityLabel={filter.label}
          >
            <Ionicons
              name={filter.icon as keyof typeof Ionicons.glyphMap}
              size={14}
              color={isActive ? filter.color : Colors.secondaryText}
              style={styles.chipIcon}
            />
            <Text style={[styles.chipText, isActive && { color: filter.color }]}>
              {filter.label}
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
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.s,
    paddingVertical: 6,
    borderRadius: Radius.circular,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
});
