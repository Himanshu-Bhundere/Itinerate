import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/tokens';
import type { SearchSuggestion } from '../../constants/searchTypes';
import SearchSuggestionItem from './SearchSuggestionItem';

interface SearchSuggestionListProps {
  suggestions: SearchSuggestion[];
  searchQuery: string;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export default function SearchSuggestionList({
  suggestions,
  searchQuery,
  onSelect,
}: SearchSuggestionListProps) {
  if (suggestions.length === 0) return null;

  // Group by category type
  const grouped = suggestions.reduce<Record<string, SearchSuggestion[]>>((acc, s) => {
    const key = s.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {Object.entries(grouped).map(([category, items]) => (
        <View key={category}>
          <Text style={styles.groupLabel}>{category}</Text>
          {items.map((suggestion) => (
            <SearchSuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              onPress={onSelect}
              searchQuery={searchQuery}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
