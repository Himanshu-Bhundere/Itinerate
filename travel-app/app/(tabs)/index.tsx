import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';

export default function DiscoverScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );

  async function fetchPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*, profiles(display_name)')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setPlans(data);
    }
    setLoading(false);
    setRefreshing(false);
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  const trendingPlans = plans;
  const budgetPlans = plans.filter(p => ['backpacker', 'budget'].includes(p.budget_level));
  const premiumPlans = plans.filter(p => ['mid-range', 'premium', 'luxury'].includes(p.budget_level));

  const renderHorizontalList = (title: string, data: any[], emptyText: string) => (
    <View className="mb-8">
      <Text className="text-xl font-bold text-slate-800 px-4 mb-4">{title}</Text>
      {data.length === 0 ? (
        <Text className="text-slate-500 px-4 italic">{emptyText}</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="bg-white rounded-2xl p-4 mr-4 border border-slate-100 shadow-sm w-72"
              onPress={() => router.push(`/plans/${item.id}`)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-slate-800 flex-1" numberOfLines={1}>{item.title}</Text>
                <Text className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md ml-2">{item.location}</Text>
              </View>
              <Text className="text-sm text-slate-500 mb-2">By {item.profiles?.display_name || 'Traveler'} • {item.duration_days} Days</Text>
              {item.description ? (
                <Text className="text-sm text-slate-600" numberOfLines={2}>{item.description}</Text>
              ) : (
                <Text className="text-sm text-slate-400 italic">No description provided.</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-slate-100">
        <Text className="text-3xl font-bold text-slate-800">Discover</Text>
        <Text className="text-slate-500 mt-1">Find your next adventure</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 pt-6"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {renderHorizontalList('Trending Now', trendingPlans, 'No plans available yet.')}
          {renderHorizontalList('Budget Friendly', budgetPlans, 'No budget plans available.')}
          {renderHorizontalList('Premium Getaways', premiumPlans, 'No premium plans available.')}
          <View className="h-10" />
        </ScrollView>
      )}
    </View>
  );
}
