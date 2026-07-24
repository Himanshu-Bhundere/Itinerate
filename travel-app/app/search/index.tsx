import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { useSearchStore } from '../../stores/useSearchStore';
import { trackSearchEvent } from '../../lib/analytics';

// Components
import UniversalSearchBar from '../../components/search/UniversalSearchBar';
import RecentSearchList from '../../components/search/RecentSearchList';
import TrendingSearchChips from '../../components/search/TrendingSearchChips';
import SearchSuggestionList from '../../components/search/SearchSuggestionList';
import SearchFilterSheet from '../../components/search/SearchFilterSheet';
import ClearHistoryDialog from '../../components/search/ClearHistoryDialog';

export default function SearchLanding() {
  const router = useRouter();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    query,
    setQuery,
    isFocused,
    setFocused,
    recentSearches,
    trendingSearches,
    popularCategories,
    suggestions,
    isSearching,
    filters,
    activeFilterCount,
    showFilterSheet,
    showClearHistoryDialog,
    setShowFilterSheet,
    setShowClearHistoryDialog,
    addRecentSearch,
    removeRecentSearch,
    pinRecentSearch,
    clearAllHistory,
    fetchSuggestions,
    setFilters,
    resetFilters,
    saveFilterPreset,
    loadPersistedData,
  } = useSearchStore();

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  // Clear query when returning to this page
  useFocusEffect(
    useCallback(() => {
      setQuery('');
    }, [setQuery])
  );

  // Debounced suggestions
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions();
      }, 300);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchSuggestions]);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    addRecentSearch(query.trim());
    router.replace({ pathname: '/search/results' as any, params: { q: query.trim() } });
  }, [query, addRecentSearch, router]);

  const handleSuggestionSelect = useCallback(
    (suggestion: { title: string }) => {
      Keyboard.dismiss();
      setQuery(suggestion.title);
      addRecentSearch(suggestion.title);
      router.replace({
        pathname: '/search/results' as any,
        params: { q: suggestion.title },
      });
    },
    [setQuery, addRecentSearch, router],
  );

  const handleRecentSelect = useCallback(
    (q: string) => {
      setQuery(q);
      router.replace({ pathname: '/search/results' as any, params: { q } });
    },
    [setQuery, router],
  );

  const handleTrendingSelect = useCallback(
    (q: string) => {
      setQuery(q);
      router.replace({ pathname: '/search/results' as any, params: { q } });
    },
    [setQuery, router],
  );

  const handleCategoryPress = useCallback(
    (category: { label: string }) => {
      setQuery(category.label);
      router.replace({ pathname: '/search/results' as any, params: { q: category.label } });
    },
    [setQuery, router],
  );

  const handleCancel = useCallback(() => {
    Keyboard.dismiss();
    setQuery('');
    setFocused(false);
    trackSearchEvent('search_abandoned');
    router.back();
  }, [setQuery, setFocused, router]);

  const hasQuery = query.trim().length > 0;
  const showSuggestions = hasQuery && suggestions.length > 0;
  const showLanding = !hasQuery;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Search Bar */}
      <UniversalSearchBar
        value={query}
        onChangeText={setQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onFilterPress={() => {
          Keyboard.dismiss();
          setShowFilterSheet(true);
        }}
        onVoiceSearchPress={() => console.log('Voice search pressed')}
        autoFocus
        isFocused={isFocused || hasQuery}
        filterCount={activeFilterCount}
      />


      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Live Suggestions */}
        {showSuggestions && (
          <SearchSuggestionList
            suggestions={suggestions}
            searchQuery={query}
            onSelect={handleSuggestionSelect}
          />
        )}

        {/* Landing Content */}
        {showLanding && (
          <>
            {/* Recent Searches */}
            <RecentSearchList
              searches={recentSearches}
              onSelect={handleRecentSelect}
              onRemove={removeRecentSearch}
              onPin={pinRecentSearch}
              onClearAll={() => {
                Keyboard.dismiss();
                setShowClearHistoryDialog(true);
              }}
            />

            {/* Trending */}
            <TrendingSearchChips
              trending={trendingSearches}
              onSelect={handleTrendingSelect}
            />

            {/* Popular Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.categoriesGrid}>
                {popularCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, { borderColor: cat.color + '40' }]}
                    onPress={() => handleCategoryPress(cat)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={(cat.icon as keyof typeof Ionicons.glyphMap) || 'grid-outline'}
                      size={24}
                      color={cat.color}
                    />
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Search Hint */}
            <View style={styles.tipsSection}>
              <View style={styles.tipsSectionLeft}>
                <Ionicons name="bulb-outline" size={16} color={Colors.warning} />
                <Text style={styles.hintText}>Search by destination, trek, or creator.</Text>
              </View>
            </View>
          </>
        )}

        {/* Typing but no suggestions yet */}
        {hasQuery && !showSuggestions && isSearching && (
          <View style={styles.searchingContainer}>
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        )}

        {hasQuery && !showSuggestions && !isSearching && query.length >= 2 && (
          <View style={styles.searchingContainer}>
            <Ionicons name="search-outline" size={24} color={Colors.placeholder} />
            <Text style={styles.noSuggestionsText}>
              No suggestions found. Press Enter to search.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Overlays */}
      <SearchFilterSheet
        visible={showFilterSheet}
        filters={filters}
        onApply={(f) => {
          setFilters(f);
          trackSearchEvent('filter_applied');
        }}
        onReset={resetFilters}
        onClose={() => setShowFilterSheet(false)}
        onSavePreset={saveFilterPreset}
      />

      <ClearHistoryDialog
        visible={showClearHistoryDialog}
        onConfirm={clearAllHistory}
        onCancel={() => setShowClearHistoryDialog(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },

  // Categories
  categoriesSection: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.headingS,
    color: Colors.primaryText,
    fontWeight: '600',
    marginBottom: Spacing.m,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  categoryCard: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.m,
    backgroundColor: Colors.white,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.xs,
  },
  categoryLabel: {
    ...Typography.micro,
    color: Colors.primaryText,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Hint
  tipsSection: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.s,
  },
  tipsSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  hintText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
  },

  // Searching
  searchingContainer: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    gap: Spacing.m,
  },
  searchingText: {
    ...Typography.body,
    color: Colors.secondaryText,
  },
  noSuggestionsText: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
