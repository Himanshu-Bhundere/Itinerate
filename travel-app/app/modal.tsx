import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

const { width } = Dimensions.get('window');

const IMG_DREAMING = 'https://images.unsplash.com/photo-1506905925224-2104eb0175b3?q=80&w=1000';
const IMG_PLANNING = 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000';
const IMG_BOOKED = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000';

export default function SaveIntentModal() {
  const { plan_id } = useLocalSearchParams();
  const router = useRouter();
  const session = useAuthStore(state => state.session);
  const [loading, setLoading] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const intents = [
    {
      id: 'Dreaming',
      title: 'Dreaming',
      desc: 'I\'m inspired and exploring ideas for the future.',
      action: 'Stay inspired',
      icon: 'sparkles',
      img: IMG_DREAMING,
      bg: '#eff6ff',
      textColor: '#1e3a8a',
      accentColor: '#3b82f6',
      badgeIcon: 'heart',
    },
    {
      id: 'Planning',
      title: 'Planning',
      desc: 'I\'m actively planning my trip and building my itinerary.',
      action: 'Organize & plan better',
      icon: 'map',
      img: IMG_PLANNING,
      bg: '#f0fdf4',
      textColor: '#14532d',
      accentColor: '#10b981',
      badgeIcon: 'location',
    },
    {
      id: 'Booked',
      title: 'Booked',
      desc: 'My trip is confirmed and I\'m getting ready!',
      action: 'Get trip ready',
      icon: 'calendar',
      img: IMG_BOOKED,
      bg: '#fff7ed',
      textColor: '#7c2d12',
      accentColor: '#f97316',
      badgeIcon: 'airplane',
    }
  ];

  async function handleSave() {
    if (!selectedIntent) {
      Alert.alert('Select Intent', 'Please select why you are saving this trip.');
      return;
    }
    if (!session?.user?.id || !plan_id) return;
    
    setLoading(true);
    // Use the intent as the "collection_name" for now, or just save the plan.
    const { error } = await supabase.from('saved_plans').insert({
      user_id: session.user.id,
      plan_id: plan_id as string,
      collection_name: selectedIntent
    });

    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        Alert.alert('Already Saved', 'This plan is already in your saves.');
      } else {
        Alert.alert('Error', error.message);
      }
    } else {
      router.back();
    }
  }

  return (
    <View style={styles.container}>
      {/* Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <View style={styles.closeBtnInner}>
          <Ionicons name="close" size={20} color="#0f172a" />
        </View>
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color="#14b8a6" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>Why are you saving this?</Text>
        <Text style={styles.subtitle}>This helps us personalize your travel experience</Text>
      </View>

      <View style={styles.list}>
        {intents.map(intent => (
          <TouchableOpacity 
            key={intent.id} 
            style={[
              styles.card, 
              { backgroundColor: intent.bg },
              selectedIntent === intent.id && { borderWidth: 2, borderColor: intent.accentColor }
            ]}
            onPress={() => setSelectedIntent(intent.id)}
            disabled={loading}
          >
            <View style={styles.cardImgContainer}>
              <Image source={{ uri: intent.img }} style={styles.cardImg} />
              <View style={styles.cardImgOverlay}>
                <View style={styles.badgeCloud}>
                  <Ionicons name={intent.badgeIcon as any} size={20} color={intent.accentColor} />
                </View>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: intent.textColor }]}>{intent.title}</Text>
              <Text style={styles.cardDesc}>{intent.desc}</Text>
              
              <View style={styles.cardActionRow}>
                <Ionicons name={intent.icon as any} size={14} color={intent.accentColor} style={{ marginRight: 6 }} />
                <Text style={[styles.cardActionText, { color: intent.accentColor }]}>{intent.action}</Text>
              </View>
            </View>

            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter, 
                selectedIntent === intent.id ? { borderColor: intent.accentColor } : { borderColor: '#cbd5e1' }
              ]}>
                {selectedIntent === intent.id && <View style={[styles.radioInner, { backgroundColor: intent.accentColor }]} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueBtn, !selectedIntent && styles.continueBtnDisabled]} 
          onPress={handleSave}
          disabled={!selectedIntent || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.continueBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ position: 'absolute', right: 24 }} />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footerNote}>
          <Ionicons name="lock-closed-outline" size={14} color="#94a3b8" />
          <Text style={styles.footerNoteText}>You can change this anytime in Trip Settings</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 12 },
  
  handleContainer: { alignItems: 'center', marginBottom: 20 },
  handle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2 },
  
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  closeBtnInner: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  
  header: { alignItems: 'center', paddingHorizontal: 32, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  
  list: { paddingHorizontal: 20, flex: 1 },
  
  card: { flexDirection: 'row', borderRadius: 20, marginBottom: 16, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  cardImgContainer: { width: 100, height: 100, borderRadius: 16, overflow: 'hidden', marginRight: 16 },
  cardImg: { width: '100%', height: '100%' },
  cardImgOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  badgeCloud: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 8 },
  cardActionRow: { flexDirection: 'row', alignItems: 'center' },
  cardActionText: { fontSize: 12, fontWeight: '700' },
  
  radioContainer: { paddingLeft: 16 },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
  continueBtn: { height: 56, backgroundColor: '#8b5cf6', borderRadius: 28, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  continueBtnDisabled: { backgroundColor: '#c4b5fd' },
  continueBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  
  footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  footerNoteText: { fontSize: 12, color: '#94a3b8', marginLeft: 6 }
});
