import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import type { TrendingSearch } from '../../constants/searchTypes';

interface TrendingSearchChipsProps {
  trending: TrendingSearch[];
  onSelect: (query: string) => void;
}

function getPopularityBar(popularity: number): { width: number; color: string } {
  if (popularity >= 90) return { width: 40, color: Colors.danger };
  if (popularity >= 75) return { width: 32, color: Colors.orange500 };
  if (popularity >= 60) return { width: 24, color: Colors.teal500 };
  return { width: 16, color: Colors.blue500 };
}

export default function TrendingSearchChips({
  trending,
  onSelect,
}: TrendingSearchChipsProps) {
  if (trending.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={20} color={Colors.orange500} />
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {trending.map((item) => {
          const bar = getPopularityBar(item.popularity);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.chip}
              onPress={() => onSelect(item.query)}
              activeOpacity={0.7}
              accessibilityLabel={`Trending: ${item.query}`}
            >
              <Ionicons
                name={(item.icon as keyof typeof Ionicons.glyphMap) || 'search-outline'}
                size={16}
                color={Colors.blue500}
                style={styles.chipIcon}
              />
              <Text style={styles.chipText}>{item.query}</Text>
              {/* Popularity indicator */}
              <View style={styles.popularityContainer}>
                <View
                  style={[
                    styles.popularityBar,
                    { width: bar.width, backgroundColor: bar.color },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.l,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    color: Colors.primaryText,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.s,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s + 2,
    borderRadius: Radius.circular,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
    ...Shadows.card,
  },
  chipIcon: {
    marginRight: Spacing.xs,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  popularityContainer: {
    marginLeft: Spacing.s,
    height: 3,
    backgroundColor: Colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  popularityBar: {
    height: 3,
    borderRadius: 2,
  },
});
