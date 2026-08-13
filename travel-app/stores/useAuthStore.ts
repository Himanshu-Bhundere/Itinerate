import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  display_name?: string;
  username?: string;
  home_city?: string;
  is_verified?: boolean;
  bio?: string;
  cover_url?: string;
  avatar_url?: string;
  saves_count?: number;
  rating?: number;
  travel_style?: string;
  top_destinations?: string;
  travel_level?: string;
  country?: string;
  languages?: string[];
  interests?: string[];
  followers_count?: number;
  following_count?: number;
  reviews_count?: number;
  countries_visited?: number;
  cities_visited?: number;
  trips_completed?: number;
  distance_travelled?: number;
  days_travelled?: number;
  treks_completed?: number;
  highest_elevation?: number;
  longest_trip?: number;
}

interface AuthState {
  // Session
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isInitialized: boolean;

  // Onboarding & flow progress
  hasCompletedOnboarding: boolean;
  hasCompletedProfile: boolean;
  hasGrantedPermissions: boolean;
  hasAcceptedConsent: boolean;
  onboardingStep: number;
  authMethod: 'email' | null;

  // Actions
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setInitialized: (val: boolean) => void;
  setOnboardingComplete: () => void;
  setProfileComplete: () => void;
  setPermissionsComplete: () => void;
  setConsentComplete: () => void;
  setOnboardingStep: (step: number) => void;
  setAuthMethod: (method: 'email' | null) => void;
  reset: () => void;
}

const initialState = {
  session: null,
  user: null,
  profile: null,
  isInitialized: false,
  hasCompletedOnboarding: false,
  hasCompletedProfile: false,
  hasGrantedPermissions: false,
  hasAcceptedConsent: false,
  onboardingStep: 0,
  authMethod: null as 'email' | null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setSession: (session) =>
    set({ session, user: session?.user || null }),

  setProfile: (profile) => set({ profile }),

  setInitialized: (val) =>
    set({ isInitialized: val }),

  setOnboardingComplete: () =>
    set({ hasCompletedOnboarding: true }),

  setProfileComplete: () =>
    set({ hasCompletedProfile: true }),

  setPermissionsComplete: () =>
    set({ hasGrantedPermissions: true }),

  setConsentComplete: () =>
    set({ hasAcceptedConsent: true }),

  setOnboardingStep: (step) =>
    set({ onboardingStep: step }),

  setAuthMethod: (method) =>
    set({ authMethod: method }),

  reset: () => set(initialState),
}));
