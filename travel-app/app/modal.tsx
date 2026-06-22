import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

export default function SaveIntentModal() {
  const { plan_id } = useLocalSearchParams();
  const router = useRouter();
  const session = useAuthStore(state => state.session);
  const [loading, setLoading] = useState(false);

  const collections = [
    { id: '1', name: 'All Saves', count: 12 },
    { id: '2', name: 'Summer 2024', count: 3 },
    { id: '3', name: 'Trek Ideas', count: 5 },
  ];

  async function handleSave(collectionName: string) {
    if (!session?.user?.id || !plan_id) return;
    
    setLoading(true);
    const { error } = await supabase.from('saved_plans').insert({
      user_id: session.user.id,
      plan_id: plan_id as string,
      collection_name: collectionName
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
      <View style={styles.header}>
        <Text style={styles.title}>Save to Collection</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {collections.map(col => (
          <TouchableOpacity 
            key={col.id} 
            style={styles.collectionItem}
            onPress={() => handleSave(col.name)}
            disabled={loading}
          >
            <View style={styles.collectionIcon}>
              <Ionicons name="bookmark-outline" size={20} color="#3b82f6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.collectionName}>{col.name}</Text>
              <Text style={styles.collectionCount}>{col.count} saved</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.newCollectionBtn} disabled={loading}>
          <Ionicons name="add" size={24} color="#2563eb" />
          <Text style={styles.newCollectionText}>New Collection</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  closeBtn: { padding: 4 },
  list: { padding: 20 },
  collectionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  collectionIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  collectionName: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  collectionCount: { fontSize: 13, color: '#64748b' },
  newCollectionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  newCollectionText: { fontSize: 16, fontWeight: '600', color: '#2563eb', marginLeft: 12 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' }
});
