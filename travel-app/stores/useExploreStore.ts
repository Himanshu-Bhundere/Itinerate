import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { trackExploreEvent } from '../lib/analytics';
import {
  ExploreMode,
  ExploreMarker,
  FeedItem,
  MapRegion,
  LatLng,
  PanelSnap,
  CompareItem,
  RoutePreviewData,
  AIRecommendation,
  DownloadedRegion,
  ExploreSubFilter,
  MarkerType,
  MARKER_CONFIGS,
  MODE_SUB_FILTERS,
} from '../constants/exploreTypes';

// ─── Default Region (India center) ───────────────────────
const DEFAULT_REGION: MapRegion = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

// ─── State Interface ──────────────────────────────────────
interface ExploreState {
  // Map
  region: MapRegion;
  userLocation: LatLng | null;
  gpsEnabled: boolean;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  compassHeading: number | null;

  // Mode
  activeMode: ExploreMode;
  activeSubFilters: string[];

  // Panel
  panelSnap: PanelSnap;

  // Markers & Feed
  markers: ExploreMarker[];
  feedItems: FeedItem[];
  selectedMarkerId: string | null;
  highlightedMarkerId: string | null;

  // Data state
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isInitialized: boolean;

  // Compare
  compareMode: boolean;
  compareItems: CompareItem[];

  // Route Preview
  routePreview: RoutePreviewData | null;

  // AI
  aiSuggestions: AIRecommendation[];

  // Offline
  isOffline: boolean;
  downloadedRegions: DownloadedRegion[];

  // Tutorial
  showTutorial: boolean;

  // Quick Actions
  quickActionMarkerId: string | null;

  // ─── Actions ─────────────────────────────────────────
  // Map
  setRegion: (region: MapRegion) => void;
  setUserLocation: (location: LatLng) => void;
  setGpsEnabled: (enabled: boolean) => void;
  setLocationPermission: (status: 'granted' | 'denied' | 'undetermined') => void;
  recenterMap: () => void;

  // Mode
  setActiveMode: (mode: ExploreMode) => void;
  toggleSubFilter: (filterId: string) => void;
  clearSubFilters: () => void;

  // Panel
  setPanelSnap: (snap: PanelSnap) => void;

  // Selection
  selectMarker: (markerId: string | null) => void;
  highlightMarker: (markerId: string | null) => void;

  // Data
  loadExploreData: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Compare
  toggleCompareMode: () => void;
  addCompareItem: (item: CompareItem) => void;
  removeCompareItem: (id: string) => void;
  clearCompare: () => void;

  // Route
  setRoutePreview: (route: RoutePreviewData | null) => void;

  // AI
  loadAISuggestions: () => void;
  dismissAISuggestion: (id: string) => void;

  // Offline
  setOffline: (offline: boolean) => void;

  // Tutorial
  dismissTutorial: () => void;

  // Quick Actions
  showQuickActions: (markerId: string) => void;
  hideQuickActions: () => void;
}


