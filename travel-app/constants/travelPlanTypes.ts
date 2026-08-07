export type UserRole = 'traveler' | 'creator' | 'organizer' | 'collaborator' | 'viewer';
export type WorkspaceState = 'generate' | 'loading' | 'draft' | 'published' | 'archived' | 'offline' | 'private' | 'public' | 'collaborative' | 'read_only' | 'booking_open' | 'booking_closed' | 'trip_ongoing' | 'trip_completed' | 'cancelled' | 'deleted';
export type TripLifecycle = 'upcoming' | 'starts_tomorrow' | 'starts_today' | 'live_now' | 'completed' | 'cancelled' | 'archived';
export type ModuleId = 'overview' | 'timeline' | 'route' | 'places' | 'activities' | 'budget' | 'packing' | 'documents' | 'travelers' | 'media' | 'ai' | 'discussion' | 'versions' | 'analytics' | 'settings';

export interface TravelPlanMetadata {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  duration_days?: number;
  budget_level?: string;
  best_season?: string;
  difficulty?: string;
  location?: string;
  profiles?: {
    display_name: string;
    avatar_url: string;
  };
  // Workspace specific
  workspaceState: WorkspaceState;
  tripLifecycle: TripLifecycle;
  startDate?: string;
  endDate?: string;
  totalDistance?: string;
  elevation?: string;
  weatherOverview?: string;
  isVerified?: boolean;
}
