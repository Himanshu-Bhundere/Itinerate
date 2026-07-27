import React from 'react';
import { View, StyleSheet } from 'react-native';
import DestinationAIBanner from './DestinationAIBanner';
import DestinationQuickFacts from './DestinationQuickFacts';
import SuggestedItinerariesList from './SuggestedItinerariesList';
import DestinationPlacesList from './DestinationPlacesList';
import SeasonalGuide from './SeasonalGuide';
import BudgetPlanner from './BudgetPlanner';
import CategorizedGuides from './CategorizedGuides';
import { DestinationMetadata, SuggestedItinerary } from '../../constants/destinationTypes';
import { Spacing } from '../../constants/tokens';

interface DestinationModulesProps {
  metadata: DestinationMetadata;
  itineraries: SuggestedItinerary[];
  places: any[];
  budgetTiers: any[];
  seasonalData: any[];
}

export default function DestinationModules({
  metadata,
  itineraries,
  places,
  budgetTiers,
  seasonalData
}: DestinationModulesProps) {
  return (
    <View style={styles.container}>
      <DestinationAIBanner 
        type="suggestion"
        message={`${metadata.name} is very popular this time of year. We recommend booking temples early.`}
      />

      <DestinationQuickFacts metadata={metadata} />
      
      <SuggestedItinerariesList 
        itineraries={itineraries}
        onPressItinerary={() => {}}
        onSaveItinerary={() => {}}
      />

      <DestinationPlacesList 
        title="Popular Attractions"
        places={places}
        onPressPlace={() => {}}
      />

      <DestinationAIBanner 
        type="weather"
        message="Rain expected tomorrow afternoon. Pack an umbrella."
      />

      <SeasonalGuide seasonalData={seasonalData} />
      
      <BudgetPlanner budgetTiers={budgetTiers} />
      
      <CategorizedGuides 
        onPressCategory={() => {}} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
});
