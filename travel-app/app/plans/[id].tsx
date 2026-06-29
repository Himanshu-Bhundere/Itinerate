import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

const { width, height } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSaved, setIsSaved] = useState(false);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      checkIfSaved();
    }, [id, session])
  );

  async function checkIfSaved() {
    if (!id || !session?.user?.id) return;
    const { data } = await supabase
      .from('saved_plans')
      .select('id')
      .eq('plan_id', id)
      .eq('user_id', session.user.id)
      .single();
    if (data) setIsSaved(true);
  }

  async function handleToggleSave() {
    if (!session?.user?.id) return;
    if (isSaved) {
      await supabase
        .from('saved_plans')
        .delete()
        .eq('plan_id', id)
        .eq('user_id', session.user.id);
      setIsSaved(false);
    } else {
      router.push({ pathname: '/modal', params: { plan_id: id } });
    }
  }

  async function fetchPlan() {
    if (!id) return;
    const { data } = await supabase
      .from('plans')
      .select('*, profiles(display_name, avatar_url)')
      .eq('id', id)
      .single();

    if (data) setPlan(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Ionicons name="alert-circle-outline" size={48} color="#cbd5e1" />
        <Text style={{ marginTop: 12, color: '#64748b', fontSize: 16 }}>Plan not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#2563eb', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tabs = ['Overview', 'Itinerary', 'Map', 'Reviews'];

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Hero Image */}
        <ImageBackground source={{ uri: plan.image_url || DEFAULT_IMAGE }} style={s.heroImage}>
          <View style={s.heroOverlay} />

          {/* Top Actions - no bar, just floating circles */}
          <View style={[s.topActions, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity style={s.iconCircle} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={s.iconCircle}
                onPress={handleToggleSave}
              >
                <Ionicons name={isSaved ? "heart" : "heart-outline"} size={22} color={isSaved ? "#ef4444" : "#0f172a"} />
              </TouchableOpacity>
              <TouchableOpacity style={[s.iconCircle, { marginLeft: 12 }]}>
                <Ionicons name="copy-outline" size={20} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity style={[s.iconCircle, { marginLeft: 12 }]}>
                <Ionicons name="share-outline" size={22} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Content */}
          <View style={s.heroContent}>
            {plan.category && (
              <View style={s.tagBadge}>
                <Ionicons name="walk" size={12} color="#fff" style={{ marginRight: 4 }} />
                <Text style={s.tagText}>{plan.category.toUpperCase()}</Text>
              </View>
            )}
            <Text style={s.heroTitle}>{plan.title}</Text>

            <View style={s.heroMetaRow}>
              {plan.duration_days && (
                <>
                  <Ionicons name="calendar-outline" size={14} color="#fff" />
                  <Text style={s.heroMetaText}>{plan.duration_days} Days</Text>
                </>
              )}
              {plan.budget_level && plan.budget_level !== 'not-set' && (
                <>
                  <Text style={[s.heroMetaText, { marginLeft: 16 }]}>₹ {plan.budget_level}</Text>
                </>
              )}
            </View>

            <View style={s.heroAvatarRow}>
              <Text style={s.heroAuthorText}>by {plan.profiles?.display_name || 'Unknown'}</Text>
              {plan.profiles?.display_name && (
                <Ionicons name="checkmark-circle" size={14} color="#3b82f6" style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>
        </ImageBackground>

        {/* Content Sheet */}
        <View style={s.contentSheet}>

          {/* Tabs */}
          <View style={s.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} style={[s.tabBtn, activeTab === tab && s.tabBtnActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Pillars - show only what's available */}
          <View style={s.pillarsContainer}>
            <View style={s.pillar}>
              <Ionicons name="partly-sunny-outline" size={24} color="#94a3b8" />
              <Text style={s.pillarTitle}>Best Season</Text>
              <Text style={s.pillarValue}>{plan.best_season || '(Not set)'}</Text>
            </View>
            <View style={s.pillar}>
              <Ionicons name="trending-up-outline" size={24} color="#94a3b8" />
              <Text style={s.pillarTitle}>Difficulty</Text>
              <Text style={s.pillarValue}>{plan.difficulty || '(Not set)'}</Text>
            </View>
            <View style={s.pillar}>
              <Ionicons name="analytics-outline" size={24} color="#94a3b8" />
              <Text style={s.pillarTitle}>Location</Text>
              <Text style={s.pillarValue} numberOfLines={1}>{plan.location || '(Not set)'}</Text>
            </View>
            <View style={s.pillar}>
              <Ionicons name="swap-horizontal-outline" size={24} color="#94a3b8" />
              <Text style={s.pillarTitle}>Duration</Text>
              <Text style={s.pillarValue}>{plan.duration_days ? `${plan.duration_days} days` : '(Not set)'}</Text>
            </View>
          </View>

          {/* About */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>About this trip</Text>
            <Text style={s.aboutText}>
              {plan.description || '(No description provided yet. The creator can add details about this trip.)'}
            </Text>
          </View>

          {/* Highlights - only show section if data exists */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Highlights</Text>
            <Text style={s.placeholderText}>(Highlights will appear here once the creator adds them)</Text>
          </View>

          {/* What's Included */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>What's included</Text>
            <Text style={s.placeholderText}>(Inclusions will appear here once the creator adds them)</Text>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[s.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={s.footerPriceCol}>
          <Text style={s.footerPrice}>{plan.budget_level && plan.budget_level !== 'not-set' ? `₹${plan.budget_level}` : '(Price not set)'}</Text>
          {plan.budget_level && plan.budget_level !== 'not-set' && <Text style={s.footerPerPerson}>per person</Text>}
        </View>
        <TouchableOpacity style={s.footerBtn}>
          <Text style={s.footerBtnText}>View Itinerary</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  heroImage: { width: width, height: height * 0.55, justifyContent: 'flex-end' },
  heroOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(0,0,0,0.3)' },

  topActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },

  heroContent: { paddingHorizontal: 20, paddingBottom: 60, paddingTop: 100 },
  tagBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 12, lineHeight: 36 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroMetaText: { color: '#fff', fontSize: 13, fontWeight: '500', marginLeft: 6 },
  heroAvatarRow: { flexDirection: 'row', alignItems: 'center' },
  heroAuthorText: { color: '#e2e8f0', fontSize: 13, fontWeight: '500' },

  contentSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -40, paddingHorizontal: 20, paddingBottom: 40 },

  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginTop: 8 },
  tabBtn: { paddingVertical: 16, paddingHorizontal: 12 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#2563eb' },

  pillarsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  pillar: { alignItems: 'center', flex: 1 },
  pillarTitle: { fontSize: 11, color: '#64748b', marginTop: 8, marginBottom: 2, textAlign: 'center' },
  pillarValue: { fontSize: 12, fontWeight: '700', color: '#0f172a', textAlign: 'center' },

  section: { marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  aboutText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  placeholderText: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic', lineHeight: 20 },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 10 },
  footerPriceCol: { flex: 1 },
  footerPrice: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  footerPerPerson: { fontSize: 12, color: '#64748b' },
  footerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
  footerBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
