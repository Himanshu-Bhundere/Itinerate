import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');
const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
const ROBOT_IMG = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'; // fallback for the 3D element

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const session = useAuthStore(state => state.session);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const SettingsItem = ({ icon, label, value, isDestructive }: any) => (
    <TouchableOpacity style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={20} color={isDestructive ? '#ef4444' : '#64748b'} style={{ marginRight: 12 }} />
        <Text style={[styles.settingsItemLabel, isDestructive && { color: '#ef4444' }]}>{label}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsItemValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="search" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Profile Banner */}
        <TouchableOpacity style={styles.bannerContainer} onPress={() => router.push('/profile_detail')}>
          {/* Note: since we can't be sure expo-linear-gradient is installed perfectly or causes crash, we will use a solid view mimicking a gradient if it fails, or just standard view. Actually standard View with background color is safer, but UI wants gradient. We will use a purple background view to be safe from crashes. */}
          <View style={styles.bannerBackground}>
            <Image source={{ uri: ROBOT_IMG }} style={styles.bannerDecorImage} />
            
            <View style={styles.bannerBadge}>
              <Ionicons name="star" size={10} color="#ca8a04" />
              <Text style={styles.bannerBadgeText}>ITINERATE PLUS</Text>
            </View>

            <View style={styles.bannerProfileRow}>
              <Image source={{ uri: AVATAR_IMG }} style={styles.bannerAvatar} />
              <View style={styles.bannerProfileInfo}>
                <Text style={styles.bannerName}>Arjun Kapoor</Text>
                <Text style={styles.bannerUsername}>@arjunkapoor_travels</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.cardGroup}>
            <SettingsItem icon="cash-outline" label="Currency" value="INR (₹)" />
            <View style={styles.divider} />
            <SettingsItem icon="globe-outline" label="Language" value="English" />
            <View style={styles.divider} />
            <SettingsItem icon="notifications-outline" label="Notifications" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscriptions & Payments</Text>
          <View style={styles.cardGroup}>
            <SettingsItem icon="card-outline" label="Payment Methods" />
            <View style={styles.divider} />
            <SettingsItem icon="receipt-outline" label="Billing History" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.cardGroup}>
            <SettingsItem icon="help-circle-outline" label="FAQ" />
            <View style={styles.divider} />
            <SettingsItem icon="chatbubbles-outline" label="Contact Us" />
            <View style={styles.divider} />
            <SettingsItem icon="document-text-outline" label="Privacy Policy" />
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#0f172a' },
  headerIconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },

  bannerContainer: { marginHorizontal: 20, marginBottom: 24, borderRadius: 24, overflow: 'hidden' },
  bannerBackground: { backgroundColor: '#6366f1', padding: 20, position: 'relative' },
  bannerDecorImage: { position: 'absolute', top: -10, right: -10, width: 120, height: 120, opacity: 0.8, borderRadius: 60 },
  bannerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef08a', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 24 },
  bannerBadgeText: { fontSize: 9, fontWeight: '800', color: '#854d0e', marginLeft: 4 },
  bannerProfileRow: { flexDirection: 'row', alignItems: 'center' },
  bannerAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },
  bannerProfileInfo: { flex: 1, marginLeft: 12 },
  bannerName: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 2 },
  bannerUsername: { fontSize: 13, color: '#e0e7ff' },
  viewProfileText: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 12 },

  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', marginBottom: 12, marginLeft: 8 },
  cardGroup: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16 },
  
  settingsItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsItemLabel: { fontSize: 15, fontWeight: '500', color: '#0f172a' },
  settingsItemRight: { flexDirection: 'row', alignItems: 'center' },
  settingsItemValue: { fontSize: 14, color: '#64748b', marginRight: 8 },
  divider: { height: 1, backgroundColor: '#f1f5f9', width: '100%' },

  signOutBtn: { marginHorizontal: 20, backgroundColor: '#fef2f2', paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginTop: 12 },
  signOutBtnText: { color: '#ef4444', fontSize: 15, fontWeight: '700' },
});
