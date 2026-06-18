import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const [displayName, setDisplayName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  async function completeProfile() {
    if (!session?.user?.id) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        home_city: homeCity,
        is_verified: true,
      })
      .eq('id', session.user.id);

    if (error) {
      Alert.alert('Error saving profile', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold mb-2 text-center text-slate-800">Complete Your Profile</Text>
        <Text className="text-center text-slate-500 mb-8">Just a few details before you start planning</Text>
        
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-600 mb-2">Display Name</Text>
          <TextInput
            className="w-full h-12 px-4 rounded-lg bg-slate-100 border border-slate-200 text-slate-900"
            placeholder="What should we call you?"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-slate-600 mb-2">Home City</Text>
          <TextInput
            className="w-full h-12 px-4 rounded-lg bg-slate-100 border border-slate-200 text-slate-900"
            placeholder="e.g. Mumbai, Bangalore"
            value={homeCity}
            onChangeText={setHomeCity}
          />
        </View>

        <TouchableOpacity 
          className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center"
          onPress={completeProfile}
          disabled={loading || !displayName}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
