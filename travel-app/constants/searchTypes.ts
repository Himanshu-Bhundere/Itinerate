/**
 * Search Flow Types
 * Aligned with docs/02-app-flows-and-workspaces/12 - Search Flow.md
 *
 * Strict TypeScript — no `any` types.
 */

// ─── Search Entity Types ──────────────────────────────────
export type SearchEntityType =
  | 'destination'
  | 'country'
  | 'city'
  | 'place'
  | 'trek'
  | 'itinerary'
  | 'creator'
  | 'organization'
  | 'community'
  | 'meetup'
  | 'event'
  | 'tag'
  | 'activity'
  | 'restaurant'
  | 'hotel'
  | 'viewpoint'
  | 'waterfall'
  | 'lake'
  | 'beach'
  | 'mountain'
  | 'campsite';

// ─── Search Tab (for result grouping) ─────────────────────
export type SearchTab =
  | 'all'
  | 'destinations'
  | 'plans'
  | 'creators'
  | 'organizations'
  | 'places'
  | 'activities'
  | 'communities';

export const SEARCH_TABS: { key: SearchTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'destinations', label: 'Destinations' },
  { key: 'plans', label: 'Plans' },
  { key: 'creators', label: 'Creators' },
  { key: 'organizations', label: 'Organizations' },
  { key: 'places', label: 'Places' },
  { key: 'activities', label: 'Activities' },
  { key: 'communities', label: 'Communities' },
];

// ─── Search Result ────────────────────────────────────────
export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  location: string | null;
  imageUrl: string | null;
  rating: number | null;
  metadata: Record<string, string | number | boolean>;
}

export interface SearchResultGroup {
  type: SearchTab;
  label: string;
  results: SearchResult[];
  totalCount: number;
}

// ─── Search Suggestion ────────────────────────────────────
export interface SearchSuggestion {
  id: string;
  type: SearchEntityType;
  title: string;
  category: string;
  location: string | null;
  thumbnailUrl: string | null;
  icon: string;
}

// ─── Recent Search ────────────────────────────────────────
export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  pinned: boolean;
  resultType: SearchEntityType | null;
}

export type RecentSearchGroup = 'today' | 'yesterday' | 'earlier';

// ─── Trending Search ──────────────────────────────────────
export interface TrendingSearch {
  id: string;
  query: string;
  popularity: number; // 0–100
  icon: string;
}

// ─── Search Filters ───────────────────────────────────────
export interface SearchFilters {
  destination: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  durationMin: number | null;
  durationMax: number | null;
  difficulty: SearchDifficulty | null;
  travelStyle: string[];
  season: string[];
  transport: string[];
  ratingMin: number | null;
  sort: SearchSortOption;
}

export type SearchDifficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export type SearchSortOption =
  | 'relevance'
  | 'popularity'
  | 'rating'
  | 'newest'
  | 'price_low'
  | 'price_high'
  | 'distance';

export const DEFAULT_FILTERS: SearchFilters = {
  destination: null,
  budgetMin: null,
  budgetMax: null,
  durationMin: null,
  durationMax: null,
  difficulty: null,
  travelStyle: [],
  season: [],
  transport: [],
  ratingMin: null,
  sort: 'relevance',
};

// ─── Search Mode ──────────────────────────────────────────
export type SearchMode = 'text' | 'voice' | 'ai';

// ─── Filter Presets ───────────────────────────────────────
export interface FilterPreset {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: number;
}

// ─── Category Chips (for Search Landing) ──────────────────
export interface SearchCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// ─── Analytics ────────────────────────────────────────────
export type SearchAnalyticsEvent =
  | 'search_started'
  | 'search_completed'
  | 'suggestion_selected'
  | 'voice_search_used'
  | 'ai_search_used'
  | 'filter_applied'
  | 'history_cleared'
  | 'search_abandoned'
  | 'search_converted';
