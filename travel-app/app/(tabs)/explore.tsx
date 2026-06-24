import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ImageBackground, Animated, PanResponder, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { supabase } from '../../lib/supabase';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

// Sheet snap positions (from top of screen)
const SHEET_MIN = SCREEN_HEIGHT * 0.75; // State 1: 25% height map focused
const SHEET_MID = SCREEN_HEIGHT * 0.45; // State 2: 55% height split view
const SHEET_MAX = SCREEN_HEIGHT * 0.10; // State 3: 90% height results view

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [sheetMode, setSheetMode] = useState<'min' | 'mid' | 'max'>('mid');

  // Animated value for sheet position
  const sheetY = useRef(new Animated.Value(SHEET_MID)).current;

  React.useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .limit(5);
    if (data) setPlans(data);
  }

  // Pan responder for swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentPos = sheetMode === 'min' ? SHEET_MIN : sheetMode === 'max' ? SHEET_MAX : SHEET_MID;
        const newVal = Math.max(SHEET_MAX, Math.min(SHEET_MIN, currentPos + gestureState.dy));
        sheetY.setValue(newVal);
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = SCREEN_HEIGHT * 0.15; // 15% tolerance
        const isFlickUp = gestureState.vy < -0.5;
        const isFlickDown = gestureState.vy > 0.5;
        
        let newMode = sheetMode;

        if (gestureState.dy < -threshold || isFlickUp) {
          // Swiped up: step exactly one mode
          if (sheetMode === 'min') newMode = 'mid';
          else if (sheetMode === 'mid') newMode = 'max';
        } else if (gestureState.dy > threshold || isFlickDown) {
          // Swiped down: step exactly one mode
          if (sheetMode === 'max') newMode = 'mid';
          else if (sheetMode === 'mid') newMode = 'min';
        }

        const snapTo = newMode === 'min' ? SHEET_MIN : newMode === 'max' ? SHEET_MAX : SHEET_MID;
        
        setSheetMode(newMode);
        Animated.spring(sheetY, {
          toValue: snapTo,
          useNativeDriver: false,
          tension: 60,
          friction: 10,
        }).start();
      },
    })
  ).current;



  const searchPlaceholder = sheetMode === 'min' ? 'Search this area' : 'Search places, plans, treks, activities...';

  const topPills = [
    { id: '1', title: 'Nearby', icon: 'location', active: true, color: '#8b5cf6' },
    { id: '2', title: 'Places', icon: 'person-outline', active: false },
    { id: '3', title: 'Plans', icon: 'map-outline', active: false },
    { id: '4', title: 'Meetups', icon: 'people-outline', active: false },
    { id: '5', title: 'Events', icon: 'calendar-outline', active: false },
  ];

  const subFilters = [
    { id: '1', title: 'Trekking', icon: 'walk', color: '#10b981' },
    { id: '2', title: 'Food', icon: 'restaurant', color: '#f97316' },
    { id: '3', title: 'Hostels', icon: 'bed', color: '#8b5cf6' },
    { id: '4', title: 'Cafes', icon: 'cafe', color: '#a8a29e' },
    { id: '5', title: 'Photography', icon: 'camera', color: '#0ea5e9' },
    { id: '6', title: 'Road Trips', icon: 'car', color: '#ef4444' },
  ];

  const NearbyPlanCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={st.planCard} onPress={() => router.push(`/plans/${item.id}`)}>
      <ImageBackground source={{ uri: item.image_url || DEFAULT_IMAGE }} style={st.planImage} imageStyle={{ borderRadius: 16 }}>
        <View style={st.planOverlay} />
        <View style={st.planTopRow}>
          {item.category && (
            <View style={[st.planBadge, { backgroundColor: '#10b981' }]}>
              <Text style={st.planBadgeText}>{item.category.toUpperCase()}</Text>
            </View>
          )}
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </View>
        <View style={st.planBottom}>
          <Text style={st.planTitle} numberOfLines={2}>{item.title || '(Plan Title)'}</Text>
          <Text style={st.planSub}>{item.duration_days || '–'} Days • {item.location || '(Location)'}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const NearbyPlaceCard = ({ title, distance }: any) => (
    <TouchableOpacity style={st.placeCard}>
      <ImageBackground source={{ uri: DEFAULT_IMAGE }} style={st.placeImage} imageStyle={{ borderRadius: 12 }}>
        <View style={st.placeIconBadge}>
          <Ionicons name="camera" size={10} color="#fff" />
        </View>
      </ImageBackground>
      <View style={st.placeInfo}>
        <Text style={st.placeTitle} numberOfLines={1}>{title}</Text>
        <Text style={st.placeSub}>{distance}</Text>
      </View>
    </TouchableOpacity>
  );

  const NearbyMeetupCard = ({ title, time, going, dist }: any) => (
    <TouchableOpacity style={st.meetupCard}>
      <View style={st.meetupHeader}>
        <View style={st.meetupIconBox}><Ionicons name="people" size={16} color="#10b981" /></View>
        <View style={{ flex: 1 }}>
          <Text style={st.meetupTitle} numberOfLines={1}>{title}</Text>
          <Text style={st.meetupTime}>{time}</Text>
        </View>
      </View>
      <Text style={st.meetupGoing}>{going} going</Text>
      <View style={st.meetupAvatarPile}>
        {[1,2,3,4].map((i) => <Image key={i} source={{ uri: AVATAR_IMG }} style={[st.pileAvatar, { zIndex: 10-i, marginLeft: i===1?0:-8 }]} />)}
      </View>
      <View style={st.meetupLocation}>
        <Ionicons name="location-outline" size={12} color="#64748b" />
        <Text style={st.meetupDist}>{dist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={st.container}>
      {/* Full-screen Map */}
      <MapView
        provider={PROVIDER_DEFAULT}
        style={st.map}
        initialRegion={{
          latitude: 28.2096,
          longitude: 83.9856,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={{ latitude: 28.2096, longitude: 83.9856 }}>
          <View style={[st.mapMarker, { backgroundColor: '#8b5cf6' }]}>
            <Text style={{color: '#fff', fontSize: 12, fontWeight: '700'}}>24</Text>
          </View>
        </Marker>
      </MapView>

      {/* Top Overlays */}
      <Animated.View style={[st.topOverlay, { 
        paddingTop: Math.max(insets.top, 16),
        opacity: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 1], extrapolate: 'clamp' }),
        transform: [{ translateY: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [-100, 0], extrapolate: 'clamp' }) }]
      }]} pointerEvents={sheetMode === 'max' ? 'none' : 'box-none'}>
        
        {/* Location Selector Row */}
        <Animated.View style={[st.locationRow, { 
          opacity: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 1], extrapolate: 'clamp' }),
          height: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 36], extrapolate: 'clamp' }),
          marginBottom: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 16], extrapolate: 'clamp' }),
          overflow: 'hidden'
        }]}>
          <TouchableOpacity style={st.locationSelector}>
            <Ionicons name="location" size={16} color="#8b5cf6" />
            <Text style={st.locationSelectorText}>Mumbai, India</Text>
            <Ionicons name="chevron-down" size={14} color="#0f172a" />
          </TouchableOpacity>
        </Animated.View>

        <View style={st.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 8 }} />
          <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/search_results')}>
            <Text style={{ fontSize: 15, color: '#64748b' }}>{searchPlaceholder}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <Animated.View style={{
          opacity: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 1], extrapolate: 'clamp' }),
          height: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 52], extrapolate: 'clamp' }),
          overflow: 'hidden'
        }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, marginTop: 16 }}>
            {topPills.map(item => (
              <TouchableOpacity key={item.id} style={[st.topPill, item.active && { backgroundColor: item.color, borderColor: item.color }]}>
                <Ionicons name={item.icon as any} size={16} color={item.active ? '#fff' : '#475569'} style={{ marginRight: 6 }} />
                <Text style={[st.topPillText, item.active && { color: '#fff' }]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Sub Filters (Trekking, Food, etc) */}
        <Animated.View style={{
          opacity: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 1], extrapolate: 'clamp' }),
          height: sheetY.interpolate({ inputRange: [SHEET_MAX, SHEET_MID], outputRange: [0, 44], extrapolate: 'clamp' }),
          overflow: 'hidden'
        }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }}>
            {subFilters.map(item => (
              <TouchableOpacity key={item.id} style={st.subFilterPill}>
                <Ionicons name={item.icon as any} size={14} color={item.color} style={{ marginRight: 6 }} />
                <Text style={st.subFilterText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.View>





      {/* Map Tools (Layers, Location) - Only visible when Map is Full (minimized sheet) */}
      <Animated.View style={[st.rightActionsContainer, { 
        bottom: Animated.subtract(SCREEN_HEIGHT, sheetY).interpolate({ inputRange: [0, SCREEN_HEIGHT], outputRange: [96, SCREEN_HEIGHT + 96] }),
        opacity: sheetY.interpolate({ inputRange: [SHEET_MIN - 50, SHEET_MIN], outputRange: [0, 1], extrapolate: 'clamp' })
      }]} pointerEvents={sheetMode === 'min' ? 'auto' : 'none'}>
        <TouchableOpacity style={st.floatingBtn}>
          <Ionicons name="layers-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity style={st.floatingBtn}>
          <Ionicons name="locate-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </Animated.View>

      {/* Create Button - Docked lower right, visible in all states */}
      <View style={[st.rightActionsContainer, { bottom: 20 }]} pointerEvents="box-none">
        <TouchableOpacity style={st.fabInner}>
          <View style={st.fabIcon}><Ionicons name="add" size={24} color="#fff" /></View>
          <Text style={st.fabText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Bottom Sheet */}
      <Animated.View style={[st.bottomSheet, { top: sheetY }]}>
        <View {...panResponder.panHandlers} style={st.sheetDragArea}>
          <View style={st.sheetHandle} />
          <Text style={st.handleHint}>{sheetMode === 'max' ? '🗺 BACK TO MAP' : sheetMode === 'mid' ? 'NEARBY PLANS' : '↑ BROWSE 128 NEARBY RESULTS'}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          <View style={st.sectionHeader}>
            <View>
              <Text style={st.sectionTitle}>Nearby Plans</Text>
              <Text style={st.sectionSub}>Handpicked experiences around you</Text>
            </View>
            <TouchableOpacity><Text style={st.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {plans.map((p, idx) => <NearbyPlanCard key={idx} item={p} />)}
            {plans.length === 0 && <NearbyPlanCard item={{ title: '(No plans yet)', id: 'empty' }} />}
          </ScrollView>

          <View style={st.sectionHeader}>
            <Text style={st.sectionTitle}>Nearby Places</Text>
            <TouchableOpacity><Text style={st.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <NearbyPlaceCard title="Phewa Lake" distance="12 km away" />
            <NearbyPlaceCard title="Devi's Fall" distance="14 km away" />
            <NearbyPlaceCard title="World Peace Pagoda" distance="20 km away" />
          </ScrollView>

          <View style={st.sectionHeader}>
            <Text style={st.sectionTitle}>Nearby Meetups</Text>
            <TouchableOpacity><Text style={st.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <NearbyMeetupCard title="Sunset Hike" time="Today • 5:30 PM" going="12" dist="2.1 km away" />
            <NearbyMeetupCard title="Photography Walk" time="Tomorrow • 7:00 AM" going="8" dist="3.4 km away" />
            <NearbyMeetupCard title="Backpackers Campfire" time="Sat • 8:00 PM" going="15" dist="4.2 km away" />
          </ScrollView>

        </ScrollView>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  map: { ...StyleSheet.absoluteFillObject },

  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  locationSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  locationSelectorText: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginHorizontal: 6 },
  
  topPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  topPillText: { fontSize: 13, fontWeight: '600', color: '#475569' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, height: 48, borderRadius: 24, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },

  subFilterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  subFilterText: { fontSize: 12, fontWeight: '600', color: '#334155' },

  mapMarker: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },

  rightActionsContainer: { position: 'absolute', right: 20, zIndex: 10, alignItems: 'center' },
  floatingBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

  fabInner: { alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  fabIcon: { width: 48, height: 48, backgroundColor: '#8b5cf6', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  fabText: { fontSize: 10, fontWeight: '700', color: '#0f172a', textAlign: 'center' },

  bottomSheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 10 },
  sheetDragArea: { height: 44, justifyContent: 'center', alignItems: 'center' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2, marginBottom: 4 },
  handleHint: { fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  sectionSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: '#8b5cf6' },

  planCard: { width: 200, height: 260, marginRight: 16 },
  planImage: { width: '100%', height: '100%', padding: 12, justifyContent: 'space-between' },
  planOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16 },
  planTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  planBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  planBottom: {},
  planTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  planSub: { color: '#e2e8f0', fontSize: 11, marginBottom: 8 },

  placeCard: { flexDirection: 'row', alignItems: 'center', width: 220, padding: 8, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  placeImage: { width: 64, height: 64, borderRadius: 12 },
  placeIconBadge: { position: 'absolute', bottom: -6, right: -6, width: 20, height: 20, backgroundColor: '#0ea5e9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  placeInfo: { flex: 1, marginLeft: 16 },
  placeTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  placeSub: { fontSize: 11, color: '#64748b' },

  meetupCard: { width: 260, padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 16 },
  meetupHeader: { flexDirection: 'row', marginBottom: 12 },
  meetupIconBox: { width: 32, height: 32, backgroundColor: '#d1fae5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  meetupTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  meetupTime: { fontSize: 12, color: '#64748b', marginTop: 2 },
  meetupGoing: { fontSize: 12, color: '#10b981', fontWeight: '600', marginBottom: 8 },
  meetupAvatarPile: { flexDirection: 'row', marginBottom: 12 },
  pileAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#f8fafc' },
  meetupLocation: { flexDirection: 'row', alignItems: 'center' },
  meetupDist: { fontSize: 12, color: '#64748b', marginLeft: 4 }
});
