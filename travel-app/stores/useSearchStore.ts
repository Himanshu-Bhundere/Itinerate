import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { trackSearchEvent } from '../lib/analytics';
import {
  SearchResult,
  SearchResultGroup,
  SearchSuggestion,
  RecentSearch,
  TrendingSearch,
  SearchFilters,
  SearchTab,
  SearchMode,
  FilterPreset,
  SearchCategory,
  DEFAULT_FILTERS,
} from '../constants/searchTypes';

// ─── Constants ────────────────────────────────────────────
const RECENT_SEARCHES_KEY = 'itinerate_recent_searches';
const FILTER_PRESETS_KEY = 'itinerate_filter_presets';
const MAX_RECENT_SEARCHES = 50;
const DEBOUNCE_MS = 300;

// ─── Mock Data ────────────────────────────────────────────
const MOCK_TRENDING: TrendingSearch[] = [
  { id: 'tr-1', query: 'Monsoon Treks', popularity: 95, icon: 'rainy-outline' },
  { id: 'tr-2', query: 'Leh Road Trip', popularity: 88, icon: 'car-outline' },
  { id: 'tr-3', query: 'Spiti Valley', popularity: 82, icon: 'trail-sign-outline' },
  { id: 'tr-4', query: 'Goa Weekend', popularity: 78, icon: 'sunny-outline' },
  { id: 'tr-5', query: 'Kerala Backwaters', popularity: 72, icon: 'boat-outline' },
  { id: 'tr-6', query: 'Rajasthan Heritage', popularity: 68, icon: 'business-outline' },
];

const POPULAR_CATEGORIES: SearchCategory[] = [
  { id: 'cat-1', label: 'Treks', icon: 'walk-outline', color: '#16A34A' },
  { id: 'cat-2', label: 'Beaches', icon: 'sunny-outline', color: '#F97316' },
  { id: 'cat-3', label: 'Mountains', icon: 'triangle-outline', color: '#2563EB' },
  { id: 'cat-4', label: 'Heritage', icon: 'business-outline', color: '#9333EA' },
  { id: 'cat-5', label: 'Camping', icon: 'bonfire-outline', color: '#DC2626' },
  { id: 'cat-6', label: 'Road Trips', icon: 'car-outline', color: '#14B8A6' },
  { id: 'cat-7', label: 'Food', icon: 'restaurant-outline', color: '#E11D48' },
  { id: 'cat-8', label: 'Wildlife', icon: 'paw-outline', color: '#65A30D' },
];

// ─── State Interface ──────────────────────────────────────
interface SearchState {
  // Query
  query: string;
  searchMode: SearchMode;
  activeTab: SearchTab;

  // Results
  resultGroups: SearchResultGroup[];
  suggestions: SearchSuggestion[];
  totalResults: number;

  // History & Trending
  recentSearches: RecentSearch[];
  trendingSearches: TrendingSearch[];
  popularCategories: SearchCategory[];

  // Filters
  filters: SearchFilters;
  activeFilterCount: number;
  filterPresets: FilterPreset[];

  // UI State
  isLoading: boolean;
  isSearching: boolean;
  isFocused: boolean;
  isOffline: boolean;
  hasError: boolean;
  errorMessage: string;
  showFilterSheet: boolean;
  showClearHistoryDialog: boolean;

  // Actions
  setQuery: (query: string) => void;
  setActiveTab: (tab: SearchTab) => void;
  setSearchMode: (mode: SearchMode) => void;
  setFocused: (focused: boolean) => void;
  setOffline: (offline: boolean) => void;

  performSearch: () => Promise<void>;
  fetchSuggestions: () => Promise<void>;

  addRecentSearch: (query: string) => void;
  removeRecentSearch: (id: string) => void;
  pinRecentSearch: (id: string) => void;
  clearAllHistory: () => void;

  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  saveFilterPreset: (name: string) => void;
  applyFilterPreset: (preset: FilterPreset) => void;
  deleteFilterPreset: (id: string) => void;
  setShowFilterSheet: (show: boolean) => void;
  setShowClearHistoryDialog: (show: boolean) => void;

