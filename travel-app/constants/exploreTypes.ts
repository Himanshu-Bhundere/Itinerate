/**
 * Explore Discovery Flow Types
 * Aligned with docs/02-app-flows-and-workspaces/13 - Explore Discovery Flow.md
 *
 * Strict TypeScript — no `any` types.
 */

// ─── Explore Modes (15 total) ─────────────────────────────
export type ExploreMode =
  | 'nearby'
  | 'trending'
  | 'weekend'
  | 'adventure'
  | 'family'
  | 'road_trips'
  | 'camping'
  | 'trekking'
  | 'food'
  | 'photography'
  | 'hidden_gems'
  | 'waterfalls'
  | 'historical'
  | 'religious'
  | 'seasonal';

export interface ExploreModeConfig {
  key: ExploreMode;
  label: string;
  icon: string;
  color: string;
}

export const EXPLORE_MODES: ExploreModeConfig[] = [
  { key: 'nearby', label: 'Nearby', icon: 'location', color: '#2563EB' },
  { key: 'trending', label: 'Trending', icon: 'trending-up', color: '#DC2626' },
  { key: 'weekend', label: 'Weekend', icon: 'sunny-outline', color: '#F97316' },
  { key: 'adventure', label: 'Adventure', icon: 'compass-outline', color: '#16A34A' },
  { key: 'family', label: 'Family', icon: 'people-outline', color: '#9333EA' },
  { key: 'road_trips', label: 'Road Trips', icon: 'car-outline', color: '#14B8A6' },
  { key: 'camping', label: 'Camping', icon: 'bonfire-outline', color: '#EA580C' },
  { key: 'trekking', label: 'Trekking', icon: 'walk-outline', color: '#059669' },
  { key: 'food', label: 'Food', icon: 'restaurant-outline', color: '#E11D48' },
  { key: 'photography', label: 'Photography', icon: 'camera-outline', color: '#7C3AED' },
  { key: 'hidden_gems', label: 'Hidden Gems', icon: 'diamond-outline', color: '#0891B2' },
  { key: 'waterfalls', label: 'Waterfalls', icon: 'water-outline', color: '#2563EB' },
  { key: 'historical', label: 'Historical', icon: 'business-outline', color: '#92400E' },
  { key: 'religious', label: 'Religious', icon: 'leaf-outline', color: '#B45309' },
  { key: 'seasonal', label: 'Seasonal', icon: 'snow-outline', color: '#0369A1' },
];

// ─── Marker Types (16 total) ──────────────────────────────
export type MarkerType =
  | 'destination'
  | 'restaurant'
  | 'hotel'
  | 'camp'
  | 'viewpoint'
  | 'waterfall'
  | 'lake'
  | 'beach'
  | 'temple'
  | 'museum'
  | 'trek_start'
  | 'camp_site'
  | 'parking'
  | 'meetup'
  | 'creator_recommendation'
  | 'organization';

export interface MarkerConfig {
  type: MarkerType;
  icon: string;
  color: string;
  label: string;
}

export const MARKER_CONFIGS: Record<MarkerType, MarkerConfig> = {
  destination: { type: 'destination', icon: 'location', color: '#2563EB', label: 'Destination' },
  restaurant: { type: 'restaurant', icon: 'restaurant', color: '#E11D48', label: 'Restaurant' },
  hotel: { type: 'hotel', icon: 'bed-outline', color: '#7C3AED', label: 'Hotel' },
  camp: { type: 'camp', icon: 'bonfire-outline', color: '#EA580C', label: 'Camp' },
  viewpoint: { type: 'viewpoint', icon: 'eye-outline', color: '#0891B2', label: 'Viewpoint' },
  waterfall: { type: 'waterfall', icon: 'water-outline', color: '#2563EB', label: 'Waterfall' },
  lake: { type: 'lake', icon: 'fish-outline', color: '#0EA5E9', label: 'Lake' },
  beach: { type: 'beach', icon: 'sunny-outline', color: '#F59E0B', label: 'Beach' },
  temple: { type: 'temple', icon: 'leaf-outline', color: '#B45309', label: 'Temple' },
  museum: { type: 'museum', icon: 'business-outline', color: '#92400E', label: 'Museum' },
  trek_start: { type: 'trek_start', icon: 'walk-outline', color: '#059669', label: 'Trek Start' },
  camp_site: { type: 'camp_site', icon: 'trail-sign-outline', color: '#16A34A', label: 'Camp Site' },
  parking: { type: 'parking', icon: 'car-outline', color: '#64748B', label: 'Parking' },
  meetup: { type: 'meetup', icon: 'people-outline', color: '#14B8A6', label: 'Meetup' },
  creator_recommendation: { type: 'creator_recommendation', icon: 'star-outline', color: '#F97316', label: 'Creator Pick' },
  organization: { type: 'organization', icon: 'shield-outline', color: '#6366F1', label: 'Organization' },
};

// ─── Map Region ───────────────────────────────────────────
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

// ─── Explore Marker ───────────────────────────────────────
export interface ExploreMarker {
  id: string;
  type: MarkerType;
  coordinate: LatLng;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  rating: number | null;
  distance: string | null;
  metadata: Record<string, string | number | boolean>;
}

