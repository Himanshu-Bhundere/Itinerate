import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTravelPlanStore } from '../../stores/useTravelPlanStore';
import { Colors } from '../../constants/tokens';
import { ModuleId } from '../../constants/travelPlanTypes';

// UI Shell Components
import TravelPlanHero from '../../components/travel-plan/TravelPlanHero';
import TripStatusBanner from '../../components/travel-plan/TripStatusBanner';
import SmartSummaryCard from '../../components/travel-plan/SmartSummaryCard';
import ModuleNavigation from '../../components/travel-plan/ModuleNavigation';
import StickyActionArea from '../../components/travel-plan/StickyActionArea';
import FloatingAIAssistant from '../../components/travel-plan/FloatingAIAssistant';

// Modules
import OverviewModule from '../../components/travel-plan/modules/OverviewModule';
import TimelineModule from '../../components/travel-plan/modules/TimelineModule';

export default function TravelPlanWorkspace() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Store connections
  const { 
    fetchPlan, 
    planData: metadata, 
    isLoading, 
    error,
    userRole,
    activeModule,
    setActiveModule,
  } = useTravelPlanStore();

  useEffect(() => {
    if (id) {
      fetchPlan(id as string);
    }
  }, [id, fetchPlan]);

  if (isLoading || !metadata) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue600} />
      </View>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewModule metadata={metadata} />;
      case 'timeline':
        return <TimelineModule />;
      // other modules fall back to a placeholder for now
      default:
        return (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator color={Colors.placeholder} />
          </View>
        );
    }
  };

  const handleAction = (action: string) => {
    console.log('Action triggered:', action);
    // Handle different actions based on userRole
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <TravelPlanHero 
          metadata={metadata}
          scrollY={scrollY}
          userRole={userRole}
          onBack={() => router.back()}
          onShare={() => console.log('Share')}
          onMore={() => console.log('More options')}
        />
        
        <View style={styles.contentSheet}>
          <TripStatusBanner status={metadata.tripLifecycle} />
          <SmartSummaryCard metadata={metadata} />
          <ModuleNavigation 
            activeModule={activeModule}
            onSelectModule={setActiveModule}
          />
          
          <View style={styles.moduleContainer}>
            {renderActiveModule()}
          </View>
        </View>
      </Animated.ScrollView>

      <StickyActionArea 
        userRole={userRole} 
        onAction={handleAction} 
      />
      
      <FloatingAIAssistant 
        onPress={() => console.log('Open AI Assistant')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  contentSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    minHeight: 500,
    overflow: 'hidden',
  },
  moduleContainer: {
    paddingBottom: 24,
  }
});
