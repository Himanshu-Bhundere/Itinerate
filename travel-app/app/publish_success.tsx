import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CELEBRATION_IMG = 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop';

export default function PublishSuccessScreen() {
  const { plan_id, plan_title } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={[s.logoRow, { paddingTop: Math.max(insets.top, 20) }]}>
          <Text style={s.logoText}>Itinerate</Text>
        </View>

        {/* Celebration Image */}
        <View style={s.celebrationContainer}>
          <ImageBackground
            source={{ uri: CELEBRATION_IMG }}
            style={s.celebrationImage}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={s.celebrationOverlay} />
            {[...Array(12)].map((_, i) => (
              <View
                key={i}
                style={[
                  s.confettiDot,
                  {
                    top: `${10 + Math.random() * 70}%`,
                    left: `${5 + Math.random() * 85}%`,
                    backgroundColor: ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'][i % 6],
                    width: 6 + Math.random() * 8,
                    height: 6 + Math.random() * 8,
                    transform: [{ rotate: `${Math.random() * 360}deg` }],
                  }
                ]}
              />
            ))}
          </ImageBackground>

          <View style={s.checkBadge}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={s.title}>Your itinerary is now live 🎉</Text>
        <Text style={s.subtitle}>Congratulations! Your travel plan has been{'\n'}published successfully.</Text>

        {/* Plan Info Card */}
        <View style={s.planCard}>
          <Image source={{ uri: CELEBRATION_IMG }} style={s.planCardImage} />
          <View style={s.planCardContent}>
            <Text style={s.planCardTitle} numberOfLines={1}>{plan_title || '(Plan Title)'}</Text>
            <View style={s.planCardMeta}>
              <Ionicons name="calendar-outline" size={12} color="#64748b" />
              <Text style={s.planCardMetaText}>Plan</Text>
              <Ionicons name="location-outline" size={12} color="#64748b" style={{ marginLeft: 8 }} />
              <Text style={s.planCardMetaText}>Destinations</Text>
            </View>
            <Text style={s.planCardDesc} numberOfLines={2}>A new travel plan just created and published by you.</Text>
            <View style={s.publicBadge}>
              <Ionicons name="globe-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={s.publicBadgeText}>PUBLIC</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.actions}>
          <TouchableOpacity style={s.viewPlanBtn} onPress={() => { if (plan_id) router.replace(`/plans/${plan_id}`); else router.replace('/(tabs)'); }}>
            <Ionicons name="eye-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={s.viewPlanText}>View Plan</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ position: 'absolute', right: 24 }} />
          </TouchableOpacity>

          <TouchableOpacity style={s.shareBtn}>
            <Ionicons name="share-social-outline" size={20} color="#10b981" style={{ marginRight: 8 }} />
            <Text style={s.shareBtnText}>Share Plan</Text>
            <Ionicons name="arrow-forward" size={18} color="#10b981" style={{ position: 'absolute', right: 24 }} />
          </TouchableOpacity>

          <TouchableOpacity style={s.createAnotherBtn} onPress={() => router.replace('/(tabs)/create')}>
            <Ionicons name="pencil-outline" size={20} color="#f97316" style={{ marginRight: 8 }} />
            <Text style={s.createAnotherText}>Create Another</Text>
            <Ionicons name="arrow-forward" size={18} color="#f97316" style={{ position: 'absolute', right: 24 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40 },

  logoRow: { alignItems: 'center', marginBottom: 16 },
  logoText: { fontSize: 24, fontWeight: '800', color: '#2563eb', fontStyle: 'italic' },

  celebrationContainer: { width: width - 40, height: 220, marginBottom: 8, position: 'relative' },
  celebrationImage: { width: '100%', height: '100%' },
  celebrationOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24 },
  confettiDot: { position: 'absolute', borderRadius: 2 },
  checkBadge: { position: 'absolute', bottom: -24, alignSelf: 'center', width: 56, height: 56, borderRadius: 28, backgroundColor: '#14b8a6', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#f8fafc', shadowColor: '#14b8a6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },

  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginTop: 32, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  planCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 12, width: '100%', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 28 },
  planCardImage: { width: 90, height: 90, borderRadius: 16 },
  planCardContent: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  planCardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  planCardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  planCardMetaText: { fontSize: 11, color: '#64748b', marginLeft: 4 },
  planCardDesc: { fontSize: 12, color: '#64748b', lineHeight: 16, marginBottom: 8 },
  publicBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  publicBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  actions: { width: '100%' },
  viewPlanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#14b8a6', height: 52, borderRadius: 16, marginBottom: 12, position: 'relative' },
  viewPlanText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: '#10b981', marginBottom: 12, position: 'relative' },
  shareBtnText: { color: '#10b981', fontSize: 16, fontWeight: '700' },
  createAnotherBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: '#f97316', position: 'relative' },
  createAnotherText: { color: '#f97316', fontSize: 16, fontWeight: '700' },
});
