export type DestinationHeroState = 'expanded' | 'collapsed';

export type DestinationSection =
  | 'overview' // 02
  | 'weather' // 05, 28
  | 'quick_facts' // 06
  | 'itineraries' // 07
  | 'places_popular' // 08
  | 'places_hidden' // 09
  | 'places_nearby' // 10
  | 'seasonal' // 11, 12
  | 'budget' // 13
  | 'food' // 14
  | 'stay' // 15
  | 'transport' // 16
  | 'activities_general' // 17
  | 'activities_trekking' // 18
  | 'activities_adventure' // 19
  | 'activities_family' // 20
  | 'trips_weekend' // 21
  | 'trips_multiday' // 22
  | 'events' // 23
  | 'community' // 24
  | 'ai_suggestions' // 25, 27
  | 'timeline'; // 26

export type DestinationEdgeState =
  | 'idle'
  | 'loading' // 01
  | 'error' // 35
  | 'slow_network' // 36
  | 'maintenance' // 37
  | 'offline'; // 31

export type DestinationSheet =
  | 'none'
  | 'download_region' // 30
  | 'share_destination' // 32
  | 'route_preview' // 33
  | 'compare_destinations'; // 34

export interface SuggestedItinerary {
  id: string;
  title: string;
  durationDays: number;
  estimatedCost: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  creatorName: string;
  creatorAvatar?: string;
  imageUrl: string;
  category: 'recommended' | 'popular' | 'weekend' | 'budget' | 'luxury' | 'adventure' | 'family' | 'solo' | 'road_trip';
}

export interface BudgetTier {
  id: 'budget' | 'comfort' | 'premium' | 'luxury';
  label: string;
  accommodationCost: number;
  foodCost: number;
  transportCost: number;
  activitiesCost: number;
  totalCost: number;
}

export interface SeasonalInfo {
  season: 'summer' | 'monsoon' | 'winter' | 'autumn' | 'spring';
  advantages: string[];
  disadvantages: string[];
  recommendedActivities: string[];
  packingTips: string[];
}

export interface DestinationMetadata {
  id: string;
  name: string;
  country: string;
  rating: number;
  heroImageUrl: string;
  currentTemperature: number;
  weatherCondition: string;
  recommendedDuration: string;
  averageBudget: number;
  bestSeason: string;
  difficulty: string;
  safetyIndex: string;
  isSaved: boolean; // 29
  isDownloaded: boolean;
}

// Analytics Events
export type DestinationAnalyticsEvent =
  | 'destination_viewed'
  | 'destination_saved'
  | 'destination_shared'
  | 'destination_downloaded'
  | 'itinerary_opened'
  | 'activity_viewed'
  | 'budget_viewed'
  | 'weather_viewed'
  | 'ai_recommendation_clicked'
  | 'compare_used';
