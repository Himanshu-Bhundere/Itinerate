import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/tokens';


const { width } = Dimensions.get('window');
const AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
const ROBOT_IMG = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'; // fallback for the 3D element

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((state: any) => state.session);
  const profile = useAuthStore((state: any) => state.profile);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const displayName = profile?.display_name || session?.user?.email?.split('@')[0] || 'Traveler';
  const username = profile?.username ? `@${profile.username}` : '@traveler';
  const avatar = profile?.avatar_url || AVATAR_IMG;

  const SettingsItem = ({ icon, label, value, isDestructive }: any) => (
    <TouchableOpacity style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={20} color={isDestructive ? Colors.danger : Colors.secondaryText} style={{ marginRight: 12 }} />
        <Text style={[styles.settingsItemLabel, isDestructive && { color: Colors.danger }]}>{label}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsItemValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={Colors.disabledText} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Profile Banner */}
        <TouchableOpacity style={styles.bannerContainer} onPress={() => router.back()}>
          {/* Note: since we can't be sure expo-linear-gradient is installed perfectly or causes crash, we will use a solid view mimicking a gradient if it fails, or just standard view. Actually standard View with background color is safer, but UI wants gradient. We will use a purple background view to be safe from crashes. */}
          <View style={styles.bannerBackground}>
            <Image source={{ uri: ROBOT_IMG }} style={styles.bannerDecorImage} />
            
            <View style={styles.bannerBadge}>
              <Ionicons name="star" size={10} color="#ca8a04" />
              <Text style={styles.bannerBadgeText}>ITINERATE PLUS</Text>
            </View>

            <View style={styles.bannerProfileRow}>
              <Image source={{ uri: avatar }} style={styles.bannerAvatar} />
              <View style={styles.bannerProfileInfo}>
                <Text style={styles.bannerName}>{displayName}</Text>
                <Text style={styles.bannerUsername}>{username}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.white} />
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
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: Colors.primaryText },
  headerIconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.divider },

  bannerContainer: { marginHorizontal: 20, marginBottom: 24, borderRadius: 24, overflow: 'hidden' },
  bannerBackground: { backgroundColor: Colors.blue500, padding: 20, position: 'relative' },
  bannerDecorImage: { position: 'absolute', top: -10, right: -10, width: 120, height: 120, opacity: 0.8, borderRadius: 60 },
  bannerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef08a', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 24 },
  bannerBadgeText: { fontSize: 9, fontWeight: '800', color: '#854d0e', marginLeft: 4 },
  bannerProfileRow: { flexDirection: 'row', alignItems: 'center' },
  bannerAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.white },
  bannerProfileInfo: { flex: 1, marginLeft: 12 },
  bannerName: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  bannerUsername: { fontSize: 13, color: '#e0e7ff' },
  viewProfileText: { color: Colors.white, fontSize: 13, fontWeight: '600', marginTop: 12 },

  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.secondaryText, marginBottom: 12, marginLeft: 8 },
  cardGroup: { backgroundColor: Colors.white, borderRadius: 20, borderWidth: 1, borderColor: Colors.divider, paddingHorizontal: 16 },
  
  settingsItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsItemLabel: { fontSize: 15, fontWeight: '500', color: Colors.primaryText },
  settingsItemRight: { flexDirection: 'row', alignItems: 'center' },
  settingsItemValue: { fontSize: 14, color: Colors.secondaryText, marginRight: 8 },
  divider: { height: 1, backgroundColor: '#f1f5f9', width: '100%' },

  signOutBtn: { marginHorizontal: 20, backgroundColor: '#fef2f2', paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginTop: 12 },
  signOutBtnText: { color: Colors.danger, fontSize: 15, fontWeight: '700' },
});
