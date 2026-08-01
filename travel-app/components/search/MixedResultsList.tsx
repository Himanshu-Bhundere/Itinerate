import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { SearchResultGroup, SearchResult } from '../../constants/searchTypes';
import SearchResultCard from './SearchResultCard';

interface MixedResultsListProps {
  groups: SearchResultGroup[];
  onResultPress: (result: SearchResult) => void;
  onViewAll: (group: SearchResultGroup) => void;
}

export default function MixedResultsList({
  groups,
  onResultPress,
  onViewAll,
}: MixedResultsListProps) {
  if (groups.length === 0) return null;

  return (
    <View style={styles.container}>
      {groups.map((group) => (
        <View key={group.type} style={styles.groupContainer}>
          {/* Group Header */}
          <View style={styles.groupHeader}>
            <View>
              <Text style={styles.groupTitle}>{group.label}</Text>
              <Text style={styles.groupCount}>
                {group.totalCount} result{group.totalCount !== 1 ? 's' : ''}
              </Text>
            </View>
            {group.totalCount > 3 && (
              <TouchableOpacity
                onPress={() => onViewAll(group)}
                accessibilityLabel={`View all ${group.label}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Results (show max 3 in mixed view) */}
          {group.results.slice(0, 3).map((result) => (
            <SearchResultCard
              key={result.id}
              result={result}
              onPress={onResultPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  groupContainer: {
    marginBottom: Spacing.l,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  groupTitle: {
    ...Typography.headingS,
    color: Colors.primaryText,
    fontWeight: '600',
  },
  groupCount: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  viewAllText: {
    ...Typography.bodySmall,
    color: Colors.blue500,
    fontWeight: '600',
  },
});