// ─── Store ────────────────────────────────────────────────
export const useExploreStore = create<ExploreState>((set, get) => ({
  // Initial state
  region: DEFAULT_REGION,
  userLocation: null,
  gpsEnabled: false,
  locationPermission: 'undetermined',
  compassHeading: null,

  activeMode: 'nearby',
  activeSubFilters: [],

  panelSnap: 'half',

  markers: [],
  feedItems: [],
  selectedMarkerId: null,
  highlightedMarkerId: null,

  isLoading: false,
  hasError: false,
  errorMessage: '',
  isInitialized: false,

  compareMode: false,
  compareItems: [],

  routePreview: null,

  aiSuggestions: [],

  isOffline: false,
  downloadedRegions: [],

  showTutorial: false,

  quickActionMarkerId: null,

  // ─── Map Actions ────────────────────────────────────
  setRegion: (region) => {
    set({ region });
    // Debounced data reload handled by the screen
  },

  setUserLocation: (location) => {
    const state = get();
    const isFirst = state.userLocation === null;
    set({ userLocation: location, gpsEnabled: true });

    // Center map on first location
    if (isFirst) {
      set({
        region: {
          ...state.region,
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
      });
    }
  },

  setGpsEnabled: (enabled) => set({ gpsEnabled: enabled }),

  setLocationPermission: (status) => set({ locationPermission: status }),

  recenterMap: () => {
    const { userLocation, region } = get();
    if (userLocation) {
      set({
        region: {
          ...region,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      });
    }
  },

  // ─── Mode Actions ───────────────────────────────────
  setActiveMode: (mode) => {
    set({ activeMode: mode, activeSubFilters: [], markers: [] });
    trackExploreEvent('mode_switched', { mode });
    // Data reload — map stays
    get().loadExploreData();
  },

  toggleSubFilter: (filterId) => {
    const { activeSubFilters } = get();
    const updated = activeSubFilters.includes(filterId)
      ? activeSubFilters.filter(f => f !== filterId)
      : [...activeSubFilters, filterId];
    set({ activeSubFilters: updated });
  },

  clearSubFilters: () => set({ activeSubFilters: [] }),

  // ─── Panel ──────────────────────────────────────────
  setPanelSnap: (snap) => set({ panelSnap: snap }),

  // ─── Selection (Feed ↔ Map sync) ───────────────────
  selectMarker: (markerId) => {
    set({ selectedMarkerId: markerId });
    if (markerId) {
      set({ panelSnap: 'half' });
      trackExploreEvent('marker_selected', { markerId });
    }
  },

  highlightMarker: (markerId) => {
    set({ highlightedMarkerId: markerId });
    if (markerId) {
      trackExploreEvent('marker_viewed', { markerId });
    }
  },

  // ─── Data Loading ──────────────────────────────────
  loadExploreData: async () => {
    const { activeMode, region } = get();
    set({ isLoading: true, hasError: false, errorMessage: '' });

    try {
      // Create bounding box for the current map region
      const minLat = region.latitude - region.latitudeDelta / 2;
      const maxLat = region.latitude + region.latitudeDelta / 2;
      const minLng = region.longitude - region.longitudeDelta / 2;
      const maxLng = region.longitude + region.longitudeDelta / 2;

      // Attempt Supabase fetch
      const { data: plansData, error } = await supabase
        .from('plans')
        .select('*')
        .eq('visibility', 'public')
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLng)
        .lte('longitude', maxLng)
        .limit(20);

      if (error) throw error;

      const markers: ExploreMarker[] = [];
      const feedItems: FeedItem[] = [];

      if (plansData && plansData.length > 0) {
        plansData.forEach((p: any) => {
          if (p.latitude != null && p.longitude != null) {
            const markerId = `plan-marker-${p.id}`;
            markers.push({
              id: markerId,
              type: 'destination',
              coordinate: {
                latitude: Number(p.latitude),
                longitude: Number(p.longitude),
              },
              title: String(p.title ?? 'Untitled Plan'),
              subtitle: p.location ? String(p.location) : 'Location',
              imageUrl: p.image_url ? String(p.image_url) : null,
              rating: 4.5,
              distance: '',
              metadata: { verified: true },
            });

            feedItems.push({
              id: `plan-feed-${p.id}`,
              type: 'itinerary',
              markerId,
              title: String(p.title ?? 'Untitled Plan'),
              subtitle: `${p.duration_days ?? '–'} days`,
              location: p.location ? String(p.location) : null,
              imageUrl: p.image_url ? String(p.image_url) : null,
              rating: null,
              distance: null,
              metadata: {
                category: String(p.category ?? ''),
                duration: Number(p.duration_days ?? 0),
              },
            });
          }
        });
      }

      set({
        markers,
        feedItems,
        isLoading: false,
        isInitialized: true,
      });

      trackExploreEvent('explore_opened', { mode: activeMode });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load explore data';

      set({
        markers: [],
        feedItems: [],
        isLoading: false,
        isInitialized: true,
        hasError: true,
        errorMessage: msg,
      });
    }
  },

  refreshData: async () => {
    set({ hasError: false, errorMessage: '' });
    await get().loadExploreData();
  },

  // ─── Compare Mode ──────────────────────────────────
  toggleCompareMode: () => {
    const { compareMode } = get();
    set({ compareMode: !compareMode, compareItems: [] });
    if (!compareMode) {
      trackExploreEvent('compare_opened');
    }
  },

  addCompareItem: (item) => {
    const { compareItems } = get();
    if (compareItems.length < 4 && !compareItems.find(c => c.id === item.id)) {
      set({ compareItems: [...compareItems, item] });
    }
  },

  removeCompareItem: (id) => {
    const { compareItems } = get();
    set({ compareItems: compareItems.filter(c => c.id !== id) });
  },

  clearCompare: () => set({ compareMode: false, compareItems: [] }),

  // ─── Route Preview ─────────────────────────────────
  setRoutePreview: (route) => {
    set({ routePreview: route });
    if (route) {
      trackExploreEvent('route_previewed');
    }
  },

  // ─── AI Suggestions ────────────────────────────────
  loadAISuggestions: () => {
    const suggestions: AIRecommendation[] = [
      {
        id: 'ai-1',
        message: 'You have one free day nearby — perfect for a short hike!',
        markerId: null,
        feedItemId: null,
        icon: 'time-outline',
        type: 'time',
      },
      {
        id: 'ai-2',
        message: 'Popular during monsoon season 🌧️',
        markerId: null,
        feedItemId: null,
        icon: 'rainy-outline',
        type: 'weather',
      },
    ];
    set({ aiSuggestions: suggestions });
  },

  dismissAISuggestion: (id) => {
    const { aiSuggestions } = get();
    set({ aiSuggestions: aiSuggestions.filter(s => s.id !== id) });
  },

  // ─── Offline ───────────────────────────────────────
  setOffline: (offline) => set({ isOffline: offline }),

  // ─── Tutorial ──────────────────────────────────────
  dismissTutorial: () => set({ showTutorial: false }),

  // ─── Quick Actions ─────────────────────────────────
  showQuickActions: (markerId) => set({ quickActionMarkerId: markerId }),
  hideQuickActions: () => set({ quickActionMarkerId: null }),
}));
