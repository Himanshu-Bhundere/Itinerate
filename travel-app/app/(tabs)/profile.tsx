import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const session = useAuthStore(state => state.session);
  const [profile, setProfile] = useState<any>(null);
  const [myPlans, setMyPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (session?.user?.id) {
        fetchData();
      }
    }, [session])
  );

  async function fetchData() {
    setLoading(true);
    
    // Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session!.user.id)
      .single();
      
    if (profileData) setProfile(profileData);

    // Fetch My Plans
    const { data: plansData } = await supabase
      .from('plans')
      .select('*')
      .eq('creator_id', session!.user.id)
      .order('created_at', { ascending: false });

    if (plansData) setMyPlans(plansData);

    setLoading(false);
  }

  async function handleDeletePlan(planId: string) {
    Alert.alert('Delete Plan', 'Are you sure you want to delete this plan? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('plans').delete().eq('id', planId);
          if (error) {
            Alert.alert('Error', error.message);
          } else {
            setMyPlans(prev => prev.filter(p => p.id !== planId));
          }
        }
      }
    ]);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="px-4 pt-16 pb-8 bg-white border-b border-slate-100 items-center">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="#2563eb" />
          </View>
          <Text className="text-2xl font-bold text-slate-800">{profile?.display_name || session?.user?.email}</Text>
          <Text className="text-slate-500 mt-1">{session?.user?.email}</Text>
          
          <View className="flex-row mt-4">
             <View className="bg-slate-100 px-3 py-1 rounded-full">
               <Text className="text-sm font-semibold text-slate-600 capitalize">{profile?.travel_style || 'Traveler'}</Text>
             </View>
          </View>
        </View>

        {/* My Plans */}
        <View className="p-4">
          <Text className="text-xl font-bold text-slate-800 mb-4">My Created Plans</Text>
          
          {myPlans.length === 0 ? (
            <View className="bg-white p-6 rounded-2xl border border-slate-100 items-center">
              <Text className="text-slate-500 text-center mb-4">You haven't created any plans yet.</Text>
              <TouchableOpacity 
                className="bg-blue-600 px-6 py-2 rounded-full"
                onPress={() => router.push('/(tabs)/create')}
              >
                <Text className="text-white font-bold">Create Plan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myPlans.map(plan => (
              <View key={plan.id} className="bg-white rounded-2xl mb-4 border border-slate-100 shadow-sm overflow-hidden flex-row items-center p-4">
                <TouchableOpacity 
                  className="flex-1"
                  onPress={() => router.push(`/plans/${plan.id}`)}
                >
                  <Text className="text-lg font-bold text-slate-800 mb-1">{plan.title}</Text>
                  <Text className="text-sm font-semibold text-blue-600 mb-1">{plan.location}</Text>
                  <Text className="text-xs text-slate-500 capitalize">{plan.visibility} • {plan.duration_days} Days</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="p-2"
                  onPress={() => handleDeletePlan(plan.id)}
                >
                  <Ionicons name="trash-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Account Actions */}
        <View className="p-4 mt-4 mb-8">
          <TouchableOpacity 
            className="bg-white p-4 rounded-xl border border-red-100 flex-row items-center justify-center"
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-red-600 font-bold text-lg ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
