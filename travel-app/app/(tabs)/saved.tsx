import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 2 columns with padding
const PLAN_IMAGE = 'https://images.unsplash.com/photo-1596743343697-39b1cbcf7723?q=80&w=1000';

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Plans');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useAuthStore(state => state.session);

  React.useEffect(() => {
    fetchPlans();
  }, [session]);

  async function fetchPlans() {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('saved_plans')
      .select('*, plans(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setPlans(data.map(d => d.plans).filter(Boolean));
    }
    setLoading(false);
  }

  const mainTabs = [
    { id: 'Plans', icon: 'bookmark' },
    { id: 'Places', icon: 'location-outline' },
    { id: 'Collections', icon: 'layers-outline' },
    { id: 'Downloads', icon: 'download-outline' }
  ];

  const filterPills = [
    { id: 'All Saved', count: 42, active: true },
    { id: 'Dreaming', count: 18, active: false, icon: 'cloud-outline' },
    { id: 'Planning', count: 16, active: false, icon: 'calendar-outline' },
    { id: 'Booked', count: 8, active: false, icon: 'checkmark-circle-outline' },
  ];

  const collections = [
    { title: 'Goa Wishlist', items: 12 },
    { title: 'Maharashtra Treks', items: 18 },
    { title: 'Bucket List', items: 24 },
    { title: 'Weekend Getaway', items: 8 },
  ];

  const CollectionCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.collectionCard}>
      <ImageBackground source={{ uri: PLAN_IMAGE }} style={styles.collectionImg} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.collectionOverlay} />
        <View style={styles.collectionTop}><Ionicons name="ellipsis-horizontal" size={20} color={Colors.white} /></View>
        <View style={styles.collectionBottom}>
          <View>
            <Text style={styles.collectionTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.collectionItems}>{item.items} items</Text>
          </View>
          <View style={styles.collectionBookmark}><Ionicons name="bookmark" size={16} color={Colors.primaryText} /></View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const RecentSaveItem = ({ title, col, time }: any) => (
    <TouchableOpacity style={styles.recentItem}>
      <Image source={{ uri: PLAN_IMAGE }} style={styles.recentImg} />
      <View style={styles.recentInfo}>
        <Text style={styles.recentTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.recentSavedTo}>Saved to</Text>
        <View style={styles.recentColRow}>
          <Ionicons name="folder-outline" size={12} color={Colors.blue500} />
          <Text style={styles.recentColText}>{col}</Text>
        </View>
        <Text style={styles.recentTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );

  const PlanCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.planCard} onPress={() => router.push(`/plans/${item.id}`)}>
      <ImageBackground source={{ uri: item.image_url || PLAN_IMAGE }} style={styles.planImg} imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <View style={styles.planOverlay} />
        <View style={styles.planTopRow}>
          <View style={styles.planTag}><Text style={styles.planTagText}>TREKKING</Text></View>
          <View style={styles.planBookmark}><Ionicons name="bookmark" size={18} color={Colors.primaryText} /></View>
        </View>
        <View style={styles.planColBadgeRow}>
          <View style={styles.planColBadge}>
            <Ionicons name="folder" size={12} color={Colors.blue500} style={{ marginRight: 4 }} />
            <Text style={styles.planColBadgeText}>Maharashtra Treks</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.planContent}>
        <View style={styles.planHeaderRow}>
          <Text style={styles.planTitle} numberOfLines={1}>{item.title || '(Image of trek)'}</Text>
          <Ionicons name="ellipsis-vertical" size={18} color={Colors.secondaryText} />
        </View>
        <View style={styles.planMetaRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.secondaryText} />
          <Text style={styles.planMetaText}>{item.duration_days || 4} Days</Text>
          <Ionicons name="person-outline" size={12} color={Colors.secondaryText} style={{ marginLeft: 8 }} />
          <Text style={styles.planMetaText} numberOfLines={1}>{item.location || 'Uttarakhand'}</Text>
        </View>
        <View style={styles.planBottomRow}>
          <View style={styles.planRatingRow}>
            <Ionicons name="star" size={12} color={Colors.orange500} />
            <Text style={styles.planRatingText}>4.9 (1.2K)</Text>
          </View>
          <Text style={styles.planPrice}>₹7,500 per person</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 20), paddingBottom: 140 }}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Saved</Text>
            <Text style={styles.headerSub}>All your saved trips, places and collections</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconBtn}><Ionicons name="search" size={20} color={Colors.primaryText} /></TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}><Ionicons name="options-outline" size={20} color={Colors.primaryText} /></TouchableOpacity>
          </View>
        </View>

        {/* Main Tabs */}
        <View style={styles.mainTabs}>
          {mainTabs.map(tab => (
            <TouchableOpacity key={tab.id} style={[styles.mainTab, activeTab === tab.id && styles.mainTabActive]} onPress={() => setActiveTab(tab.id)}>
              <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.id ? Colors.blue500 : Colors.secondaryText} />
              <Text style={[styles.mainTabText, activeTab === tab.id && styles.mainTabTextActive]}>{tab.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 24 }}>
          {filterPills.map(pill => (
            <TouchableOpacity key={pill.id} style={[styles.filterPill, pill.active && styles.filterPillActive]}>
              {pill.icon && <Ionicons name={pill.icon as any} size={14} color={Colors.secondaryText} style={{ marginRight: 6 }} />}
              <Text style={[styles.filterPillText, pill.active && styles.filterPillTextActive]}>{pill.id}</Text>
              <View style={[styles.filterCountBadge, pill.active && { backgroundColor: '#bfdbfe' }]}>
                <Text style={[styles.filterCountText, pill.active && { color: Colors.blue500 }]}>{pill.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* My Collections */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Collections</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View all {'>'}</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {collections.map((col, idx) => <CollectionCard key={idx} item={col} />)}
        </ScrollView>

        {/* Organize Banner */}
        <View style={styles.organizeBanner}>
          <Ionicons name="sparkles-outline" size={24} color={Colors.blue500} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.organizeTitle}>Organize better, travel smarter</Text>
            <Text style={styles.organizeSub}>Create collections to keep your saved plans organized</Text>
          </View>
          <TouchableOpacity style={styles.newColBtn}>
            <Ionicons name="add" size={16} color={Colors.blue500} />
            <Text style={styles.newColBtnText}>New Collection</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Saved */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Saved</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View all {'>'}</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <RecentSaveItem title="Kedarkantha Trek" col="Maharashtra Treks" time="2h ago" />
          <RecentSaveItem title="Andaman Escape" col="Goa Wishlist" time="5h ago" />
          <RecentSaveItem title="Spiti Valley Road Trip" col="Bucket List" time="1d ago" />
        </ScrollView>

        {/* Saved Plans List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Plans</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>Select</Text></TouchableOpacity>
        </View>
        <View style={styles.plansGrid}>
          {plans.map((p, idx) => <PlanCard key={idx} item={p} />)}
          {plans.length === 0 && <PlanCard item={{ title: 'Kedarkantha Trek' }} />}
          {plans.length === 0 && <PlanCard item={{ title: 'Andaman Escape' }} />}
        </View>

      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="folder-outline" size={20} color={Colors.blue500} />
          <Text style={[styles.actionBtnText, { color: Colors.blue500 }]}>Move to Collection</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="download-outline" size={20} color={Colors.teal500} />
          <Text style={[styles.actionBtnText, { color: Colors.teal500 }]}>Download</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="archive-outline" size={20} color={Colors.orange500} />
          <Text style={[styles.actionBtnText, { color: Colors.orange500 }]}>Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  
  header: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: Colors.primaryText },
  headerSub: { fontSize: 13, color: Colors.secondaryText, marginTop: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'flex-start' },
  headerIconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', marginLeft: 12, borderWidth: 1, borderColor: Colors.divider },

  mainTabs: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: Colors.white, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: Colors.divider, marginBottom: 20 },
  mainTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  mainTabActive: { backgroundColor: Colors.surface, borderBottomWidth: 2, borderBottomColor: Colors.blue500 },
  mainTabText: { fontSize: 13, fontWeight: '600', color: Colors.secondaryText, marginLeft: 6 },
  mainTabTextActive: { color: Colors.blue500 },

  filterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingLeft: 16, paddingRight: 8, paddingVertical: 8, borderRadius: 24, borderWidth: 1, borderColor: Colors.divider, marginRight: 12 },
  filterPillActive: { borderColor: '#bfdbfe', backgroundColor: Colors.blue50 },
  filterPillText: { fontSize: 13, fontWeight: '600', color: Colors.primaryText, marginRight: 8 },
  filterPillTextActive: { color: Colors.blue500 },
  filterCountBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  filterCountText: { fontSize: 11, fontWeight: '700', color: Colors.secondaryText },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 16, marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primaryText },
  viewAllText: { fontSize: 13, fontWeight: '600', color: Colors.blue500 },

  collectionCard: { width: 140, height: 160, marginRight: 16 },
  collectionImg: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 12 },
  collectionOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16 },
  collectionTop: { alignItems: 'flex-end' },
  collectionBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  collectionTitle: { color: Colors.white, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  collectionItems: { color: Colors.divider, fontSize: 11 },
  collectionBookmark: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },

  organizeBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider },
  organizeTitle: { fontSize: 14, fontWeight: '700', color: Colors.primaryText },
  organizeSub: { fontSize: 11, color: Colors.secondaryText, marginTop: 2 },
  newColBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#bfdbfe' },
  newColBtnText: { fontSize: 12, fontWeight: '600', color: Colors.blue500, marginLeft: 4 },

  recentItem: { flexDirection: 'row', alignItems: 'center', width: 220, padding: 8, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, marginRight: 16 },
  recentImg: { width: 64, height: 64, borderRadius: 12 },
  recentInfo: { flex: 1, marginLeft: 12 },
  recentTitle: { fontSize: 13, fontWeight: '700', color: Colors.primaryText, marginBottom: 2 },
  recentSavedTo: { fontSize: 10, color: Colors.secondaryText },
  recentColRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  recentColText: { fontSize: 11, fontWeight: '600', color: Colors.blue500, marginLeft: 4 },
  recentTime: { fontSize: 10, color: Colors.placeholder, marginTop: 4 },

  plansGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  planCard: { width: CARD_WIDTH, backgroundColor: Colors.white, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  planImg: { width: '100%', height: 120, justifyContent: 'space-between' },
  planOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(0,0,0,0.2)', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  planTopRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 8 },
  planTag: { backgroundColor: Colors.teal500, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  planTagText: { color: Colors.white, fontSize: 9, fontWeight: '800' },
  planBookmark: { width: 32, height: 32, backgroundColor: Colors.white, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  planColBadgeRow: { padding: 8 },
  planColBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  planColBadgeText: { fontSize: 10, fontWeight: '600', color: Colors.secondaryText },
  planContent: { padding: 12 },
  planHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  planTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.primaryText, marginRight: 4 },
  planMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  planMetaText: { fontSize: 11, color: Colors.secondaryText, marginLeft: 4 },
  planBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' },
  planRatingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  planRatingText: { fontSize: 11, fontWeight: '600', color: Colors.secondaryText, marginLeft: 4 },
  planPrice: { fontSize: 12, fontWeight: '700', color: Colors.primaryText, width: '100%' },

  bottomActionBar: { position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: Colors.white, height: 64, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, borderWidth: 1, borderColor: Colors.divider },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
  actionDivider: { width: 1, height: 24, backgroundColor: Colors.divider },
});
