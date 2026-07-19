import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OverviewModule, TravelStatisticsModule, PublicPlansModule, CollectionsModule } from '../../components/profile/ProfileModules';

const { width } = Dimensions.get('window');
const COVER_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_IMAGE = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop';

export default function ProfileScreen() {
  const session = useAuthStore((state: any) => state.session);
  const globalProfile = useAuthStore((state: any) => state.profile);
  const [profile, setProfile] = useState<any>(globalProfile);
  const [loading, setLoading] = useState(!globalProfile);
  const [activeTab, setActiveTab] = useState('Overview');
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
    if (!globalProfile) setLoading(true);
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session!.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      // optionally update global store here too if we imported setProfile from useAuthStore
      // useAuthStore.getState().setProfile(profileData);
    }
    setLoading(false);
  }

  async function fetchMyPlans() {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .eq('creator_id', session!.user.id)
      .order('created_at', { ascending: false });
    if (data) setPlans(data);
  }

  const tabs = ['Overview', 'Travel Stats', 'Public Plans', 'Collections'];

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
              <TouchableOpacity style={s.iconButton} onPress={() => router.push('/settings' as any)}>
                <Ionicons name="settings-outline" size={22} color="#0f172a" />
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
                {profile?.is_verified && (
                  <Ionicons name="checkmark-circle" size={20} color="#2563eb" style={{ marginLeft: 6 }} />
                )}
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

          {/* Action Row */}
          <View style={s.actionRow}>
             <TouchableOpacity style={s.primaryActionBtn}>
               <Text style={s.primaryActionText}>Edit Profile</Text>
             </TouchableOpacity>
             <TouchableOpacity style={s.secondaryActionBtn}>
               <Text style={s.secondaryActionText}>Share Profile</Text>
             </TouchableOpacity>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tabs.map(tab => (
                <TouchableOpacity key={tab} style={[s.tab, activeTab === tab && s.tabActive]} onPress={() => setActiveTab(tab)}>
                  <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={s.tabContentContainer}>
            {activeTab === 'Overview' && <OverviewModule profile={profile} plans={plans} />}
            {activeTab === 'Travel Stats' && <TravelStatisticsModule profile={profile} plans={plans} />}
            {activeTab === 'Public Plans' && <PublicPlansModule plans={plans} />}
            {activeTab === 'Collections' && <CollectionsModule />}
          </View>

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

  profileTopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
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

  actionRow: { flexDirection: 'row', marginBottom: 24 },
  primaryActionBtn: { flex: 1, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginRight: 12 },
  primaryActionText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  secondaryActionBtn: { flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  secondaryActionText: { color: '#0f172a', fontSize: 15, fontWeight: '700' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 16, padding: 12, marginRight: 8 },
  statIconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#64748b' },

  tabsContainer: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 24 },
  tab: { paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', marginRight: 8 },
  tabActive: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#2563eb' },

  tabContentContainer: { flex: 1 }
});
