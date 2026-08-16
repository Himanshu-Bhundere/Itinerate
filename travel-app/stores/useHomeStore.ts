import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { trackHomeEvent } from '../lib/analytics';
import * as Location from 'expo-location';

// ─── Types ────────────────────────────────────────────────
export interface PlanCard {
  id: string;
  title: string;
  image_url: string | null;
  duration_days: number | null;
  visibility: string;
  created_at: string;
  updated_at: string;
  creator_id: string;
  profiles?: { display_name: string | null };
  // Derived
  planned_days?: number;
  total_days?: number;
  progress?: number;
}

export interface FeaturedDestination {
  id: string;
  name: string;
  image_url: string;
  temperature: string;
  bestTime: string;
  budget: string;
}

export interface UpcomingTrip {
  id: string;
  destination: string;
  image_url: string;
  daysUntil: number;
  weather: string;
  packingReminder: string;
  status: string;
}

export interface CommunityPick {
  id: string;
  title: string;
  image_url: string;
  creator: string;
  verified: boolean;
  popularity: number;
  reason: string;
}

export interface NearbyAdventure {
  id: string;
  title: string;
  image_url: string;
  distance: string;
  travelTime: string;
  type: 'trek' | 'stay' | 'meetup' | 'experience';
}

interface HomeState {
  // Data
  plans: PlanCard[];
  draftPlans: PlanCard[];
  trendingPlans: PlanCard[];
  recommendations: PlanCard[];
  nearbyAdventures: NearbyAdventure[];
  communityPicks: CommunityPick[];
  featuredDestination: FeaturedDestination | null;
  upcomingTrip: UpcomingTrip | null;

  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  errorMessage: string;
  isOffline: boolean;
  isFirstTime: boolean;
  showScrollToTop: boolean;
  hasMorePlans: boolean;
  isLoadingMore: boolean;
  savedPlanIds: Set<string>;
  toastMessage: string | null;
  userLocation: string | null;

  // Pagination
  page: number;

  // Actions
  fetchHomeData: (isFirst: boolean) => Promise<void>;
  fetchUserLocation: () => Promise<void>;
  refreshHome: () => Promise<void>;
  loadMorePlans: () => Promise<void>;
  toggleSaved: (planId: string) => void;
  setShowScrollToTop: (show: boolean) => void;
  dismissToast: () => void;
  setOffline: (offline: boolean) => void;
}

// Mock Data completely removed.


const PAGE_SIZE = 10;

