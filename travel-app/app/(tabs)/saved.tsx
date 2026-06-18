import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SavedScreen() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (session?.user?.id) {
        fetchBookmarks();
      } else {
        setBookmarks([]);
        setLoading(false);
      }
    }, [session])
  );

  async function fetchBookmarks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, plans(*, profiles(display_name))')
      .eq('user_id', session!.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
    setLoading(false);
  }

  async function removeBookmark(bookmarkId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);
      
    if (error) {
      Alert.alert('Error', 'Could not remove bookmark');
    } else {
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    }
  }

  const renderItem = ({ item }: { item: any }) => {
    const plan = item.plans;
    if (!plan) return null;

    return (
      <View className="bg-white rounded-2xl mb-4 border border-slate-100 shadow-sm overflow-hidden">
        <TouchableOpacity 
          className="p-4 flex-row items-center"
          onPress={() => router.push(`/plans/${plan.id}`)}
        >
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800 mb-1">{plan.title}</Text>
            <Text className="text-sm font-semibold text-blue-600 mb-1">{plan.location}</Text>
            <Text className="text-sm text-slate-500">By {plan.profiles?.display_name || 'Traveler'} • {plan.duration_days} Days</Text>
          </View>
          <View className="flex-col items-end">
            <View className="bg-slate-50 px-3 py-1 rounded-full mb-3 border border-slate-200">
              <Text className="text-xs font-bold text-slate-600 capitalize">{item.intent}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => removeBookmark(item.id)}
              className="p-2 -mr-2 -mb-2"
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-slate-100">
        <Text className="text-3xl font-bold text-slate-800">Saved Plans</Text>
        <Text className="text-slate-500 mt-1">Your curated list of adventures</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Text className="text-slate-500 text-center text-lg font-medium">You haven't saved any plans yet.</Text>
              <Text className="text-slate-400 text-center mt-2">Go to Discover to find inspiration!</Text>
              <TouchableOpacity 
                className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
                onPress={() => router.push('/(tabs)/')}
              >
                <Text className="text-white font-bold text-base">Explore Plans</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
