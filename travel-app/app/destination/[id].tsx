import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '../../constants/tokens';
import { useDestinationStore } from '../../stores/useDestinationStore';
import { DestinationMetadata } from '../../constants/destinationTypes';

import DestinationHero from '../../components/destination/DestinationHero';
import DestinationModules from '../../components/destination/DestinationModules';
import DownloadRegionSheet from '../../components/destination/DownloadRegionSheet';
import DestinationEdgeStates from '../../components/destination/DestinationEdgeStates';

// Mock Data for Orchestrator
const MOCK_METADATA: DestinationMetadata = {
  id: 'dest_01',
  name: 'Kyoto',
  country: 'Japan',
  rating: 4.8,
  heroImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
  currentTemperature: 22,
  weatherCondition: 'Sunny',
  recommendedDuration: '4-5 Days',
  averageBudget: 120,
  bestSeason: 'Spring (Cherry Blossoms)',
  difficulty: 'Easy',
  safetyIndex: 'High',
  isSaved: false,
  isDownloaded: false,
};

const MOCK_ITINERARIES = [
  {
    id: 'it_01',
    title: 'The Essential Kyoto in 3 Days',
    durationDays: 3,
    estimatedCost: 350,
    difficulty: 'easy' as const,
    creatorName: 'TravelEditor',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=400&auto=format&fit=crop',
    category: 'recommended' as const,
  },
  {
    id: 'it_02',
    title: 'Kyoto on a Shoestring',
    durationDays: 5,
    estimatedCost: 200,
    difficulty: 'moderate' as const,
    creatorName: 'BudgetBackpacker',
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=400&auto=format&fit=crop',
    category: 'budget' as const,
  }
];

const MOCK_PLACES = [
  {
    id: 'pl_01',
    title: 'Fushimi Inari Taisha',
    subtitle: 'Famous Shinto shrine',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    distance: '2 km',
  },
  {
    id: 'pl_02',
    title: 'Kinkaku-ji',
    subtitle: 'Golden Pavilion',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1590559899731-edc2c31dc91f?q=80&w=200&auto=format&fit=crop',
    rating: 4.8,
    distance: '5 km',
  }
];

const MOCK_BUDGET = [
  {
    id: 'comfort' as const,
    label: 'Comfort',
    accommodationCost: 80,
    foodCost: 40,
    transportCost: 15,
    activitiesCost: 25,
    totalCost: 160,
  }
];

const MOCK_SEASONAL = [
  {
    season: 'spring' as const,
    advantages: ['Cherry blossoms', 'Mild weather', 'Festivals'],
    disadvantages: ['Very crowded', 'Higher prices'],
    recommendedActivities: ['Hanami', 'Temple visits', 'Photography'],
    packingTips: ['Light jacket', 'Comfortable walking shoes', 'Camera'],
  }
];

export default function DestinationWorkspace() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const { 
    metadata, 
    edgeState, 
    activeSheet, 
    setDestination,
    setItineraries,
    setBudgetTiers,
    setSeasonalInfo,
    setEdgeState,
    toggleSave,
    toggleDownload,
    setActiveSheet
  } = useDestinationStore();

  useEffect(() => {
    // Simulate Data Fetching
    setEdgeState('loading');
    
    setTimeout(() => {
      setDestination(id || 'default', MOCK_METADATA);
      setItineraries(MOCK_ITINERARIES);
      setBudgetTiers(MOCK_BUDGET);
      setSeasonalInfo(MOCK_SEASONAL);
      setEdgeState('idle');
    }, 800);
  }, [id]);

  if (!metadata || edgeState === 'loading' || edgeState === 'error' || edgeState === 'maintenance') {
    return (
      <DestinationEdgeStates 
        state={edgeState} 
        onGoBack={() => router.back()}
        onRetry={() => setEdgeState('idle')} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <DestinationHero 
        metadata={metadata}
        scrollY={scrollY}
        onBack={() => router.back()}
        onSave={toggleSave}
        onShare={() => {}}
        onDownload={() => setActiveSheet('download_region')}
        onSearch={() => router.push('/search')}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <DestinationModules 
          metadata={metadata}
          itineraries={MOCK_ITINERARIES}
          places={MOCK_PLACES as any}
          budgetTiers={MOCK_BUDGET}
          seasonalData={MOCK_SEASONAL}
        />

        {/* Bottom padding for scrolling past last item */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Sheets */}
      {activeSheet === 'download_region' && (
        <DownloadRegionSheet 
          metadata={metadata}
          onClose={() => setActiveSheet('none')}
          onDownloadComplete={() => {
            toggleDownload();
            setActiveSheet('none');
          }}
        />
      )}

      {/* Non-blocking Edge States (Offline / Slow network) */}
      {(edgeState === 'offline' || edgeState === 'slow_network') && (
        <DestinationEdgeStates state={edgeState} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingTop: 360, // HERO_MAX_HEIGHT + Spacing
    paddingBottom: Spacing['5xl'],
  },
});
