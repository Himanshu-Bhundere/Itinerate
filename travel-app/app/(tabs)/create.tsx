import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  async function handleCreatePlan() {
    if (!title || !location || !duration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from('plans').insert({
      title,
      location,
      duration_days: parseInt(duration),
      creator_id: session?.user?.id,
    }).select().single();

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Plan created!');
      setTitle('');
      setLocation('');
      setDuration('');
      router.push(`/plans/${data.id}`);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-6 mt-4">
        <Text className="text-3xl font-bold text-slate-800">New Trip Plan</Text>
        <Text className="text-slate-500 mt-1">Start planning your next adventure</Text>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
        <Text className="text-sm font-bold text-slate-700 mb-2">Trip Title</Text>
        <TextInput
          className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 mb-4"
          placeholder="e.g. Goa Weekend Getaway"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-sm font-bold text-slate-700 mb-2">Location</Text>
        <TextInput
          className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 mb-4"
          placeholder="e.g. Goa, India"
          value={location}
          onChangeText={setLocation}
        />

        <Text className="text-sm font-bold text-slate-700 mb-2">Duration (Days)</Text>
        <TextInput
          className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 mb-6"
          placeholder="e.g. 3"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        <TouchableOpacity 
          className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center"
          onPress={handleCreatePlan}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Plan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