// ─── Feed Items ───────────────────────────────────────────
export type FeedItemType =
  | 'destination'
  | 'place'
  | 'restaurant'
  | 'activity'
  | 'itinerary'
  | 'meetup'
  | 'community'
  | 'creator';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  markerId: string | null; // links to marker for sync
  title: string;
  subtitle: string;
  location: string | null;
  imageUrl: string | null;
  rating: number | null;
  distance: string | null;
  metadata: Record<string, string | number | boolean>;
}

// ─── Compare Mode ─────────────────────────────────────────
export interface CompareItem {
  id: string;
  title: string;
  imageUrl: string | null;
  distance: string;
  budget: string;
  difficulty: string;
  weather: string;
  crowd: string;
  travelTime: string;
}

// ─── Route Preview ────────────────────────────────────────
export interface RoutePreviewData {
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  distanceKm: number;
  durationMin: number;
  trafficLevel: 'low' | 'moderate' | 'heavy';
}

// ─── AI Recommendation ───────────────────────────────────
export interface AIRecommendation {
  id: string;
  message: string;
  markerId: string | null;
  feedItemId: string | null;
  icon: string;
  type: 'time' | 'weather' | 'preference' | 'crowd';
}

// ─── Panel Snap Position ──────────────────────────────────
export type PanelSnap = 'collapsed' | 'half' | 'full';

// ─── Sub-Filter ───────────────────────────────────────────
export interface ExploreSubFilter {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const MODE_SUB_FILTERS: Partial<Record<ExploreMode, ExploreSubFilter[]>> = {
  trekking: [
    { id: 'easy', label: 'Easy', icon: 'leaf-outline', color: '#16A34A' },
    { id: 'moderate', label: 'Moderate', icon: 'trending-up', color: '#F59E0B' },
    { id: 'hard', label: 'Hard', icon: 'flame-outline', color: '#DC2626' },
    { id: 'overnight', label: 'Overnight', icon: 'moon-outline', color: '#7C3AED' },
  ],
  food: [
    { id: 'restaurants', label: 'Restaurants', icon: 'restaurant', color: '#E11D48' },
    { id: 'cafes', label: 'Cafés', icon: 'cafe', color: '#92400E' },
    { id: 'street_food', label: 'Street Food', icon: 'fast-food-outline', color: '#EA580C' },
    { id: 'local', label: 'Local Cuisine', icon: 'heart-outline', color: '#DC2626' },
  ],
  camping: [
    { id: 'tent', label: 'Tent', icon: 'trail-sign-outline', color: '#16A34A' },
    { id: 'glamping', label: 'Glamping', icon: 'home-outline', color: '#7C3AED' },
    { id: 'rv', label: 'RV Friendly', icon: 'bus-outline', color: '#0891B2' },
    { id: 'lakeside', label: 'Lakeside', icon: 'water-outline', color: '#2563EB' },
  ],
  adventure: [
    { id: 'rafting', label: 'Rafting', icon: 'boat-outline', color: '#2563EB' },
    { id: 'paragliding', label: 'Paragliding', icon: 'airplane-outline', color: '#0891B2' },
    { id: 'bungee', label: 'Bungee', icon: 'flash-outline', color: '#DC2626' },
    { id: 'climbing', label: 'Climbing', icon: 'triangle-outline', color: '#92400E' },
  ],
  road_trips: [
    { id: 'scenic', label: 'Scenic', icon: 'image-outline', color: '#16A34A' },
    { id: 'highway', label: 'Highway', icon: 'speedometer-outline', color: '#2563EB' },
    { id: 'offroad', label: 'Off-Road', icon: 'map-outline', color: '#EA580C' },
    { id: 'coastal', label: 'Coastal', icon: 'sunny-outline', color: '#0891B2' },
  ],
};

// ─── Downloaded Region ────────────────────────────────────
export interface DownloadedRegion {
  id: string;
  name: string;
  region: MapRegion;
  sizeBytes: number;
  downloadedAt: number;
}

// ─── Explore Analytics ────────────────────────────────────
export type ExploreAnalyticsEvent =
  | 'explore_opened'
  | 'marker_viewed'
  | 'marker_selected'
  | 'map_panned'
  | 'map_zoomed'
  | 'card_opened'
  | 'nearby_used'
  | 'hidden_gems_used'
  | 'download_region'
  | 'navigation_started'
  | 'ai_recommendation_clicked'
  | 'compare_opened'
  | 'route_previewed'
  | 'mode_switched';

// ─── Marker Quick Actions ─────────────────────────────────
export type MarkerQuickAction = 'save' | 'share' | 'navigate' | 'create_plan' | 'report';

export interface QuickActionConfig {
  key: MarkerQuickAction;
  label: string;
  icon: string;
  color: string;
  destructive?: boolean;
}

export const QUICK_ACTIONS: QuickActionConfig[] = [
  { key: 'save', label: 'Save', icon: 'bookmark-outline', color: '#2563EB' },
  { key: 'share', label: 'Share', icon: 'share-outline', color: '#14B8A6' },
  { key: 'navigate', label: 'Navigate', icon: 'navigate-outline', color: '#16A34A' },
  { key: 'create_plan', label: 'Create Plan Here', icon: 'add-circle-outline', color: '#F97316' },
  { key: 'report', label: 'Report', icon: 'flag-outline', color: '#DC2626', destructive: true },
];
