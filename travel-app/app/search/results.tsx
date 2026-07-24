import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Keyboard, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UniversalSearchBar from '../../components/search/UniversalSearchBar';
import MixedResultsList from '../../components/search/MixedResultsList';
import { useSearchStore } from '../../stores/useSearchStore';
import SkeletonSearchResults from '../../components/search/SkeletonSearchResults';
import SearchErrorState from '../../components/search/SearchErrorState';
import NoResultsState from '../../components/search/NoResultsState';
import OfflineBanner from '../../components/search/OfflineBanner';
import SearchFilterSheet from '../../components/search/SearchFilterSheet';
// import VoiceSearchPlaceholder from '../../components/search/VoiceSearchPlaceholder';
import SavedFiltersSheet from '../../components/search/SavedFiltersSheet';
import SearchResultCard from '../../components/search/SearchResultCard';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { SEARCH_TABS, SearchTab, SearchResult, SearchResultGroup } from '../../constants/searchTypes';
import { trackSearchEvent } from '../../lib/analytics';

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    query,
    setQuery,
    activeTab,
    setActiveTab,
    performSearch,
    isLoading,
    hasError,
    errorMessage,
    resultGroups,
    totalResults,
    activeFilterCount,
    filters,
    setFilters,
    resetFilters,
    saveFilterPreset,
    filterPresets,
    applyFilterPreset,
    deleteFilterPreset,
    retrySearch,
    addRecentSearch,
  } = useSearchStore();

  const [isOffline, setIsOffline] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [voiceVisible, setVoiceVisible] = useState(false);
  const [savedFiltersVisible, setSavedFiltersVisible] = useState(false);
  const [showSlowNetwork, setShowSlowNetwork] = useState(false);

  // Slow network detection (Screen 28)
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowSlowNetwork(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowSlowNetwork(false);
  }, [isLoading]);

  // Load query from params
  useEffect(() => {
    if (q) {
      if (q !== query) {
        setQuery(q);
      }
      performSearch();
    }
  }, [q]);

  const handleBack = useCallback(() => {
    // Just go back to the previous page. The cross button is for clearing.
    if (router.canGoBack()) {
      router.back();
    } else if (router.canDismiss?.()) {
      router.dismissAll();
    } else {
      router.push('/(tabs)/explore' as never);
    }
  }, [router]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    if (query.trim()) {
      addRecentSearch(query.trim());
      router.setParams({ q: query });
      performSearch();
      trackSearchEvent('search_started', { query });
    }
  }, [query, addRecentSearch, router, performSearch]);

  const handleResultPress = useCallback((result: SearchResult) => {
    trackSearchEvent('search_converted', { resultId: result.id, resultType: result.type });
    // Navigate based on result type
    switch (result.type) {
      case 'itinerary':
        router.push(`/plans/${result.id}` as never);
        break;
      case 'destination':
      case 'city':
      case 'country':
        // Navigate to destination discovery
        router.push({ pathname: '/search/results' as never, params: { q: result.title } });
        break;
      case 'creator':
        // Navigate to creator profile
        break;
      default:
        break;
    }
  }, [router]);

  const handleViewAll = useCallback((group: SearchResultGroup) => {
    // Switch to the entity-specific tab
    setActiveTab(group.type);
    trackSearchEvent('search_completed', { tab: group.type });
  }, [setActiveTab]);

  // Filter results by active tab
  const filteredGroups = activeTab === 'all'
    ? resultGroups
    : resultGroups.filter(g => g.type === activeTab);

  const hasResults = resultGroups.length > 0;

  // Get available tabs (only show tabs that have results)
  const availableTabs = SEARCH_TABS.filter(
    tab => tab.key === 'all' || resultGroups.some(g => g.type === tab.key)
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Offline Banner (Screen 18) */}
      {isOffline && <OfflineBanner />}

      {/* Slow Network Banner (Screen 28) */}
      {showSlowNetwork && (
        <View style={styles.slowBanner}>
          <Ionicons name="wifi-outline" size={16} color={Colors.warning} />
          <Text style={styles.slowBannerText}>Slow connection — showing cached results</Text>
        </View>
      )}

      {/* Search Bar */}
      <UniversalSearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSubmit}
        onClear={handleClear}
        showBackButton={true}
        onBack={handleBack}
        // onVoicePress={() => setVoiceVisible(true)}
        onFilterPress={() => {
          Keyboard.dismiss();
          setFilterVisible(true);
        }}
        autoFocus={false}
        filterCount={activeFilterCount}
        isFocused={false}
      />

      {/* Active Filters / Saved Filters Row */}
      {(activeFilterCount > 0 || filterPresets.length > 0) && (
        <View style={styles.filtersRow}>
          {activeFilterCount > 0 && (
            <TouchableOpacity
              style={styles.activeFilterChip}
              onPress={resetFilters}
              accessibilityLabel="Clear all filters"
            >
              <Text style={styles.activeFilterText}>{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</Text>
              <Ionicons name="close-circle" size={14} color={Colors.blue500} />
            </TouchableOpacity>
          )}
          {filterPresets.length > 0 && (
            <TouchableOpacity
              style={styles.savedFilterChip}
              onPress={() => {
                Keyboard.dismiss();
                setSavedFiltersVisible(true);
              }}
              accessibilityLabel="Saved filters"
            >
              <Ionicons name="bookmark-outline" size={14} color={Colors.teal500} />
              <Text style={styles.savedFilterText}>Saved Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Entity-Type Tabs (Screen 10–15) */}
      {hasResults && !isLoading && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScroll}
        >
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tab.key === 'all'
              ? totalResults
              : resultGroups.find(g => g.type === tab.key)?.totalCount ?? 0;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${tab.label} ${count} results`}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Results Content */}
      <View style={styles.content}>
        {isLoading ? (
          <SkeletonSearchResults />
        ) : hasError ? (
          <SearchErrorState message={errorMessage} onRetry={retrySearch} />
        ) : !hasResults ? (
          <NoResultsState 
            query={query} 
            hasFilters={activeFilterCount > 0}
            onRemoveFilters={resetFilters}
            onExploreMap={() => router.push('/map' as never)} 
            onSuggestionPress={(q) => {
              setQuery(q);
              router.setParams({ q });
              performSearch();
            }}
          />
        ) : activeTab === 'all' ? (
          // Mixed Results (Screen 10)
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
              </Text>
            </View>
            <MixedResultsList
              groups={resultGroups}
              onResultPress={handleResultPress}
              onViewAll={handleViewAll}
            />
          </ScrollView>
        ) : (
          // Entity-Specific Results (Screen 11-15)
          <FlatList
            data={filteredGroups.flatMap(g => g.results)}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsScroll}
            ListHeaderComponent={
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {filteredGroups.reduce((sum, g) => sum + g.totalCount, 0)} result
                  {filteredGroups.reduce((sum, g) => sum + g.totalCount, 0) !== 1 ? 's' : ''}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.entityCardWrapper}>
                <SearchResultCard result={item} onPress={handleResultPress} />
              </View>
            )}
            ListEmptyComponent={
              <NoResultsState 
                query={query} 
                hasFilters={activeFilterCount > 0}
                onRemoveFilters={resetFilters}
                onExploreMap={() => router.push('/map' as never)} 
              />
            }
          />
        )}
      </View>

      {/* Filter Sheet (Screen 09) */}
      <SearchFilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={(f) => {
          setFilters(f);
          setFilterVisible(false);
          trackSearchEvent('filter_applied');
          performSearch();
        }}
        onReset={() => {
          resetFilters();
        }}
        onSavePreset={(name) => {
          saveFilterPreset(name);
        }}
      />

      {/* Saved Filters Sheet (Screen 19) */}
      <SavedFiltersSheet
        visible={savedFiltersVisible}
        presets={filterPresets}
        onApply={(preset) => {
          applyFilterPreset(preset);
          setSavedFiltersVisible(false);
          performSearch();
        }}
        onDelete={deleteFilterPreset}
        onClose={() => setSavedFiltersVisible(false)}
      />

      {/* Voice Search (Screen 07) */}
      {/* <VoiceSearchPlaceholder
        visible={voiceVisible}
        onClose={() => setVoiceVisible(false)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
  },

  // Slow Network Banner
  slowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.warning + '20',
  },
  slowBannerText: {
    ...Typography.caption,
    color: Colors.primaryText,
    fontWeight: '500',
  },

  // Filters Row
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.xs,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.blue50,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.blue200,
  },
  activeFilterText: {
    ...Typography.caption,
    color: Colors.blue500,
    fontWeight: '600',
  },
  savedFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.teal50,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.teal200,
  },
  savedFilterText: {
    ...Typography.caption,
    color: Colors.teal500,
    fontWeight: '600',
  },

  // Tabs
  tabsScroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.blue500,
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.blue500,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.circular,
    backgroundColor: Colors.divider,
  },
  tabBadgeActive: {
    backgroundColor: Colors.blue500,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  tabBadgeTextActive: {
    color: Colors.white,
  },

  // Results
  resultsScroll: {
    paddingBottom: 80,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  resultsCount: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
  },
  entityCardWrapper: {
    paddingHorizontal: Spacing.l,
  },
});
