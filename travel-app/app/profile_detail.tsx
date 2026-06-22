import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/useAuthStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COVER_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
const PLAN_IMAGE = 'https://images.unsplash.com/photo-1596743343697-39b1cbcf7723?q=80&w=1000';

export default function ProfileScreen() {
  const session = useAuthStore(state => state.session);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Plans');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [session])
  );

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase
      .from('plans')
      .select('*')
      .limit(5);
    if (data) setPlans(data);
    setLoading(false);
  }

  const tabs = ['Posts', 'Plans', 'Collections', 'Reviews'];
  const filterPills = ['All', 'Trekking', 'Backpacking', 'Weekend'];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Cover Image */}
        <ImageBackground source={{ uri: COVER_IMAGE }} style={styles.coverImage}>
          <View style={styles.coverOverlay} />
          <View style={[styles.headerActions, { paddingTop: Math.max(insets.top, 16) }]}>
            <TouchableOpacity style={styles.iconCircleGlass} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.iconCircleGlass, { marginRight: 12 }]}>
                <Ionicons name="settings-outline" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircleGlass}>
                <Ionicons name="share-social-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Profile Info Card */}
        <View style={styles.profileSheet}>
          
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: AVATAR_IMAGE }} style={styles.avatar} />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
            </View>
          </View>

          <Text style={styles.nameText}>Arjun Kapoor</Text>
          <View style={styles.usernameRow}>
            <Text style={styles.usernameText}>@arjunkapoor_travels</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Ionicons name="location-outline" size={12} color="#64748b" />
            <Text style={styles.locationText}>Mumbai, India</Text>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageBtn}>
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.2K</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.filterByText}>Filter by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterPills.map((pill, idx) => (
              <TouchableOpacity key={pill} style={[styles.filterPill, idx === 0 && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, idx === 0 && styles.filterPillTextActive]}>{pill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List of Plans */}
        <View style={styles.plansList}>
          {plans.map((plan, idx) => (
            <TouchableOpacity key={idx} style={styles.wideCard} onPress={() => router.push(`/plans/${plan.id}`)}>
              <ImageBackground source={{ uri: plan.image_url || PLAN_IMAGE }} style={styles.wideCardImg} imageStyle={{ borderRadius: 16 }}>
                <View style={styles.wideCardOverlay} />
                <View style={styles.wideCardTop}>
                  <View style={[styles.cardBadge, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.cardBadgeText}>TREKKING</Text>
                  </View>
                  <Ionicons name="heart-outline" size={24} color="#fff" />
                </View>
                <View style={styles.wideCardBottom}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{plan.title || '(Plan Name)'}</Text>
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="calendar-outline" size={14} color="#fff" />
                    <Text style={styles.cardMetaText}>{plan.duration_days || 4} Days</Text>
                    <Ionicons name="star" size={14} color="#f59e0b" style={{ marginLeft: 16 }} />
                    <Text style={styles.cardMetaText}>4.9 (1.2K)</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {plans.length === 0 && (
            <View style={styles.wideCard}>
              <ImageBackground source={{ uri: PLAN_IMAGE }} style={styles.wideCardImg} imageStyle={{ borderRadius: 16 }}>
                <View style={styles.wideCardOverlay} />
                <View style={styles.wideCardTop}>
                  <View style={[styles.cardBadge, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.cardBadgeText}>TREKKING</Text>
                  </View>
                  <Ionicons name="heart-outline" size={24} color="#fff" />
                </View>
                <View style={styles.wideCardBottom}>
                  <Text style={styles.cardTitle}>Kedarkantha Trek</Text>
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="calendar-outline" size={14} color="#fff" />
                    <Text style={styles.cardMetaText}>4 Days</Text>
                    <Ionicons name="star" size={14} color="#f59e0b" style={{ marginLeft: 16 }} />
                    <Text style={styles.cardMetaText}>4.9 (1.2K)</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  coverImage: { width: '100%', height: 220 },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconCircleGlass: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },

  profileSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingHorizontal: 20, alignItems: 'center', paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatarRow: { marginTop: -50, marginBottom: 12 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  verifiedBadge: { position: 'absolute', bottom: 4, right: 4, width: 24, height: 24, backgroundColor: '#3b82f6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },

  nameText: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  usernameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  usernameText: { fontSize: 14, color: '#475569', fontWeight: '500' },
  dotSeparator: { fontSize: 14, color: '#94a3b8', marginHorizontal: 8 },
  locationText: { fontSize: 13, color: '#64748b', marginLeft: 4 },

  actionButtonsRow: { flexDirection: 'row', width: '100%', gap: 12, marginBottom: 24 },
  followBtn: { flex: 1, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  followBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  messageBtn: { flex: 1, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  messageBtnText: { color: '#0f172a', fontSize: 15, fontWeight: '700' },

  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 20 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  statDivider: { width: 1, height: 30, backgroundColor: '#e2e8f0' },

  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#2563eb' },

  filterSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  filterByText: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginRight: 12 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8 },
  filterPillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterPillText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterPillTextActive: { color: '#fff' },

  plansList: { paddingHorizontal: 20, paddingTop: 8 },
  wideCard: { width: '100%', height: 220, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  wideCardImg: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 16 },
  wideCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16 },
  wideCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cardBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  wideCardBottom: {},
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center' },
  cardMetaText: { fontSize: 13, fontWeight: '600', color: '#fff', marginLeft: 6 },
});
