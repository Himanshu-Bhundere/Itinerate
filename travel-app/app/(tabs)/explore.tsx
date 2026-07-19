import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { useExploreStore } from '../../stores/useExploreStore';
import { trackExploreEvent } from '../../lib/analytics';
import type {
  FeedItem,
  ExploreMarker,
  MarkerQuickAction,
  AIRecommendation,
} from '../../constants/exploreTypes';
import { EXPLORE_MODES } from '../../constants/exploreTypes';

// Components
import ExploreModePills from '../../components/explore/ExploreModePills';
import ExploreFilterChips from '../../components/explore/ExploreFilterChips';
import ExploreBottomPanel from '../../components/explore/ExploreBottomPanel';
import DestinationCard from '../../components/explore/DestinationCard';
import PlaceCard from '../../components/explore/PlaceCard';
import MeetupCard from '../../components/explore/MeetupCard';
import ActivityCard from '../../components/explore/ActivityCard';
import MapMarkerCustom from '../../components/explore/MapMarkerCustom';
import MapControls from '../../components/explore/MapControls';
import MarkerQuickActions from '../../components/explore/MarkerQuickActions';
import ComparePlacesSheet from '../../components/explore/ComparePlacesSheet';
import RoutePreviewOverlay from '../../components/explore/RoutePreviewOverlay';
import AIRecommendationBanner from '../../components/explore/AIRecommendationBanner';
import ExploreLoadingSkeleton from '../../components/explore/ExploreLoadingSkeleton';
import ExplorePermissionRequest from '../../components/explore/ExplorePermissionRequest';
import ExploreEmptyState from '../../components/explore/ExploreEmptyState';
import ExploreErrorState from '../../components/explore/ExploreErrorState';
import ExploreOfflineBanner from '../../components/explore/ExploreOfflineBanner';
import ExploreTutorial from '../../components/explore/ExploreTutorial';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // Store
  const store = useExploreStore();
  const {
    region,
    userLocation,
    locationPermission,
    compassHeading,
    activeMode,
    activeSubFilters,
    panelSnap,
    markers,
    feedItems,
    selectedMarkerId,
    highlightedMarkerId,
    isLoading,
    hasError,
    errorMessage,
    isInitialized,
    compareMode,
    compareItems,
    routePreview,
    aiSuggestions,
    isOffline,
    showTutorial,
    quickActionMarkerId,
  } = store;

  // ─── Location Permission ───────────────────────────────
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      store.setLocationPermission(status === 'granted' ? 'granted' : 'denied');

      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        store.setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch {
      store.setLocationPermission('denied');
    }
  }, []);

  // ─── Initial Data Load ─────────────────────────────────
  useEffect(() => {
    if (locationPermission !== 'undetermined') {
      store.loadExploreData();
      store.loadAISuggestions();
    }
  }, [locationPermission]);

  // ─── Map Region Change ─────────────────────────────────
  const regionChangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRegionChange = useCallback((newRegion: Region) => {
    store.setRegion(newRegion);

    // Debounce reload: 500ms after pan stops
    if (regionChangeTimer.current) clearTimeout(regionChangeTimer.current);
    regionChangeTimer.current = setTimeout(() => {
      store.loadExploreData();
      trackExploreEvent('map_panned');
    }, 500);
  }, []);

  // ─── Feed ↔ Map Sync ──────────────────────────────────
  const handleMarkerPress = useCallback((marker: ExploreMarker) => {
    store.selectMarker(marker.id);
    // Scroll feed to matching card handled by selectedMarkerId
  }, []);

  const handleMarkerLongPress = useCallback((marker: ExploreMarker) => {
    store.showQuickActions(marker.id);
  }, []);

  const handleFeedCardPress = useCallback((item: FeedItem) => {
    if (item.markerId) {
      store.selectMarker(item.markerId);
      // Pan map to marker
      const marker = markers.find(m => m.id === item.markerId);
      if (marker && mapRef.current) {
        mapRef.current.animateToRegion({
          ...region,
          latitude: marker.coordinate.latitude,
          longitude: marker.coordinate.longitude,
        }, 800);
      }
    }
    trackExploreEvent('card_opened', { itemId: item.id });
  }, [markers, region]);

  const handleFeedCardScroll = useCallback((visibleMarkerId: string | null) => {
    store.highlightMarker(visibleMarkerId);
  }, []);

  // ─── Quick Actions ─────────────────────────────────────
  const selectedQuickMarker = useMemo(
    () => markers.find(m => m.id === quickActionMarkerId),
    [markers, quickActionMarkerId],
  );

  const handleQuickAction = useCallback((action: MarkerQuickAction) => {
    if (!quickActionMarkerId) return;
    switch (action) {
      case 'navigate':
        if (selectedQuickMarker) {
          const { latitude, longitude } = selectedQuickMarker.coordinate;
          const url = Platform.select({
            ios: `maps:0,0?q=${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
          });
          if (url) Linking.openURL(url);
          trackExploreEvent('navigation_started');
        }
        break;
      case 'save':
        Alert.alert('Saved', 'Place saved to your collection.');
        break;
      case 'share':
        Alert.alert('Share', 'Sharing functionality coming soon.');
        break;
      case 'create_plan':
        router.push('/create');
        break;
      case 'report':
        Alert.alert('Reported', 'Thank you for your feedback.');
        break;
    }
  }, [quickActionMarkerId, selectedQuickMarker, router]);

  // ─── AI Recommendation ─────────────────────────────────
  const handleAIPress = useCallback((suggestion: AIRecommendation) => {
    trackExploreEvent('ai_recommendation_clicked', { id: suggestion.id });
    if (suggestion.markerId) {
      store.selectMarker(suggestion.markerId);
    }
  }, []);

  // ─── Recenter ──────────────────────────────────────────
  const handleRecenter = useCallback(() => {
    store.recenterMap();
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }, 800);
    }
  }, [userLocation, region]);

  // ─── Render Helpers ────────────────────────────────────
  const activeModeName = useMemo(
    () => EXPLORE_MODES.find(m => m.key === activeMode)?.label ?? 'Nearby',
    [activeMode],
  );

  // Destination cards (horizontal)
  const destinationItems = useMemo(
    () => feedItems.filter(i => i.type === 'destination' || i.type === 'itinerary'),
    [feedItems],
  );

  // Place cards
  const placeItems = useMemo(
    () => feedItems.filter(i => i.type === 'place' || i.type === 'restaurant'),
    [feedItems],
  );

  // Activity cards
  const activityItems = useMemo(
    () => feedItems.filter(i => i.type === 'activity'),
    [feedItems],
  );

  // Meetup cards
  const meetupItems = useMemo(
    () => feedItems.filter(i => i.type === 'meetup'),
    [feedItems],
  );

  // ─── Render ────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── Persistent Map ─────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill as object}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={locationPermission === 'granted'}
        showsMyLocationButton={false}
        showsCompass={false}
        mapPadding={{ top: insets.top + 120, bottom: SCREEN_HEIGHT * 0.35, left: 0, right: 0 }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
            onCalloutPress={() => handleMarkerPress(marker)}
            tracksViewChanges={false}
          >
            <MapMarkerCustom
              type={marker.type}
              isSelected={selectedMarkerId === marker.id}
              isHighlighted={highlightedMarkerId === marker.id}
            />
          </Marker>
        ))}
      </MapView>

      {/* ── Route Preview ─────────────────────────────── */}
      {routePreview && (
        <RoutePreviewOverlay
          route={routePreview}
          onOpenExternal={() => {
            const { latitude, longitude } = routePreview.destination;
            const url = Platform.select({
              ios: `maps:0,0?q=${latitude},${longitude}`,
              android: `geo:${latitude},${longitude}`,
            });
            if (url) Linking.openURL(url);
          }}
          onClose={() => store.setRoutePreview(null)}
        />
      )}

      {/* ── Top Search Bar ────────────────────────────── */}
      <View style={[styles.searchContainer, { top: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/search')}
          activeOpacity={0.8}
          accessibilityRole="search"
          accessibilityLabel="Search places"
        >
          <Ionicons name="search-outline" size={18} color={Colors.secondaryText} />
          <Text style={styles.searchPlaceholder}>Search places, activities...</Text>
        </TouchableOpacity>
      </View>



      {/* ── Bottom Panel ──────────────────────────────── */}
      <ExploreBottomPanel
        snap={panelSnap}
        onSnapChange={store.setPanelSnap}
        feedCount={feedItems.length}
        mapControls={
          panelSnap !== 'full' ? (
            <MapControls
              onLayersPress={() => {}}
              onRecenterPress={handleRecenter}
              onCompassPress={handleRecenter}
              compassHeading={compassHeading}
            />
          ) : null
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.feedContent}
        >
          {/* Mode Pills */}
          <ExploreModePills
            activeMode={activeMode}
            onModeChange={store.setActiveMode}
          />

          {/* Sub-Filter Chips */}
          <ExploreFilterChips
            activeMode={activeMode}
            activeFilters={activeSubFilters}
            onToggle={store.toggleSubFilter}
          />

          {/* Offline Banner */}
          {isOffline && <ExploreOfflineBanner onRetry={store.refreshData} />}

          {/* Loading Skeleton */}
          {isLoading && !isInitialized && <ExploreLoadingSkeleton />}

          {/* Permission Request */}
          {!isLoading && locationPermission === 'denied' && !isInitialized && (
            <ExplorePermissionRequest
              onAllow={requestLocation}
              onSkip={() => store.loadExploreData()}
            />
          )}

          {/* Error State */}
          {hasError && feedItems.length === 0 && (
            <ExploreErrorState
              message={errorMessage}
              onRetry={store.refreshData}
            />
          )}





          {/* Destinations */}
          {destinationItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Destinations</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {destinationItems.map((item) => (
                  <DestinationCard
                    key={item.id}
                    item={item}
                    onPress={handleFeedCardPress}
                    isHighlighted={
                      item.markerId === selectedMarkerId ||
                      item.markerId === highlightedMarkerId
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Places */}
          {placeItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Places</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {placeItems.map((item) => (
                  <PlaceCard
                    key={item.id}
                    item={item}
                    onPress={handleFeedCardPress}
                    isHighlighted={
                      item.markerId === selectedMarkerId ||
                      item.markerId === highlightedMarkerId
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Activities */}
          {activityItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activities</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {activityItems.map((item) => (
                  <ActivityCard
                    key={item.id}
                    item={item}
                    onPress={handleFeedCardPress}
                    isHighlighted={
                      item.markerId === selectedMarkerId ||
                      item.markerId === highlightedMarkerId
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Meetups */}
          {meetupItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meetups Nearby</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {meetupItems.map((item) => (
                  <MeetupCard
                    key={item.id}
                    item={item}
                    onPress={handleFeedCardPress}
                    isHighlighted={
                      item.markerId === selectedMarkerId ||
                      item.markerId === highlightedMarkerId
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && isInitialized && feedItems.length === 0 && !hasError && (
            <ExploreEmptyState
              mode={activeModeName}
              onAdjust={store.clearSubFilters}
            />
          )}
        </ScrollView>
      </ExploreBottomPanel>

      {/* ── Marker Quick Actions ──────────────────────── */}
      <MarkerQuickActions
        visible={quickActionMarkerId !== null}
        markerTitle={selectedQuickMarker?.title ?? ''}
        onAction={handleQuickAction}
        onClose={store.hideQuickActions}
      />



      {/* ── Tutorial ──────────────────────────────────── */}
      <ExploreTutorial
        visible={showTutorial}
        onDismiss={store.dismissTutorial}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  searchContainer: {
    position: 'absolute',
    left: Spacing.l,
    right: Spacing.l,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    height: 48,
    borderRadius: Radius.circular,
    ...Shadows.card,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.placeholder,
  },
  destinationDrawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9,
  },
  compareBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  compareBtnActive: {
    backgroundColor: Colors.blue500,
  },
  feedContent: {
    paddingBottom: Spacing['3xl'],
  },
  section: {
    marginTop: Spacing.l,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.s,
  },
  horizontalScroll: {
    paddingHorizontal: Spacing.l,
  },
});
