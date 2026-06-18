import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import PlanMap from '../../components/plans/PlanMap';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/useAuthStore';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const [plan, setPlan] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchPlanDetails();
      if (session?.user) {
        checkBookmark();
      }
    }
  }, [id, session]);

  async function checkBookmark() {
    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('plan_id', id)
      .eq('user_id', session?.user?.id)
      .single();
    
    if (data) setIsBookmarked(true);
  }

  async function toggleBookmark() {
    if (!session?.user) {
      Alert.alert('Login Required', 'Please log in to save plans.');
      return;
    }
    
    setBookmarking(true);
    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('plan_id', id)
        .eq('user_id', session?.user?.id);
      
      if (!error) setIsBookmarked(false);
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          plan_id: id,
          user_id: session?.user?.id
        });
      
      if (!error) setIsBookmarked(true);
    }
    setBookmarking(false);
  }

  async function fetchPlanDetails() {
    setLoading(true);
    // Fetch Plan
    const { data: planData } = await supabase
      .from('plans')
      .select('*, profiles(display_name)')
      .eq('id', id)
      .single();

    if (planData) {
      setPlan(planData);
    }

    // Fetch associated places
    const { data: placesData } = await supabase
      .from('plan_places')
      .select('*, places(*)')
      .eq('plan_id', id)
      .order('day_number', { ascending: true })
      .order('sort_order', { ascending: true });

    if (placesData) {
      setPlaces(placesData.map((item: any) => ({ ...item.places, plan_details: item })));
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text className="text-xl font-bold text-slate-800">Plan not found</Text>
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-blue-600 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen 
        options={{ 
          title: plan.title,
          headerRight: () => (
            <TouchableOpacity onPress={toggleBookmark} disabled={bookmarking} className="mr-2">
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={isBookmarked ? "#2563eb" : "#64748b"} 
              />
            </TouchableOpacity>
          )
        }} 
      />
      <ScrollView className="flex-1">
        {/* Map View Section */}
        <View className="h-64 bg-slate-200">
          <PlanMap places={places} />
        </View>

        {/* Plan Header */}
        <View className="p-4 bg-white border-b border-slate-100">
          <Text className="text-3xl font-bold text-slate-800 mb-2">{plan.title}</Text>
          <View className="flex-row items-center mb-4">
            <Text className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mr-2">
              {plan.location}
            </Text>
            <Text className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              {plan.duration_days} Days
            </Text>
          </View>
          <Text className="text-sm text-slate-500 mb-2">
            Created by {plan.profiles?.display_name || 'Traveler'}
          </Text>
          {plan.description && (
            <Text className="text-base text-slate-700 leading-6 mt-2">
              {plan.description}
            </Text>
          )}
        </View>

        {/* Itinerary Section */}
        <View className="p-4">
          <Text className="text-xl font-bold text-slate-800 mb-4">Itinerary</Text>
          {places.length === 0 ? (
            <Text className="text-slate-500 italic">No places added to this plan yet.</Text>
          ) : (
            places.map((place, index) => (
              <View key={place.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
                <Text className="font-bold text-lg text-slate-800">{place.name}</Text>
                <Text className="text-sm text-slate-500 capitalize">{place.category}</Text>
                {place.plan_details?.notes && (
                  <Text className="text-sm text-slate-700 mt-2">{place.plan_details.notes}</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
