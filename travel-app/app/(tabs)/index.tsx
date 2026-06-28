import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, ImageBackground, StyleSheet, TextInput, Image, StatusBar, Dimensions } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const ROBOT_IMG = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'; // fallback
const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );

  async function fetchPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*, profiles(display_name)')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setPlans(data);
    }
    setLoading(false);
    setRefreshing(false);
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  const renderSectionHeader = (title: string, showViewAll = true) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Components for various sections based on Home Feed.png
  
  const TopTabs = () => (
    <View style={styles.tabsContainer}>
      <View style={styles.tabActive}>
        <Text style={styles.tabTextActive}>For You</Text>
        <View style={styles.activeIndicator} />
      </View>
      <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>Trending</Text></View>
      <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>Nearby</Text></View>
      <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>Following</Text></View>
    </View>
  );

  const AIBanner = () => (
    <View style={styles.aiBannerContainer}>
      <View style={styles.aiBadge}>
        <Ionicons name="sparkles" size={12} color="#0f172a" style={{marginRight: 4}} />
        <Text style={styles.aiBadgeText}>AI TRAVEL ASSISTANT</Text>
      </View>
      
      <View style={styles.aiContentRow}>
        <View style={styles.aiTextContent}>
          <Text style={styles.aiGreeting}>Hi Arjun! 👋</Text>
          <Text style={styles.aiTitle}>Where do you want to go next?</Text>
          <Text style={styles.aiSubtitle}>Get personalized recommendations, smart itineraries and hidden gems just for you.</Text>
        </View>
        <Image source={{ uri: ROBOT_IMG }} style={styles.aiRobotImage} />
      </View>

      <View style={styles.aiActionRow}>
        <TouchableOpacity style={styles.aiBtnPrimary}>
          <Ionicons name="briefcase-outline" size={16} color="#fff" style={{marginRight: 6}} />
          <Text style={styles.aiBtnPrimaryText}>Continue Planning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aiBtnSecondary}>
          <Ionicons name="add-circle" size={16} color="#2563eb" style={{marginRight: 6}} />
          <Text style={styles.aiBtnSecondaryText}>Create Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiBtnSecondary}>
          <Ionicons name="logo-instagram" size={16} color="#e1306c" style={{marginRight: 6}} />
          <Text style={styles.aiBtnSecondaryText}>Import Reel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ContinuePlanningCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.cpCard} onPress={() => router.push(`/plans/${item.id}`)}>
      <ImageBackground source={{ uri: item.image_url || DEFAULT_IMAGE }} style={styles.cpImage} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.cpOverlay} />
        <View style={styles.cpTopRow}>
          <View style={styles.cpDaysBadge}>
            <Text style={styles.cpDaysText}>3/8 days</Text>
          </View>
          <View style={styles.cpDotsBtn}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#0f172a" />
          </View>
        </View>
        <View style={styles.cpBottom}>
          <Text style={styles.cpTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cpSubtitle}>3 of 8 days planned</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '38%' }]} />
          </View>
          <Text style={styles.progressText}>38%</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const MoodsPills = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 24 }}>
      <TouchableOpacity style={styles.moodPill}><Text style={styles.moodEmoji}>🚶</Text><Text style={styles.moodText}>Trekking</Text></TouchableOpacity>
      <TouchableOpacity style={styles.moodPill}><Text style={styles.moodEmoji}>🎒</Text><Text style={styles.moodText}>Backpacking</Text></TouchableOpacity>
      <TouchableOpacity style={styles.moodPill}><Text style={styles.moodEmoji}>🚗</Text><Text style={styles.moodText}>Road Trips</Text></TouchableOpacity>
      <TouchableOpacity style={styles.moodPill}><Text style={styles.moodEmoji}>🍴</Text><Text style={styles.moodText}>Food</Text></TouchableOpacity>
      <TouchableOpacity style={styles.moodPill}><Text style={styles.moodEmoji}>⛺</Text><Text style={styles.moodText}>Camping</Text></TouchableOpacity>
    </ScrollView>
  );

  const NearbyActivity = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
      <TouchableOpacity style={styles.activityCard}>
        <ImageBackground source={{ uri: DEFAULT_IMAGE }} style={styles.activityImage} imageStyle={{ borderRadius: 12 }}>
          <View style={styles.activityOverlay} />
          <View style={[styles.activityIconBox, { backgroundColor: '#10b981' }]}><Ionicons name="walk" size={18} color="#fff" /></View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Treks near me</Text>
            <Text style={styles.activitySubtitle}>12 treks within 100 km</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={styles.activityCard}>
        <ImageBackground source={{ uri: DEFAULT_IMAGE }} style={styles.activityImage} imageStyle={{ borderRadius: 12 }}>
          <View style={styles.activityOverlay} />
          <View style={[styles.activityIconBox, { backgroundColor: '#8b5cf6' }]}><Ionicons name="bed" size={18} color="#fff" /></View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Hostels near me</Text>
            <Text style={styles.activitySubtitle}>18 stays within 100 km</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={styles.activityCard}>
        <ImageBackground source={{ uri: DEFAULT_IMAGE }} style={styles.activityImage} imageStyle={{ borderRadius: 12 }}>
          <View style={styles.activityOverlay} />
          <View style={[styles.activityIconBox, { backgroundColor: '#f97316' }]}><Ionicons name="people" size={18} color="#fff" /></View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Meetups near me</Text>
            <Text style={styles.activitySubtitle}>8 meetups this weekend</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </ScrollView>
  );

  const SocialBanner = () => (
    <View style={styles.socialBanner}>
      <View style={styles.socialAvatarPile}>
        {[1,2,3,4].map((i) => <Image key={i} source={{ uri: AVATAR_IMG }} style={[styles.socialAvatar, { zIndex: 10-i, marginLeft: i===1?0:-12 }]} />)}
        <View style={[styles.socialAvatarCount, { zIndex: 5, marginLeft: -12 }]}><Text style={styles.socialAvatarCountText}>+9</Text></View>
      </View>
      <Text style={styles.socialText}>14 travelers are planning Kasol{"\n"}next month. Wanna join?</Text>
      <TouchableOpacity style={styles.socialBtn}>
        <Text style={styles.socialBtnText}>View Trip</Text>
      </TouchableOpacity>
    </View>
  );

  const TrendingCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.trendingCard} onPress={() => router.push(`/plans/${item.id}`)}>
      <ImageBackground source={{ uri: item.image_url || DEFAULT_IMAGE }} style={styles.trendingImage} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.trendingOverlay} />
        <View style={styles.trendingTop}>
          <View style={styles.trendingDaysBadge}><Text style={styles.trendingDaysText}>{item.duration_days || 5} Days</Text></View>
          <TouchableOpacity><Ionicons name="heart-outline" size={20} color="#fff" /></TouchableOpacity>
        </View>
        <View style={styles.trendingBottom}>
          <Text style={styles.trendingTitle} numberOfLines={1}>{item.title || '(Image of plan)'}</Text>
          <Text style={styles.trendingStats}>⭐ 4.8 (128) • 12K saved</Text>
          <Text style={styles.trendingPrice}>₹14,999</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const PopularTrekCard = ({ title, tag, color }: any) => (
    <TouchableOpacity style={styles.popularCard}>
      <Image source={{ uri: DEFAULT_IMAGE }} style={styles.popularImg} />
      <View style={styles.popularInfo}>
        <Text style={styles.popularTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.popularStatsRow}>
          <Text style={styles.popularRating}>4.8 ⭐</Text>
          <View style={[styles.popularTagBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.popularTagText, { color: color }]}>{tag}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const OrganizerCard = ({ name, trips }: any) => (
    <TouchableOpacity style={styles.organizerCard}>
      <Image source={{ uri: DEFAULT_IMAGE }} style={styles.organizerImg} />
      <View style={styles.organizerInfo}>
        <Text style={styles.organizerTitle} numberOfLines={1}>{name}</Text>
        <Text style={styles.organizerStats}>4.8 ⭐ (1.2K)</Text>
        <Text style={styles.organizerTrips}>{trips} Trips</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.topRow}>
          <Text style={styles.logoText}>Itinerate</Text>
          
          <TouchableOpacity style={styles.locationSelector}>
            <Ionicons name="location-outline" size={16} color="#0f172a" />
            <Text style={styles.locationSelectorText}>Mumbai, India</Text>
            <Ionicons name="chevron-down" size={14} color="#0f172a" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#0f172a" />
            <View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>3</Text></View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations, plans, treks..."
            placeholderTextColor="#94a3b8"
            onFocus={() => router.push('/search_results')}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        <TopTabs />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.aiBannerContainer}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color="#0f172a" style={{marginRight: 4}} />
              <Text style={styles.aiBadgeText}>AI TRAVEL ASSISTANT</Text>
            </View>
            
            <View style={styles.aiContentRow}>
              <View style={styles.aiTextContent}>
                <Text style={styles.aiGreeting}>Hi Explorer! 👋</Text>
                <Text style={styles.aiTitle}>Where do you want to go next?</Text>
                <Text style={styles.aiSubtitle}>Get personalized recommendations, smart itineraries and hidden gems just for you.</Text>
              </View>
              <Image source={{ uri: ROBOT_IMG }} style={styles.aiRobotImage} />
            </View>

            <View style={styles.aiActionRow}>
              <TouchableOpacity style={styles.aiBtnPrimary}>
                <Ionicons name="briefcase-outline" size={16} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.aiBtnPrimaryText}>Continue Planning</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.aiBtnSecondary} onPress={() => router.push('/(tabs)/create')}>
                <Ionicons name="add-circle" size={16} color="#2563eb" style={{marginRight: 6}} />
                <Text style={styles.aiBtnSecondaryText}>Create Trip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.aiBtnSecondary}>
                <Ionicons name="logo-instagram" size={16} color="#e1306c" style={{marginRight: 6}} />
                <Text style={styles.aiBtnSecondaryText}>Import Reel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {renderSectionHeader('Continue Planning')}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {plans.slice(0,3).map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.cpCard} onPress={() => router.push(`/plans/${item.id}`)}>
              <ImageBackground source={{ uri: item.image_url || DEFAULT_IMAGE }} style={styles.cpImage} imageStyle={{ borderRadius: 16 }}>
                <View style={styles.cpOverlay} />
                <View style={styles.cpTopRow}>
                  <View style={styles.cpDaysBadge}>
                    <Text style={styles.cpDaysText}>3/8 days</Text>
                  </View>
                </View>
                <View style={styles.cpBottom}>
                  <Text style={styles.cpTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cpSubtitle}>3 of 8 days planned</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '38%' }]} />
                  </View>
                  <Text style={styles.progressText}>38%</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {plans.length === 0 && (
            <TouchableOpacity style={styles.cpCard}>
              <ImageBackground source={{ uri: DEFAULT_IMAGE }} style={styles.cpImage} imageStyle={{ borderRadius: 16 }}>
                <View style={styles.cpOverlay} />
                <View style={styles.cpTopRow}>
                  <View style={styles.cpDaysBadge}>
                    <Text style={styles.cpDaysText}>0/0 days</Text>
                  </View>
                </View>
                <View style={styles.cpBottom}>
                  <Text style={styles.cpTitle} numberOfLines={1}>(No plans yet)</Text>
                  <Text style={styles.cpSubtitle}>0 days planned</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '0%' }]} />
                  </View>
                  <Text style={styles.progressText}>0%</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        </ScrollView>

        {renderSectionHeader('What are you in the mood for?', false)}
        <MoodsPills />

        {renderSectionHeader('Nearby Activity')}
        <NearbyActivity />

        <View style={{ paddingHorizontal: 20, marginVertical: 24 }}>
          <SocialBanner />
        </View>

        {renderSectionHeader('Trending Itineraries')}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {plans.map((item, idx) => <TrendingCard key={idx} item={item} />)}
          {plans.length === 0 && <TrendingCard item={{title: '(No Trending Itineraries)'}} />}
        </ScrollView>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 20, backgroundColor: '#ffffff', zIndex: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logoText: { fontSize: 24, fontWeight: '700', color: '#2563eb', fontStyle: 'italic' },
  locationSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  locationSelectorText: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginHorizontal: 4 },
  notificationBtn: { position: 'relative', width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  notificationBadge: { position: 'absolute', top: 4, right: -2, backgroundColor: '#ef4444', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  notificationBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 48, borderRadius: 24, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 20 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: '100%', fontSize: 14, color: '#0f172a' },
  filterBtn: { marginLeft: 8 },

  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tabActive: { position: 'relative', paddingBottom: 8 },
  tabInactive: { paddingBottom: 8 },
  tabTextActive: { fontSize: 14, fontWeight: '700', color: '#2563eb' },
  tabTextInactive: { fontSize: 14, fontWeight: '500', color: '#64748b' },
  activeIndicator: { position: 'absolute', bottom: -12, left: 0, right: 0, height: 3, backgroundColor: '#2563eb', borderTopLeftRadius: 3, borderTopRightRadius: 3 },

  scrollContainer: { flex: 1 },
  
  aiBannerContainer: { backgroundColor: '#f0f9ff', borderRadius: 24, padding: 20, marginTop: 24 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  aiBadgeText: { fontSize: 10, fontWeight: '700', color: '#0f172a', letterSpacing: 0.5 },
  aiContentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  aiTextContent: { flex: 1, paddingRight: 16 },
  aiGreeting: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  aiTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8, lineHeight: 24 },
  aiSubtitle: { fontSize: 13, color: '#475569', lineHeight: 18 },
  aiRobotImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe' },
  aiActionRow: { flexDirection: 'row', marginTop: 20, flexWrap: 'wrap', gap: 8 },
  aiBtnPrimary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  aiBtnPrimaryText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  aiBtnSecondary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  aiBtnSecondaryText: { color: '#0f172a', fontSize: 12, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },

  cpCard: { width: 160, height: 180, marginRight: 16 },
  cpImage: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 12 },
  cpOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16 },
  cpTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cpDaysBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cpDaysText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  cpDotsBtn: { backgroundColor: '#ffffff', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cpBottom: { width: '100%' },
  cpTitle: { color: '#ffffff', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cpSubtitle: { color: '#e2e8f0', fontSize: 10, marginBottom: 8 },
  progressBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 2 },
  progressText: { color: '#ffffff', fontSize: 10, textAlign: 'right', fontWeight: '700' },

  moodPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  moodEmoji: { fontSize: 16, marginRight: 6 },
  moodText: { fontSize: 13, fontWeight: '600', color: '#334155' },

  activityCard: { width: 220, height: 120, marginRight: 16 },
  activityImage: { width: '100%', height: '100%', padding: 16, justifyContent: 'flex-end' },
  activityOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12 },
  activityIconBox: { position: 'absolute', top: 16, left: 16, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  activityContent: {},
  activityTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  activitySubtitle: { color: '#cbd5e1', fontSize: 11 },

  socialBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  socialAvatarPile: { flexDirection: 'row', marginRight: 12 },
  socialAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#fff' },
  socialAvatarCount: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#fff', backgroundColor: '#8b5cf6', justifyContent: 'center', alignItems: 'center' },
  socialAvatarCountText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  socialText: { flex: 1, fontSize: 12, color: '#334155', fontWeight: '500', lineHeight: 18 },
  socialBtn: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  socialBtnText: { color: '#2563eb', fontSize: 12, fontWeight: '600' },

  trendingCard: { width: 260, height: 260, marginRight: 16 },
  trendingImage: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 16 },
  trendingOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16 },
  trendingTop: { flexDirection: 'row', justifyContent: 'space-between' },
  trendingDaysBadge: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  trendingDaysText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  trendingBottom: {},
  trendingTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  trendingStats: { color: '#f8fafc', fontSize: 12, marginBottom: 8 },
  trendingPrice: { color: '#fff', fontSize: 15, fontWeight: '700' },

  popularCard: { flexDirection: 'row', alignItems: 'center', width: 220, padding: 8, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  popularImg: { width: 56, height: 56, borderRadius: 12, marginRight: 12 },
  popularInfo: { flex: 1 },
  popularTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  popularStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  popularRating: { fontSize: 12, color: '#475569', fontWeight: '600' },
  popularTagBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  popularTagText: { fontSize: 10, fontWeight: '700' },

  organizerCard: { alignItems: 'center', width: 140, padding: 16, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  organizerImg: { width: 64, height: 64, borderRadius: 32, marginBottom: 12 },
  organizerInfo: { alignItems: 'center' },
  organizerTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 4, textAlign: 'center' },
  organizerStats: { fontSize: 11, color: '#475569', marginBottom: 2 },
  organizerTrips: { fontSize: 11, color: '#64748b' },
});
