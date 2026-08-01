import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { SearchSuggestion } from '../../constants/searchTypes';

interface SearchSuggestionItemProps {
  suggestion: SearchSuggestion;
  onPress: (suggestion: SearchSuggestion) => void;
  searchQuery?: string;
}

export default function SearchSuggestionItem({
  suggestion,
  onPress,
  searchQuery = '',
}: SearchSuggestionItemProps) {
  // Highlight matching text
  const highlightTitle = (title: string, query: string) => {
    if (!query) return <Text style={styles.title}>{title}</Text>;

    const idx = title.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <Text style={styles.title}>{title}</Text>;

    return (
      <Text style={styles.title}>
        {title.slice(0, idx)}
        <Text style={styles.titleHighlight}>{title.slice(idx, idx + query.length)}</Text>
        {title.slice(idx + query.length)}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(suggestion)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${suggestion.title}, ${suggestion.category}`}
    >
      {/* Icon or Thumbnail */}
      {suggestion.thumbnailUrl ? (
        <Image source={{ uri: suggestion.thumbnailUrl }} style={styles.thumbnail} />
      ) : (
        <View style={styles.iconContainer}>
          <Ionicons
            name={(suggestion.icon as keyof typeof Ionicons.glyphMap) || 'search-outline'}
            size={20}
            color={Colors.blue500}
          />
        </View>
      )}

      {/* Text Content */}
      <View style={styles.textContainer}>
        {highlightTitle(suggestion.title, searchQuery)}
        <View style={styles.metaRow}>
          <Text style={styles.category}>{suggestion.category}</Text>
          {suggestion.location && (
            <>
              <Text style={styles.separator}>•</Text>
              <Ionicons name="location-outline" size={12} color={Colors.secondaryText} />
              <Text style={styles.location}>{suggestion.location}</Text>
            </>
          )}
        </View>
      </View>

      {/* Navigate arrow */}
      <Ionicons name="arrow-forward-outline" size={16} color={Colors.divider} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.xs,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: Radius.xs,
    marginRight: Spacing.m,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.s,
  },
  title: {
    ...Typography.body,
    color: Colors.primaryText,
    fontWeight: '500',
    marginBottom: 2,
  },
  titleHighlight: {
    color: Colors.blue500,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  separator: {
    ...Typography.caption,
    color: Colors.divider,
  },
  location: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
});
