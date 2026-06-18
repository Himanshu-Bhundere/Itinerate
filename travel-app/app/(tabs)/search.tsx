import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear search text when leaving screen (either pushing or tab change)
        setQuery('');
      };
    }, [])
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        performSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  async function performSearch() {
    setLoading(true);
    const tsQuery = query.split(' ').filter(Boolean).map(term => `${term}:*`).join(' & ');
    
    // 1. Search directly in plans
    const { data: plansData } = await supabase
      .from('plans')
      .select('*, profiles(display_name)')
      .eq('visibility', 'public')
      .textSearch('fts', tsQuery)
      .limit(20);

    // 2. Search by creator name
    const { data: creatorData } = await supabase
      .from('profiles')
      .select('id')
      .ilike('display_name', `%${query}%`)
      .limit(10);

    let creatorPlans: any[] = [];
    if (creatorData && creatorData.length > 0) {
      const creatorIds = creatorData.map(c => c.id);
      const { data } = await supabase
        .from('plans')
        .select('*, profiles(display_name)')
        .eq('visibility', 'public')
        .in('creator_id', creatorIds)
        .limit(20);
      if (data) creatorPlans = data;
    }

    // Merge and deduplicate
    const allResults = [...(plansData || []), ...creatorPlans];
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
    
    setResults(uniqueResults);
    setLoading(false);
  }

  const handlePlanPress = (id: string) => {
    setQuery(''); // Clear search box but keep results
    router.push(`/plans/${id}`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm flex-row"
      onPress={() => handlePlanPress(item.id)}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-800 mb-1">{item.title}</Text>
        <Text className="text-sm font-semibold text-blue-600 mb-2">{item.location}</Text>
        <Text className="text-sm text-slate-500">By {item.profiles?.display_name || 'Traveler'} • {item.duration_days} Days</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-slate-100">
        <Text className="text-3xl font-bold text-slate-800 mb-4">Search</Text>
        <View className="relative flex-row items-center">
          <Ionicons name="search" size={20} color="#94a3b8" style={{ position: 'absolute', left: 12, zIndex: 1 }} />
          <TextInput
            className="flex-1 h-12 pl-10 pr-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-900"
            placeholder="Search destination, vibes, or creators..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity 
              className="absolute right-3 p-1"
              onPress={() => {
                setQuery('');
                setResults([]);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text className="text-slate-500 text-center text-base">Search for your dream destination.</Text>
              <Text className="text-slate-400 text-center text-sm mt-2">Try "Goa", "Trek", or "Alice".</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
