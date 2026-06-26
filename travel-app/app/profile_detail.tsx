import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COVER_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_IMAGE = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop';
const PLAN_IMAGE = 'https://images.unsplash.com/photo-1596743343697-39b1cbcf7723?q=80&w=1000';

export default function ProfileScreen() {
  const session = useAuthStore(state => state.session);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Plans');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (session?.user?.id) {
        fetchData();
        fetchMyPlans();
      }
    }, [session])
  );

  async function fetchData() {
    setLoading(true);
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session!.user.id)
      .single();

    if (profileData) setProfile(profileData);
    setLoading(false);
  }

  async function fetchMyPlans() {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', session!.user.id)
      .order('created_at', { ascending: false });
    if (data) setPlans(data);
  }

  const tabs = ['Plans', 'Saved', 'Reviews', 'Followers'];

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const userName = profile?.display_name || session?.user?.email?.split('@')[0] || 'User';
  const userHandle = profile?.username ? `@${profile.username}` : `@${userName.toLowerCase().replace(/\s/g, '')}`;
  const userLocation = profile?.home_city || '(Location not set)';

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* Cover Image */}
        <ImageBackground source={{ uri: profile?.cover_url || COVER_IMAGE }} style={s.coverImage}>
          <View style={[s.headerActions, { marginTop: Math.max(insets.top, 20) }]}>
            <TouchableOpacity style={s.iconButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[s.iconButton, { marginRight: 12 }]}>
                <Ionicons name="share-outline" size={22} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity style={s.iconButton}>
                <Ionicons name="ellipsis-horizontal" size={22} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Profile Card */}
        <View style={s.profileCard}>

          <View style={s.profileTopRow}>
            <View style={s.avatarContainer}>
              <Image source={{ uri: profile?.avatar_url || AVATAR_IMAGE }} style={s.avatar} />
              <TouchableOpacity style={s.cameraBadge}>
                <Ionicons name="camera" size={16} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View style={s.infoContainer}>
              <View style={s.nameRow}>
                <Text style={s.nameText}>{userName}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#2563eb" style={{ marginLeft: 6 }} />
              </View>
              <Text style={s.usernameText}>{userHandle}</Text>

              <View style={s.locationRow}>
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={s.locationText}>{userLocation}</Text>
              </View>

              <Text style={s.bioText}>
                {profile?.bio || 'Explorer at heart. Mountains call me home.\nAlways chasing sunsets and new stories.'}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <View style={[s.statIconWrapper, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text style={s.statValue}>{plans.length || 0}</Text>
                <Text style={s.statLabel}>Plans</Text>
              </View>
            </View>

            <View style={s.statBox}>
              <View style={[s.statIconWrapper, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="bookmark-outline" size={20} color="#10b981" />
              </View>
              <View>
                <Text style={s.statValue}>{profile?.saves_count || 0}</Text>
                <Text style={s.statLabel}>Saves</Text>
              </View>
            </View>

            <View style={s.statBox}>
              <View style={[s.statIconWrapper, { backgroundColor: '#fff7ed' }]}>
                <Ionicons name="star-outline" size={20} color="#f97316" />
              </View>
              <View>
                <Text style={s.statValue}>{profile?.rating || '–'}</Text>
                <Text style={s.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={s.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity key={tab} style={[s.tab, activeTab === tab && s.tabActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content: Plans */}
          {activeTab === 'Plans' && (
            <View style={s.sectionContainer}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>My Plans</Text>
                <TouchableOpacity>
                  <Text style={s.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
                {plans.length === 0 ? (
                  <View style={{ width: width - 48, alignItems: 'center', paddingVertical: 40 }}>
                    <Ionicons name="map-outline" size={48} color="#cbd5e1" />
                    <Text style={{ marginTop: 12, color: '#64748b', fontWeight: '500' }}>You haven't created any plans yet.</Text>
                  </View>
                ) : (
                  plans.map(plan => (
                    <TouchableOpacity key={plan.id} style={s.planCard} onPress={() => router.push(`/plans/${plan.id}`)}>
                      <View style={s.planImageContainer}>
                        <Image source={{ uri: plan.image_url || PLAN_IMAGE }} style={s.planImage} />
                        {plan.category && (
                          <View style={[s.planBadge, { backgroundColor: '#0ea5e9' }]}>
                            <Text style={s.planBadgeText}>{plan.category.toUpperCase()}</Text>
                          </View>
                        )}
                        <TouchableOpacity style={s.bookmarkBtn}>
                          <Ionicons name="bookmark-outline" size={18} color="#0f172a" />
                        </TouchableOpacity>
                      </View>
                      <View style={s.planContent}>
                        <View style={s.planTitleRow}>
                          <Text style={s.planTitle} numberOfLines={1}>{plan.title}</Text>
                          <Ionicons name="ellipsis-vertical" size={16} color="#94a3b8" />
                        </View>

                        <View style={s.planMetaRow}>
                          <Ionicons name="calendar-outline" size={12} color="#64748b" />
                          <Text style={s.planMetaText}>{plan.duration_days || '–'} Days</Text>
                          <Ionicons name="location-outline" size={12} color="#64748b" style={{ marginLeft: 8 }} />
                          <Text style={s.planMetaText} numberOfLines={1}>{plan.location || '(Not set)'}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
                <View style={{ width: 24 }} />
              </ScrollView>

              {/* About Section */}
              <Text style={[s.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>About {userName}</Text>
              <View style={s.aboutContainer}>

                <View style={s.aboutList}>
                  <View style={s.aboutItem}>
                    <View style={[s.aboutIcon, { backgroundColor: '#f0fdf4' }]}>
                      <Ionicons name="compass-outline" size={18} color="#10b981" />
                    </View>
                    <View>
                      <Text style={s.aboutItemTitle}>Travel Style</Text>
                      <Text style={s.aboutItemSub} numberOfLines={1}>{profile?.travel_style || '(Not set)'}</Text>
                    </View>
                  </View>

                  <View style={s.aboutItem}>
                    <View style={[s.aboutIcon, { backgroundColor: '#fff7ed' }]}>
                      <Ionicons name="location-outline" size={18} color="#f97316" />
                    </View>
                    <View>
                      <Text style={s.aboutItemTitle}>Top Destinations</Text>
                      <Text style={s.aboutItemSub} numberOfLines={1}>{profile?.top_destinations || '(Not set)'}</Text>
                    </View>
                  </View>

                  <View style={s.aboutItem}>
                    <View style={[s.aboutIcon, { backgroundColor: '#eff6ff' }]}>
                      <Ionicons name="airplane-outline" size={18} color="#3b82f6" />
                    </View>
                    <View>
                      <Text style={s.aboutItemTitle}>Joined</Text>
                      <Text style={s.aboutItemSub}>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '(Unknown)'}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={s.mapThumbnail}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000' }} style={{ width: '100%', height: '100%', opacity: 0.8 }} />
                  <View style={s.mapOverlay} />
                  <View style={s.mapLabel}>
                    <Text style={s.mapLabelText}>Visited Places</Text>
                    <Ionicons name="chevron-forward" size={16} color="#64748b" />
                  </View>
                </TouchableOpacity>

              </View>

              {/* Recent Reviews */}
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Recent Reviews</Text>
                <TouchableOpacity>
                  <Text style={s.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                <Ionicons name="chatbubbles-outline" size={36} color="#cbd5e1" />
                <Text style={{ marginTop: 8, color: '#94a3b8', fontSize: 13 }}>(No reviews yet)</Text>
              </View>

            </View>
          )}

          {/* Other Tabs - placeholder */}
          {activeTab !== 'Plans' && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Ionicons name="construct-outline" size={48} color="#cbd5e1" />
              <Text style={{ marginTop: 12, color: '#64748b', fontWeight: '500' }}>{activeTab} coming soon</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },

  coverImage: { width: '100%', height: 200, resizeMode: 'cover' },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },

  profileCard: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingHorizontal: 24, flex: 1 },

  profileTopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  avatarContainer: { marginTop: -50, position: 'relative', marginRight: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#ffffff' },
  cameraBadge: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },

  infoContainer: { flex: 1, marginTop: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  nameText: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  usernameText: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  bioText: { fontSize: 13, color: '#475569', lineHeight: 18 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 16, padding: 12, marginRight: 8 },
  statIconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#64748b' },

  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#2563eb' },

  sectionContainer: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },

  planCard: { width: 240, marginRight: 16, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  planImageContainer: { width: '100%', height: 140, borderRadius: 16, padding: 12, justifyContent: 'space-between', flexDirection: 'row' },
  planImage: { ...StyleSheet.absoluteFillObject, borderRadius: 16 },
  planBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  planBadgeText: { fontSize: 10, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  bookmarkBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  planContent: { padding: 12 },
  planTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  planTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0f172a', marginRight: 8 },
  planMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  planMetaText: { fontSize: 11, color: '#64748b', marginLeft: 4, marginRight: 4 },

  aboutContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  aboutList: { flex: 1, marginRight: 16 },
  aboutItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  aboutIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  aboutItemTitle: { fontSize: 13, color: '#0f172a', fontWeight: '600', marginBottom: 2 },
  aboutItemSub: { fontSize: 12, color: '#64748b' },
  mapThumbnail: { width: 120, height: 160, borderRadius: 16, backgroundColor: '#e0f2fe', overflow: 'hidden' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(224, 242, 254, 0.5)' },
  mapLabel: { position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mapLabelText: { fontSize: 10, fontWeight: '600', color: '#0f172a' },
});