export const useHomeStore = create<HomeState>((set, get) => ({
  // Initial state
  plans: [],
  draftPlans: [],
  trendingPlans: [],
  recommendations: [],
  nearbyAdventures: [],
  communityPicks: [],
  featuredDestination: null,
  upcomingTrip: null,
  isLoading: true,
  isRefreshing: false,
  hasError: false,
  errorMessage: '',
  isOffline: false,
  isFirstTime: false,
  showScrollToTop: false,
  hasMorePlans: true,
  isLoadingMore: false,
  savedPlanIds: new Set<string>(),
  toastMessage: null,
  userLocation: null,
  page: 0,

  fetchHomeData: async (isFirst: boolean) => {
    set({ isLoading: true, hasError: false, errorMessage: '' });
    trackHomeEvent('home_opened');

    try {
      // Fetch public plans
      const { data: publicPlans, error: plansError } = await supabase
        .from('plans')
        .select('*, profiles(display_name)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (plansError) throw plansError;

      // Fetch user's draft plans
      const { data: sessionData } = await supabase.auth.getSession();
      let drafts: PlanCard[] = [];
      if (sessionData?.session?.user) {
        const { data: draftData } = await supabase
          .from('plans')
          .select('*, profiles(display_name)')
          .eq('creator_id', sessionData.session.user.id)
          .eq('visibility', 'draft')
          .order('updated_at', { ascending: false })
          .limit(5);
        drafts = (draftData as PlanCard[]) || [];
      }

      const allPlans = (publicPlans as PlanCard[]) || [];

      // Map plans to community picks and nearby adventures
      const mappedCommunity: CommunityPick[] = allPlans.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        image_url: p.image_url || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
        creator: p.profiles?.display_name || 'Traveler',
        verified: false,
        popularity: 100,
        reason: 'Community Member'
      }));

      const mappedNearby: NearbyAdventure[] = allPlans.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        image_url: p.image_url || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop',
        distance: 'Local',
        travelTime: 'Varies',
        type: 'trek'
      }));

      set({
        plans: allPlans,
        draftPlans: drafts,
        trendingPlans: allPlans.slice(0, 5),
        recommendations: allPlans.slice(0, 6),
        nearbyAdventures: mappedNearby,
        communityPicks: mappedCommunity,
        featuredDestination: null,
        upcomingTrip: null,
        isFirstTime: isFirst,
        isLoading: false,
        hasError: false,
        page: 1,
        hasMorePlans: allPlans.length >= PAGE_SIZE,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to load home data';
      set({
        isLoading: false,
        hasError: true,
        errorMessage: msg,
      });
    }
  },

  fetchUserLocation: async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (apiKey) {
        // Use Google Maps API to force English language
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          // Find city (locality) and country
          let city = '';
          let country = '';
          
          const result = data.results[0];
          for (const component of result.address_components) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('country')) {
              country = component.short_name;
            }
          }
          
          // Fallback if locality is not found
          if (!city) {
            for (const component of result.address_components) {
              if (component.types.includes('administrative_area_level_2') || component.types.includes('administrative_area_level_1')) {
                city = component.long_name;
                break;
              }
            }
          }
          
          if (city && country) {
            set({ userLocation: `${city}, ${country}` });
            return;
          } else if (city) {
            set({ userLocation: city });
            return;
          }
        }
      }

      // Fallback to Expo's native reverse geocoding (might be localized based on device settings)
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const city = place.city || place.subregion || place.region;
        const country = place.isoCountryCode || place.country;
        if (city && country) {
          set({ userLocation: `${city}, ${country}` });
        } else if (city) {
          set({ userLocation: city });
        }
      }
    } catch (error) {
      console.warn('Failed to fetch user location:', error);
    }
  },

  refreshHome: async () => {
    set({ isRefreshing: true });
    trackHomeEvent('refresh_triggered');

    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*, profiles(display_name)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (error) throw error;

      const allPlans = (data as PlanCard[]) || [];

      set({
        plans: allPlans,
        trendingPlans: allPlans.slice(0, 5),
        recommendations: allPlans.slice(0, 6),
        isRefreshing: false,
        page: 1,
        hasMorePlans: allPlans.length >= PAGE_SIZE,
        toastMessage: 'Updated successfully',
      });

      // Auto-dismiss toast
      setTimeout(() => set({ toastMessage: null }), 3000);
    } catch {
      set({ isRefreshing: false, toastMessage: 'Failed to refresh' });
      setTimeout(() => set({ toastMessage: null }), 3000);
    }
  },

  loadMorePlans: async () => {
    const { isLoadingMore, hasMorePlans, page, plans } = get();
    if (isLoadingMore || !hasMorePlans) return;

    set({ isLoadingMore: true });

    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*, profiles(display_name)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) throw error;

      const newPlans = (data as PlanCard[]) || [];

      set({
        plans: [...plans, ...newPlans],
        page: page + 1,
        hasMorePlans: newPlans.length >= PAGE_SIZE,
        isLoadingMore: false,
      });

      trackHomeEvent('scroll_depth', { page: page + 1 });
    } catch {
      set({ isLoadingMore: false });
    }
  },

  toggleSaved: (planId: string) => {
    const { savedPlanIds } = get();
    const newSet = new Set(savedPlanIds);
    if (newSet.has(planId)) {
      newSet.delete(planId);
      set({ savedPlanIds: newSet, toastMessage: 'Removed from saved' });
    } else {
      newSet.add(planId);
      trackHomeEvent('plan_saved', { plan_id: planId });
      set({ savedPlanIds: newSet, toastMessage: 'Saved! View in your collection' });
    }
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  setShowScrollToTop: (show: boolean) => set({ showScrollToTop: show }),
  dismissToast: () => set({ toastMessage: null }),
  setOffline: (offline: boolean) => set({ isOffline: offline }),
}));
