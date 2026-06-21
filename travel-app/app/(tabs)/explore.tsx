import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

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

  const renderTopPill = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.topPill, item.active && { backgroundColor: item.color, borderColor: item.color }]}>
      <Ionicons name={item.icon} size={16} color={item.active ? '#fff' : '#475569'} style={{ marginRight: 6 }} />
      <Text style={[styles.topPillText, item.active && { color: '#fff' }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderSubFilter = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.subFilterPill}>
      <Ionicons name={item.icon} size={14} color={item.color} style={{ marginRight: 6 }} />
      <Text style={styles.subFilterText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const NearbyPlanCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.planCard} onPress={() => router.push(`/plans/${item.id}`)}>
      <ImageBackground source={{ uri: item.image_url || DEFAULT_IMAGE }} style={styles.planImage} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.planOverlay} />
        <View style={styles.planTopRow}>
          <View style={[styles.planBadge, { backgroundColor: '#10b981' }]}>
            <Text style={styles.planBadgeText}>BESTSELLER</Text>
          </View>
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </View>
        <View style={styles.planBottom}>
          <Text style={styles.planTitle} numberOfLines={2}>{item.title || '(Image of plan)'}</Text>
          <Text style={styles.planSub}>{item.duration_days || 3} Days • 12 Places</Text>
          <View style={styles.planMetaRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.planRating}>4.8 (128)</Text>
            </View>
            <Text style={styles.planPrice}>₹12,499</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const NearbyPlaceCard = ({ title, distance }: any) => (
    <TouchableOpacity style={styles.placeCard}>
      <ImageBackground source={{ uri: DEFAULT_IMAGE }} style={styles.placeImage} imageStyle={{ borderRadius: 12 }}>
        <View style={styles.placeIconBadge}>
          <Ionicons name="camera" size={10} color="#fff" />
        </View>
      </ImageBackground>
      <View style={styles.placeInfo}>
        <Text style={styles.placeTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.placeSub}>{distance}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Ionicons name="star" size={10} color="#f59e0b" />
          <Text style={styles.placeRating}>4.7</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const NearbyMeetupCard = ({ title, time, going, dist }: any) => (
    <TouchableOpacity style={styles.meetupCard}>
      <View style={styles.meetupHeader}>
        <View style={styles.meetupIconBox}><Ionicons name="people" size={16} color="#10b981" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.meetupTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.meetupTime}>{time}</Text>
        </View>
      </View>
      <Text style={styles.meetupGoing}>{going} going</Text>
      <View style={styles.meetupAvatarPile}>
        {[1,2,3,4].map((i) => <Image key={i} source={{ uri: AVATAR_IMG }} style={[styles.pileAvatar, { zIndex: 10-i, marginLeft: i===1?0:-8 }]} />)}
        <View style={[styles.pileAvatarCount, { zIndex: 5, marginLeft: -8 }]}><Text style={styles.pileAvatarText}>+7</Text></View>
      </View>
      <View style={styles.meetupLocation}>
        <Ionicons name="location-outline" size={12} color="#64748b" />
        <Text style={styles.meetupDist}>{dist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: 28.2096,
          longitude: 83.9856, // Pokhara coords for UI matching
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={{ latitude: 28.2096, longitude: 83.9856 }}>
          <View style={[styles.mapMarker, { backgroundColor: '#8b5cf6' }]}>
            <Text style={{color: '#fff', fontSize: 12, fontWeight: '700'}}>24</Text>
          </View>
        </Marker>
      </MapView>

      {/* Top Overlays */}
      <View style={[styles.topOverlay, { paddingTop: Math.max(insets.top, 16) }]}>
        
        {/* Top Pills Row */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color="#0f172a" />
          </TouchableOpacity>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={topPills}
            keyExtractor={item => item.id}
            renderItem={renderTopPill}
            contentContainerStyle={{ paddingRight: 20 }}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 8 }} />
          <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/search_results')}>
            <Text style={{ fontSize: 15, color: '#64748b' }}>Search this area</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Sub Filters */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={subFilters}
          keyExtractor={item => item.id}
          renderItem={renderSubFilter}
          contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }}
        />
      </View>

      {/* Floating Map Actions */}
      <View style={styles.floatingMapActions}>
        <TouchableOpacity style={styles.floatingBtn}>
          <Ionicons name="layers-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingBtn}>
          <Ionicons name="navigate-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createMeetupFab}>
        <View style={styles.fabIcon}><Ionicons name="add" size={24} color="#fff" /></View>
        <Text style={styles.fabText}>Create Meetup</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Nearby Plans</Text>
              <Text style={styles.sectionSub}>Handpicked experiences around you</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {plans.map((p, idx) => <NearbyPlanCard key={idx} item={p} />)}
            {plans.length === 0 && <NearbyPlanCard item={{ title: '(Image of Pokhara)'}} />}
            {plans.length === 0 && <NearbyPlanCard item={{ title: '(Image of Trek)'}} />}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Places</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <NearbyPlaceCard title="Phewa Lake" distance="12 km away" />
            <NearbyPlaceCard title="Devi's Fall" distance="14 km away" />
            <NearbyPlaceCard title="World Peace Pagoda" distance="20 km away" />
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Meetups</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <NearbyMeetupCard title="Sunset Hike" time="Today • 5:30 PM" going="12" dist="2.1 km away" />
            <NearbyMeetupCard title="Photography Walk" time="Tomorrow • 7:00 AM" going="8" dist="3.4 km away" />
            <NearbyMeetupCard title="Backpackers Campfire" time="Sat, 18 May • 8:00 PM" going="15" dist="4.2 km away" />
          </ScrollView>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  map: { ...StyleSheet.absoluteFillObject },
  
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  menuBtn: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  topPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  topPillText: { fontSize: 13, fontWeight: '600', color: '#475569' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, height: 48, borderRadius: 24, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  
  subFilterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  subFilterText: { fontSize: 12, fontWeight: '600', color: '#334155' },

  mapMarker: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff', shadowColor: '#8b5cf6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },

  floatingMapActions: { position: 'absolute', right: 20, top: 220, zIndex: 10 },
  floatingBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

  createMeetupFab: { position: 'absolute', right: 20, bottom: height * 0.45 + 20, backgroundColor: '#fff', padding: 8, borderRadius: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5, zIndex: 10 },
  fabIcon: { width: 48, height: 48, backgroundColor: '#8b5cf6', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  fabText: { fontSize: 10, fontWeight: '700', color: '#0f172a' },

  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.45, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 10 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  
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
  planMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planRating: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  planPrice: { color: '#10b981', fontSize: 14, fontWeight: '800' },

  placeCard: { flexDirection: 'row', alignItems: 'center', width: 220, padding: 8, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  placeImage: { width: 64, height: 64, borderRadius: 12 },
  placeIconBadge: { position: 'absolute', bottom: -6, right: -6, width: 20, height: 20, backgroundColor: '#0ea5e9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  placeInfo: { flex: 1, marginLeft: 16 },
  placeTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  placeSub: { fontSize: 11, color: '#64748b' },
  placeRating: { fontSize: 11, fontWeight: '700', color: '#475569', marginLeft: 4 },

  meetupCard: { width: 260, padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 16 },
  meetupHeader: { flexDirection: 'row', marginBottom: 12 },
  meetupIconBox: { width: 32, height: 32, backgroundColor: '#d1fae5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  meetupTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  meetupTime: { fontSize: 12, color: '#64748b', marginTop: 2 },
  meetupGoing: { fontSize: 12, color: '#10b981', fontWeight: '600', marginBottom: 8 },
  meetupAvatarPile: { flexDirection: 'row', marginBottom: 12 },
  pileAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#f8fafc' },
  pileAvatarCount: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#f8fafc', backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  pileAvatarText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  meetupLocation: { flexDirection: 'row', alignItems: 'center' },
  meetupDist: { fontSize: 12, color: '#64748b', marginLeft: 4 },
});