  loadPersistedData: () => Promise<void>;
  retrySearch: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────
function countActiveFilters(filters: SearchFilters): number {
  let count = 0;
  if (filters.destination) count++;
  if (filters.budgetMin !== null || filters.budgetMax !== null) count++;
  if (filters.durationMin !== null || filters.durationMax !== null) count++;
  if (filters.difficulty) count++;
  if (filters.travelStyle.length > 0) count++;
  if (filters.season.length > 0) count++;
  if (filters.transport.length > 0) count++;
  if (filters.ratingMin !== null) count++;
  if (filters.sort !== 'relevance') count++;
  return count;
}

function groupRecentSearches(searches: RecentSearch[]): { today: RecentSearch[]; yesterday: RecentSearch[]; earlier: RecentSearch[] } {
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 86400000;

  const today: RecentSearch[] = [];
  const yesterday: RecentSearch[] = [];
  const earlier: RecentSearch[] = [];

  for (const s of searches) {
    if (s.timestamp >= todayStart) today.push(s);
    else if (s.timestamp >= yesterdayStart) yesterday.push(s);
    else earlier.push(s);
  }

  return { today, yesterday, earlier };
}

// ─── Store ────────────────────────────────────────────────
export const useSearchStore = create<SearchState>((set, get) => ({
  // Initial state
  query: '',
  searchMode: 'text',
  activeTab: 'all',

  resultGroups: [],
  suggestions: [],
  totalResults: 0,

  recentSearches: [],
  trendingSearches: MOCK_TRENDING,
  popularCategories: POPULAR_CATEGORIES,

  filters: { ...DEFAULT_FILTERS },
  activeFilterCount: 0,
  filterPresets: [],

  isLoading: false,
  isSearching: false,
  isFocused: false,
  isOffline: false,
  hasError: false,
  errorMessage: '',
  showFilterSheet: false,
  showClearHistoryDialog: false,

  // ─── Query Actions ────────────────────────────────────
  setQuery: (query: string) => {
    set({ query, hasError: false, errorMessage: '' });

    if (query.trim().length === 0) {
      set({ suggestions: [], resultGroups: [], totalResults: 0, isSearching: false });
      return;
    }

    // Debounced suggestions
    set({ isSearching: true });
  },

  setActiveTab: (tab: SearchTab) => set({ activeTab: tab }),
  setSearchMode: (mode: SearchMode) => set({ searchMode: mode }),
  setFocused: (focused: boolean) => set({ isFocused: focused }),
  setOffline: (offline: boolean) => set({ isOffline: offline }),

  // ─── Search ───────────────────────────────────────────
  performSearch: async () => {
    const { query, filters, activeTab } = get();
    if (!query.trim()) return;

    set({ isLoading: true, hasError: false, errorMessage: '' });
    trackSearchEvent('search_started', { query, mode: get().searchMode });

    try {
      // Build Supabase query for plans (primary entity)
      let plansQuery = supabase
        .from('plans')
        .select('*, profiles(display_name)')
        .or(`title.ilike.%${query}%,location.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('visibility', 'public')
        .limit(20);

      // Apply duration filter
      if (filters.durationMin !== null) {
        plansQuery = plansQuery.gte('duration_days', filters.durationMin);
      }
      if (filters.durationMax !== null) {
        plansQuery = plansQuery.lte('duration_days', filters.durationMax);
      }

      // Apply budget filter
      if (filters.budgetMin !== null) {
        // Note: budget_level in DB is text, but we filter if it happens to be numeric strings or just filter exactly if needed.
        // Assuming budget_level contains numbers.
        plansQuery = plansQuery.gte('budget_level', filters.budgetMin);
      }
      if (filters.budgetMax !== null) {
        plansQuery = plansQuery.lte('budget_level', filters.budgetMax);
      }

      // Apply destination filter
      if (filters.destination) {
        plansQuery = plansQuery.ilike('location', `%${filters.destination}%`);
      }

      // Apply sort
      switch (filters.sort) {
        case 'newest':
          plansQuery = plansQuery.order('created_at', { ascending: false });
          break;
        case 'price_low':
          plansQuery = plansQuery.order('budget_level', { ascending: true });
          break;
        case 'price_high':
          plansQuery = plansQuery.order('budget_level', { ascending: false });
          break;
        case 'relevance':
        default:
          // Default to newest if no specific relevance sorting is available
          plansQuery = plansQuery.order('created_at', { ascending: false });
          break;
      }

      const { data: plansData, error: plansError } = await plansQuery;

      if (plansError) throw plansError;

      const plans = (plansData ?? []).map((p: Record<string, unknown>): SearchResult => ({
        id: String(p.id),
        type: 'itinerary',
        title: String(p.title ?? ''),
        subtitle: (p.profiles as Record<string, unknown>)?.display_name
          ? `by ${String((p.profiles as Record<string, unknown>).display_name)}`
          : '',
        location: p.location ? String(p.location) : null,
        imageUrl: p.image_url ? String(p.image_url) : null,
        rating: null,
        metadata: {
          duration: Number(p.duration_days ?? 0),
          category: String(p.category ?? ''),
          visibility: String(p.visibility ?? 'public'),
        },
      }));

      // Group results
      const groups: SearchResultGroup[] = [];

      if (plans.length > 0) {
        groups.push({
          type: 'plans',
          label: 'Plans & Itineraries',
          results: plans,
          totalCount: plans.length,
        });
      }

      // For now we only search plans table; future phases add other entities
      // Create mock destination results from plan locations
      const uniqueLocations = [...new Set(plans.map(p => p.location).filter(Boolean))];
      if (uniqueLocations.length > 0) {
        groups.unshift({
          type: 'destinations',
          label: 'Destinations',
          results: uniqueLocations.slice(0, 5).map((loc, i) => ({
            id: `dest-${i}`,
            type: 'destination' as const,
            title: loc!,
            subtitle: 'Destination',
            location: loc,
            imageUrl: null,
            rating: null,
            metadata: {},
          })),
          totalCount: uniqueLocations.length,
        });
      }

      const total = groups.reduce((sum, g) => sum + g.results.length, 0);

      set({
        resultGroups: groups,
        totalResults: total,
        isLoading: false,
      });

      // Add to recent searches
      get().addRecentSearch(query);

      trackSearchEvent('search_completed', {
        query,
        resultCount: total,
        tab: activeTab,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Search failed';
      set({
        isLoading: false,
        hasError: true,
        errorMessage: msg,
      });
    }
  },

  fetchSuggestions: async () => {
    const { query } = get();
    if (query.trim().length < 2) {
      set({ suggestions: [], isSearching: false });
      return;
    }

    try {
      const { data } = await supabase
        .from('plans')
        .select('id, title, location, category')
        .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
        .eq('visibility', 'public')
        .limit(8);

      const suggestions: SearchSuggestion[] = (data ?? []).map((item: Record<string, unknown>): SearchSuggestion => ({
        id: String(item.id),
        type: 'itinerary',
        title: String(item.title ?? ''),
        category: String(item.category ?? 'Plan'),
        location: item.location ? String(item.location) : null,
        thumbnailUrl: null,
        icon: 'map-outline',
      }));

      set({ suggestions, isSearching: false });
    } catch {
      set({ isSearching: false });
    }
  },

  // ─── Recent Searches ──────────────────────────────────
  addRecentSearch: (query: string) => {
    const { recentSearches } = get();

    // Dedupe
    const filtered = recentSearches.filter(
      (s) => s.query.toLowerCase() !== query.toLowerCase()
    );

    const newEntry: RecentSearch = {
      id: `recent-${Date.now()}`,
      query,
      timestamp: Date.now(),
      pinned: false,
      resultType: null,
    };

    const updated = [newEntry, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    set({ recentSearches: updated });

    // Persist
    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch(() => {});
  },

  removeRecentSearch: (id: string) => {
    const { recentSearches } = get();
    const updated = recentSearches.filter((s) => s.id !== id);
    set({ recentSearches: updated });
    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch(() => {});
  },

  pinRecentSearch: (id: string) => {
    const { recentSearches } = get();
    const updated = recentSearches.map((s) =>
      s.id === id ? { ...s, pinned: !s.pinned } : s
    );
    // Sort: pinned first, then by timestamp
    updated.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.timestamp - a.timestamp;
    });
    set({ recentSearches: updated });
    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch(() => {});
  },

  clearAllHistory: () => {
    set({ recentSearches: [], showClearHistoryDialog: false });
    AsyncStorage.removeItem(RECENT_SEARCHES_KEY).catch(() => {});
    trackSearchEvent('history_cleared');
  },

  // ─── Filters ──────────────────────────────────────────
  setFilters: (partial: Partial<SearchFilters>) => {
    const { filters } = get();
    const updated = { ...filters, ...partial };
    set({ filters: updated, activeFilterCount: countActiveFilters(updated) });
  },

  resetFilters: () => {
    set({ filters: { ...DEFAULT_FILTERS }, activeFilterCount: 0 });
  },

  saveFilterPreset: (name: string) => {
    const { filters, filterPresets } = get();
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: { ...filters },
      createdAt: Date.now(),
    };
    const updated = [...filterPresets, preset];
    set({ filterPresets: updated });
    AsyncStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(updated)).catch(() => {});
  },

  applyFilterPreset: (preset: FilterPreset) => {
    set({
      filters: { ...preset.filters },
      activeFilterCount: countActiveFilters(preset.filters),
    });
  },

  deleteFilterPreset: (id: string) => {
    const { filterPresets } = get();
    const updated = filterPresets.filter((p) => p.id !== id);
    set({ filterPresets: updated });
    AsyncStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(updated)).catch(() => {});
  },

  setShowFilterSheet: (show: boolean) => set({ showFilterSheet: show }),
  setShowClearHistoryDialog: (show: boolean) => set({ showClearHistoryDialog: show }),

  // ─── Persistence ──────────────────────────────────────
  loadPersistedData: async () => {
    try {
      const [recentRaw, presetsRaw] = await Promise.all([
        AsyncStorage.getItem(RECENT_SEARCHES_KEY),
        AsyncStorage.getItem(FILTER_PRESETS_KEY),
      ]);

      const recentSearches: RecentSearch[] = recentRaw ? JSON.parse(recentRaw) : [];
      const filterPresets: FilterPreset[] = presetsRaw ? JSON.parse(presetsRaw) : [];

      set({ recentSearches, filterPresets });
    } catch {
      // Silent fail on persistence load
    }
  },

  retrySearch: async () => {
    set({ hasError: false, errorMessage: '' });
    await get().performSearch();
  },
}));

// Export helper
export { groupRecentSearches };
