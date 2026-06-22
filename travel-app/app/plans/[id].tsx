import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    fetchPlan();
  }, [id]);

  async function fetchPlan() {
    if (!id) return;
    const { data, error } = await supabase
      .from('plans')
      .select('*, profiles(display_name, avatar_url)')
      .eq('id', id)
      .single();
      
    if (data) setPlan(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const tabs = ['Overview', 'Itinerary', 'Map', 'Reviews'];
  const highlights = [
    { icon: 'image', text: 'Stunning Summit Views' },
    { icon: 'leaf', text: 'Snow Covered Trails', color: '#10b981' },
    { icon: 'camera', text: 'Perfect for Beginners', color: '#0ea5e9' },
    { icon: 'bonfire', text: 'Cozy Camps & Local Food', color: '#f97316' },
  ];

  const included = [
    { icon: 'bed-outline', label: 'Stay' },
    { icon: 'restaurant-outline', label: 'Meals' },
    { icon: 'person-outline', label: 'Guide' },
    { icon: 'document-text-outline', label: 'Permits' },
    { icon: 'medkit-outline', label: 'First Aid', color: '#ef4444' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <ImageBackground source={{ uri: plan?.image_url || DEFAULT_IMAGE }} style={styles.heroImage}>
          <View style={styles.heroOverlay} />
          
          {/* Top Actions */}
          <View style={[styles.topActions, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                style={styles.iconCircle}
                onPress={() => router.push({ pathname: '/modal', params: { plan_id: id } })}
              >
                <Ionicons name="heart-outline" size={22} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconCircle, { marginLeft: 12 }]}>
                <Ionicons name="copy-outline" size={20} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconCircle, { marginLeft: 12 }]}>
                <Ionicons name="share-outline" size={22} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.tagBadge}>
              <Ionicons name="walk" size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.tagText}>{plan?.category?.toUpperCase() || 'TREKKING'}</Text>
            </View>
            <Text style={styles.heroTitle}>{plan?.title || '(Plan Title)'}</Text>
            
            <View style={styles.heroMetaRow}>
              <Ionicons name="calendar-outline" size={14} color="#fff" />
              <Text style={styles.heroMetaText}>{plan?.duration_days || 4} Days</Text>
              <MaterialCommunityIcons name="currency-inr" size={14} color="#fff" style={{ marginLeft: 16 }} />
              <Text style={styles.heroMetaText}>7,500 per person</Text>
              <Ionicons name="star" size={14} color="#f59e0b" style={{ marginLeft: 16 }} />
              <Text style={styles.heroMetaText}>4.9 (1.2K reviews)</Text>
            </View>

            <View style={styles.heroAvatarRow}>
              <View style={styles.avatarPile}>
                {[1,2,3].map((i) => <Image key={i} source={{ uri: AVATAR_IMG }} style={[styles.pileAvatar, { zIndex: 10-i, marginLeft: i===1?0:-12 }]} />)}
              </View>
              <Text style={styles.heroAuthorText}>12K+ saves  •  by {plan?.profiles?.display_name || 'Ankit Sharma'}</Text>
              <Ionicons name="checkmark-circle" size={14} color="#3b82f6" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </ImageBackground>

        {/* Content Sheet */}
        <View style={styles.contentSheet}>
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Pillars */}
          <View style={styles.pillarsContainer}>
            <View style={styles.pillar}>
              <Ionicons name="partly-sunny-outline" size={24} color="#94a3b8" />
              <Text style={styles.pillarTitle}>Best Season</Text>
              <Text style={styles.pillarValue}>Dec - Apr</Text>
            </View>
            <View style={styles.pillar}>
              <Ionicons name="trending-up-outline" size={24} color="#94a3b8" />
              <Text style={styles.pillarTitle}>Trek Difficulty</Text>
              <Text style={styles.pillarValue}>Moderate</Text>
            </View>
            <View style={styles.pillar}>
              <Ionicons name="analytics-outline" size={24} color="#94a3b8" />
              <Text style={styles.pillarTitle}>Max Altitude</Text>
              <Text style={styles.pillarValue}>12,500 ft</Text>
            </View>
            <View style={styles.pillar}>
              <Ionicons name="swap-horizontal-outline" size={24} color="#94a3b8" />
              <Text style={styles.pillarTitle}>Trek Distance</Text>
              <Text style={styles.pillarValue}>20 km</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this trek</Text>
            <Text style={styles.aboutText}>
              {plan?.description || 'Kedarkantha is one of the most popular winter treks in India, known for its stunning summit views, snow-covered trails, and serene landscapes.'}
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={styles.readMore}>Read more</Text>
              <Ionicons name="chevron-down" size={14} color="#2563eb" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              {highlights.map((h, i) => (
                <View key={i} style={styles.highlightBox}>
                  <View style={styles.highlightIcon}>
                    <Ionicons name={h.icon as any} size={24} color={h.color || '#3b82f6'} />
                  </View>
                  <Text style={styles.highlightText}>{h.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* What's included */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's included</Text>
            <View style={styles.includedBox}>
              {included.map((item, i) => (
                <View key={i} style={styles.includedItem}>
                  <View style={[styles.includedIconWrapper, item.color && { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color || '#64748b'} />
                  </View>
                  <Text style={styles.includedText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerPriceCol}>
          <Text style={styles.footerPrice}>₹7,500</Text>
          <Text style={styles.footerPerPerson}>per person</Text>
        </View>
        <TouchableOpacity style={styles.footerBtn}>
          <Text style={styles.footerBtnText}>View Itinerary</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  heroImage: { width: width, height: height * 0.55, justifyContent: 'space-between' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  
  topActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },

  heroContent: { paddingHorizontal: 20, paddingBottom: 60, paddingTop: 100 },
  tagBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 12, lineHeight: 36 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroMetaText: { color: '#fff', fontSize: 13, fontWeight: '500', marginLeft: 6 },
  heroAvatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatarPile: { flexDirection: 'row', marginRight: 12 },
  pileAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#1e293b' },
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
  readMore: { fontSize: 14, fontWeight: '600', color: '#2563eb' },

  highlightBox: { width: 120, height: 120, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 16, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  highlightIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  highlightText: { fontSize: 11, fontWeight: '600', color: '#334155', textAlign: 'center' },

  includedBox: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#f8fafc', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  includedItem: { flexDirection: 'row', alignItems: 'center', width: '33%', marginBottom: 16 },
  includedIconWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  includedText: { fontSize: 12, fontWeight: '500', color: '#475569' },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, borderTopWidth: 1, borderTopColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 10 },
  footerPriceCol: { flex: 1 },
  footerPrice: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  footerPerPerson: { fontSize: 12, color: '#64748b' },
  footerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
  footerBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
