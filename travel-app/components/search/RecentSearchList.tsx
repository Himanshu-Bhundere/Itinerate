import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/tokens';
import type { RecentSearch } from '../../constants/searchTypes';
import { groupRecentSearches } from '../../stores/useSearchStore';
import RecentSearchItem from './RecentSearchItem';

interface RecentSearchListProps {
  searches: RecentSearch[];
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
  onPin: (id: string) => void;
  onClearAll: () => void;
}

export default function RecentSearchList({
  searches,
  onSelect,
  onRemove,
  onPin,
  onClearAll,
}: RecentSearchListProps) {
  if (searches.length === 0) return null;

  const groups = groupRecentSearches(searches);

  const renderGroup = (label: string, items: RecentSearch[]) => {
    if (items.length === 0) return null;
    return (
      <View key={label}>
        <Text style={styles.groupLabel}>{label}</Text>
        {items.map((item) => (
          <RecentSearchItem
            key={item.id}
            item={item}
            onPress={onSelect}
            onRemove={onRemove}
            onPin={onPin}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity
          onPress={onClearAll}
          accessibilityLabel="Clear all recent searches"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {renderGroup('Today', groups.today)}
      {renderGroup('Yesterday', groups.yesterday)}
      {renderGroup('Earlier', groups.earlier)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.s,
  },
  sectionTitle: {
    ...Typography.headingS,
    color: Colors.primaryText,
    fontWeight: '600',
  },
  clearAllText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '600',
  },
  groupLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.xs,
  },
});
