import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, ButtonSize } from '../../constants/tokens';

interface NoResultsStateProps {
  query: string;
  hasFilters: boolean;
  onRemoveFilters?: () => void;
  onExploreMap?: () => void;
  suggestions?: string[];
  onSuggestionPress?: (query: string) => void;
}

const POPULAR_DESTINATIONS = ['Manali', 'Goa', 'Leh', 'Kerala', 'Rishikesh'];

export default function NoResultsState({
  query,
  hasFilters,
  onRemoveFilters,
  onExploreMap,
  suggestions = [],
  onSuggestionPress,
}: NoResultsStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.placeholder} />
      </View>

      <Text style={styles.title}>No results for "{query}"</Text>
      <Text style={styles.subtitle}>
        Try different keywords, check spelling, or explore other options.
      </Text>

      {/* Remove filters CTA */}
      {hasFilters && (
        <TouchableOpacity
          style={styles.removeFiltersButton}
          onPress={onRemoveFilters}
          activeOpacity={0.8}
          accessibilityLabel="Remove all filters"
        >
          <Ionicons name="funnel-outline" size={16} color={Colors.blue500} />
          <Text style={styles.removeFiltersText}>Remove Filters</Text>
        </TouchableOpacity>
      )}

      {/* Related suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionLabel}>Related Searches</Text>
          <View style={styles.chipsRow}>
            {suggestions.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.chip}
                onPress={() => onSuggestionPress?.(s)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Popular destinations */}
      <View style={styles.suggestionsSection}>
        <Text style={styles.sectionLabel}>Popular Destinations</Text>
        <View style={styles.chipsRow}>
          {POPULAR_DESTINATIONS.map((dest) => (
            <TouchableOpacity
              key={dest}
              style={styles.popularChip}
              onPress={() => onSuggestionPress?.(dest)}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={14} color={Colors.teal500} />
              <Text style={styles.popularChipText}>{dest}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Explore Map */}
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={onExploreMap}
        activeOpacity={0.8}
        accessibilityLabel="Explore on map"
      >
        <Ionicons name="map-outline" size={20} color={Colors.white} />
        <Text style={styles.exploreButtonText}>Explore Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing['3xl'],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: Radius.circular,
    backgroundColor: Colors.surface,
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
    marginBottom: Spacing.l,
  },
  removeFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.blue500,
    marginBottom: Spacing.l,
  },
  removeFiltersText: {
    ...Typography.bodySmall,
    color: Colors.blue500,
    fontWeight: '600',
  },
  suggestionsSection: {
    width: '100%',
    marginBottom: Spacing.l,
  },
  sectionLabel: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.secondaryText,
    marginBottom: Spacing.s,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  chip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    backgroundColor: Colors.teal50,
    borderWidth: 1,
    borderColor: Colors.teal100,
  },
  popularChipText: {
    ...Typography.bodySmall,
    color: Colors.teal700,
    fontWeight: '500',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    height: ButtonSize.medium,
    paddingHorizontal: Spacing.l,
    borderRadius: ButtonSize.radius,
    backgroundColor: Colors.blue500,
  },
  exploreButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
