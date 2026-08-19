import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { 
  UserRole, 
  WorkspaceState, 
  TripLifecycle, 
  ModuleId, 
  TravelPlanMetadata 
} from '../constants/travelPlanTypes';

interface TravelPlanState {
  // Data
  planData: TravelPlanMetadata | null;
  isSaved: boolean;
  
  // Workspace State
  activeModule: ModuleId;
  userRole: UserRole;
  isOffline: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveModule: (module: ModuleId) => void;
  setUserRole: (role: UserRole) => void;
  setOfflineMode: (isOffline: boolean) => void;
  
  // Data Fetching
  fetchPlan: (id: string, userId?: string) => Promise<void>;
  toggleSave: (id: string, userId: string) => Promise<void>;
}

export const useTravelPlanStore = create<TravelPlanState>((set, get) => ({
  planData: null,
  isSaved: false,
  
  activeModule: 'overview', // Default as per requirements
  userRole: 'traveler', // Default
  isOffline: false,
  isLoading: true,
  error: null,

  setActiveModule: (module) => set({ activeModule: module }),
  setUserRole: (role) => set({ userRole: role }),
  setOfflineMode: (isOffline) => set({ isOffline }),

  fetchPlan: async (id: string, userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*, profiles(display_name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Map DB data to our metadata format, providing safe defaults for new properties
      const mappedData: TravelPlanMetadata = {
        ...data,
        workspaceState: 'published', // Defaulting for now
        tripLifecycle: 'upcoming',   // Defaulting for now
        isVerified: true,            // Mock for now
      };

      set({ planData: mappedData });

      // Check save status if userId is provided
      if (userId) {
        const { data: savedData } = await supabase
          .from('saved_plans')
          .select('id')
          .eq('plan_id', id)
          .eq('user_id', userId)
          .single();
        
        set({ isSaved: !!savedData });
      }

    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch plan' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleSave: async (id: string, userId: string) => {
    const { isSaved } = get();
    try {
      if (isSaved) {
        await supabase
          .from('saved_plans')
          .delete()
          .eq('plan_id', id)
          .eq('user_id', userId);
        set({ isSaved: false });
      } else {
        await supabase
          .from('saved_plans')
          .insert({ plan_id: id, user_id: userId });
        set({ isSaved: true });
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  }
}));
