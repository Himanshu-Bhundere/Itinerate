import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PLAN_IMAGE = 'https://images.unsplash.com/photo-1596743343697-39b1cbcf7723?q=80&w=1000';

export function OverviewModule({ profile, plans }: { profile: any; plans: any[] }) {
  return (
    <View style={s.sectionContainer}>
      <Text style={[s.sectionTitle, { marginBottom: 16 }]}>About</Text>
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
              <Text style={s.aboutItemSub}>
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : '(Unknown)'}
              </Text>
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
    </View>
  );
}

export function TravelStatisticsModule({ profile, plans }: { profile: any; plans: any[] }) {
  return (
    <View style={s.sectionContainer}>
      <Text style={[s.sectionTitle, { marginBottom: 16 }]}>Travel Stats</Text>
      <View style={s.statsGrid}>
        <View style={s.statBox}>
          <Text style={s.statBoxTitle}>Countries</Text>
          <Text style={s.statBoxValue}>{profile?.countries_visited || 0}</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statBoxTitle}>Cities</Text>
          <Text style={s.statBoxValue}>{profile?.cities_visited || 0}</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statBoxTitle}>Trips</Text>
          <Text style={s.statBoxValue}>{plans.length || 0}</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statBoxTitle}>Treks</Text>
          <Text style={s.statBoxValue}>{profile?.treks_completed || 0}</Text>
        </View>
      </View>
    </View>
  );
}

export function PublicPlansModule({ plans }: { plans: any[] }) {
  const router = useRouter();
  
  return (
    <View style={s.sectionContainer}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Public Plans</Text>
        <TouchableOpacity>
          <Text style={s.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
        {plans.length === 0 ? (
          <View style={{ width: width - 48, alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="map-outline" size={48} color="#cbd5e1" />
            <Text style={{ marginTop: 12, color: '#64748b', fontWeight: '500' }}>No plans created yet.</Text>
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
    </View>
  );
}

export function CollectionsModule() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
      <Ionicons name="albums-outline" size={48} color="#cbd5e1" />
      <Text style={{ marginTop: 12, color: '#64748b', fontWeight: '500' }}>Collections coming soon</Text>
    </View>
  );
}

const s = StyleSheet.create({
  sectionContainer: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },

  aboutContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  aboutList: { flex: 1, marginRight: 16 },
  aboutItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  aboutIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  aboutItemTitle: { fontSize: 13, color: '#0f172a', fontWeight: '600', marginBottom: 2 },
  aboutItemSub: { fontSize: 12, color: '#64748b' },
  mapThumbnail: { width: 120, height: 160, borderRadius: 16, backgroundColor: '#e0f2fe', overflow: 'hidden' },
  mapOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(224, 242, 254, 0.5)' },
  mapLabel: { position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mapLabelText: { fontSize: 10, fontWeight: '600', color: '#0f172a' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
  statBoxTitle: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  statBoxValue: { fontSize: 24, fontWeight: '800', color: '#0f172a' },

  planCard: { width: 240, marginRight: 16, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  planImageContainer: { width: '100%', height: 140, borderRadius: 16, padding: 12, justifyContent: 'space-between', flexDirection: 'row', overflow: 'hidden' },
  planImage: { ...StyleSheet.absoluteFill as any, borderRadius: 16 },
  planBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  planBadgeText: { fontSize: 10, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  bookmarkBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  planContent: { padding: 12 },
  planTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  planTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0f172a', marginRight: 8 },
  planMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  planMetaText: { fontSize: 11, color: '#64748b', marginLeft: 4, marginRight: 4 },
});
