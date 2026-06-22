import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  async function performSearch() {
    setLoading(true);
    const { data } = await supabase
      .from('plans')
      .select('*')
      .or(`title.ilike.%${query}%,location.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(20);
      
    if (data) {
      setResults(data);
    }
    setLoading(false);
  }

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultCard} activeOpacity={0.8} onPress={() => router.push(`/plans/${item.id}`)}>
      <Image source={{ uri: item.image_url || DEFAULT_IMAGE }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultLocation}>{item.location || 'Unknown Location'}</Text>
        
        <View style={styles.resultMeta}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>4.8</Text>
            <Ionicons name="star" size={10} color="#fff" style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.metaText}> • {item.duration_days || 3} Days</Text>
          {item.category && <Text style={styles.metaText}> • {item.category}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search destinations, treks..."
            placeholderTextColor="#94a3b8"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderResultItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            query.length > 0 ? (
              <View style={styles.centerContainer}>
                <Ionicons name="search-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySub}>Try searching for a different destination or category.</Text>
              </View>
            ) : (
              <View style={styles.centerContainer}>
                <Ionicons name="compass-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>Where do you want to go?</Text>
                <Text style={styles.emptySub}>Search for places, treks, organizations...</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { marginRight: 12 },
  searchInputContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f1f5f9', borderRadius: 12, height: 44,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a', height: '100%' },
  clearBtn: { padding: 4 },
  
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#334155', marginTop: 16, textAlign: 'center' },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8 },
  
  listContainer: { padding: 20, paddingBottom: 40 },
  resultCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 12, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  resultImage: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
  resultContent: { flex: 1 },
  resultTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  resultLocation: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  resultMeta: { flexDirection: 'row', alignItems: 'center' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#ffffff' },
  metaText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
});
