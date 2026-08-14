import { create } from 'zustand';
import {
  DestinationHeroState,
  DestinationSection,
  DestinationEdgeState,
  DestinationSheet,
  DestinationMetadata,
  SuggestedItinerary,
  BudgetTier,
  SeasonalInfo,
} from '../constants/destinationTypes';

interface DestinationState {
  // Destination Identity
  destinationId: string | null;
  metadata: DestinationMetadata | null;
  
  // View States
  heroState: DestinationHeroState;
  activeSection: DestinationSection;
  edgeState: DestinationEdgeState;
  activeSheet: DestinationSheet;
  
  // Data
  itineraries: SuggestedItinerary[];
  budgetTiers: BudgetTier[];
  seasonalInfo: SeasonalInfo[];
  
  // Actions
  setDestination: (id: string, meta: DestinationMetadata) => void;
  setHeroState: (state: DestinationHeroState) => void;
  setActiveSection: (section: DestinationSection) => void;
  setEdgeState: (state: DestinationEdgeState) => void;
  setActiveSheet: (sheet: DestinationSheet) => void;
  
  // Data actions
  setItineraries: (itineraries: SuggestedItinerary[]) => void;
  setBudgetTiers: (tiers: BudgetTier[]) => void;
  setSeasonalInfo: (info: SeasonalInfo[]) => void;
  
  // Toggles
  toggleSave: () => void;
  toggleDownload: () => void;
}

export const useDestinationStore = create<DestinationState>((set) => ({
  destinationId: null,
  metadata: null,
  
  heroState: 'expanded',
  activeSection: 'overview',
  edgeState: 'idle',
  activeSheet: 'none',
  
  itineraries: [],
  budgetTiers: [],
  seasonalInfo: [],
  
  setDestination: (id, meta) => set({ destinationId: id, metadata: meta }),
  setHeroState: (state) => set({ heroState: state }),
  setActiveSection: (section) => set({ activeSection: section }),
  setEdgeState: (state) => set({ edgeState: state }),
  setActiveSheet: (sheet) => set({ activeSheet: sheet }),
  
  setItineraries: (itineraries) => set({ itineraries }),
  setBudgetTiers: (tiers) => set({ budgetTiers: tiers }),
  setSeasonalInfo: (info) => set({ seasonalInfo: info }),
  
  toggleSave: () => set((state) => ({
    metadata: state.metadata
      ? { ...state.metadata, isSaved: !state.metadata.isSaved }
      : null
  })),
  toggleDownload: () => set((state) => ({
    metadata: state.metadata
      ? { ...state.metadata, isDownloaded: !state.metadata.isDownloaded }
      : null
  })),
}));
