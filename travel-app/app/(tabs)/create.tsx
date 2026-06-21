import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, Image, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [styles, setStyles] = useState<string[]>(['Backpacking']);
  const [loading, setLoading] = useState(false);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  const travelStyles = ['Backpacking', 'Adventure', 'Relaxation', 'Culture'];

  const toggleStyle = (style: string) => {
    if (styles.includes(style)) {
      setStyles(styles.filter(s => s !== style));
    } else {
      setStyles([...styles, style]);
    }
  };

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
      budget_level: budget.toLowerCase().includes('budget') ? 'budget' : 'mid-range',
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
    <SafeAreaView style={uiStyles.safeArea}>
      <KeyboardAvoidingView 
        style={uiStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={uiStyles.header}>
          <TouchableOpacity style={uiStyles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={uiStyles.headerTitle}>Create New Itinerary</Text>
          <TouchableOpacity style={uiStyles.iconButton}>
            <Ionicons name="close" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Stepper */}
        <View style={uiStyles.stepperContainer}>
          <View style={uiStyles.stepItem}>
            <View style={[uiStyles.stepCircle, uiStyles.stepCircleActive]}>
              <Text style={uiStyles.stepCircleTextActive}>1</Text>
            </View>
            <Text style={uiStyles.stepTextActive}>Basic Info</Text>
          </View>
          <View style={uiStyles.stepLine} />
          <View style={uiStyles.stepItem}>
            <View style={uiStyles.stepCircle}>
              <Text style={uiStyles.stepCircleText}>2</Text>
            </View>
            <Text style={uiStyles.stepText}>Itinerary</Text>
          </View>
          <View style={uiStyles.stepLine} />
          <View style={uiStyles.stepItem}>
            <View style={uiStyles.stepCircle}>
              <Text style={uiStyles.stepCircleText}>3</Text>
            </View>
            <Text style={uiStyles.stepText}>Activities</Text>
          </View>
          <View style={uiStyles.stepLine} />
          <View style={uiStyles.stepItem}>
            <View style={uiStyles.stepCircle}>
              <Text style={uiStyles.stepCircleText}>4</Text>
            </View>
            <Text style={uiStyles.stepText}>Stay</Text>
          </View>
          <View style={uiStyles.stepLine} />
          <View style={uiStyles.stepItem}>
            <View style={uiStyles.stepCircle}>
              <Text style={uiStyles.stepCircleText}>5</Text>
            </View>
            <Text style={uiStyles.stepText}>Review</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={uiStyles.scrollContent}>
          {/* Hero Section */}
          <View style={uiStyles.heroSection}>
            <View style={uiStyles.heroTextContent}>
              <Text style={uiStyles.heroTitle}>Let's start with the basics ✨</Text>
              <Text style={uiStyles.heroSubtitle}>Fill in a few details to build your perfect trip.</Text>
            </View>
            <View style={uiStyles.heroImagePlaceholder}>
              <Ionicons name="map-outline" size={48} color="#0ea5e9" />
              <View style={uiStyles.pinBadge}>
                <Ionicons name="location" size={16} color="#fff" />
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={uiStyles.card}>
            
            {/* Title */}
            <Text style={uiStyles.inputLabel}>Plan Title</Text>
            <View style={uiStyles.inputContainer}>
              <View style={uiStyles.inputIconWrapper}>
                <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
              </View>
              <TextInput
                style={uiStyles.input}
                placeholder="Kedarnath Trek Adventure"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={uiStyles.charCount}>{title.length}/80</Text>
            </View>

            {/* Destination */}
            <Text style={uiStyles.inputLabel}>Destination</Text>
            <View style={uiStyles.inputContainer}>
              <View style={[uiStyles.inputIconWrapper, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="location-outline" size={20} color="#10b981" />
              </View>
              <TextInput
                style={uiStyles.input}
                placeholder="Kedarnath, Uttarakhand"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={setLocation}
              />
              <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 12 }} />
            </View>

            {/* Duration */}
            <Text style={uiStyles.inputLabel}>Duration</Text>
            <View style={uiStyles.inputContainer}>
              <View style={[uiStyles.inputIconWrapper, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
              </View>
              <TextInput
                style={uiStyles.input}
                placeholder="4 Days / 3 Nights"
                placeholderTextColor="#94a3b8"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 12 }} />
            </View>

            {/* Budget */}
            <Text style={uiStyles.inputLabel}>Budget <Text style={{ color: '#94a3b8', fontWeight: '400' }}>(per person)</Text></Text>
            <View style={uiStyles.inputContainer}>
              <View style={[uiStyles.inputIconWrapper, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="wallet-outline" size={20} color="#10b981" />
              </View>
              <TextInput
                style={uiStyles.input}
                placeholder="₹8,000 - ₹10,000"
                placeholderTextColor="#94a3b8"
                value={budget}
                onChangeText={setBudget}
              />
              <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 12 }} />
            </View>

            {/* Travel Style */}
            <Text style={uiStyles.inputLabel}>Travel Style</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={uiStyles.stylesScroll}>
              {travelStyles.map((item) => {
                const isActive = styles.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[uiStyles.stylePill, isActive && uiStyles.stylePillActive]}
                    onPress={() => toggleStyle(item)}
                  >
                    <MaterialCommunityIcons 
                      name={item === 'Backpacking' ? 'bag-personal' : item === 'Adventure' ? 'image-filter-hdr' : item === 'Relaxation' ? 'beach' : 'bank'} 
                      size={18} 
                      color={isActive ? '#f97316' : '#64748b'} 
                      style={{ marginRight: 6 }} 
                    />
                    <Text style={[uiStyles.stylePillText, isActive && uiStyles.stylePillTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={uiStyles.hintRow}>
              <Ionicons name="bulb-outline" size={14} color="#f97316" />
              <Text style={uiStyles.hintText}>You can select multiple styles</Text>
            </View>

          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={uiStyles.bottomActions}>
          <TouchableOpacity onPress={handleCreatePlan} disabled={loading}>
            <View style={uiStyles.nextButton}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={uiStyles.nextButtonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{ position: 'absolute', right: 24 }} />
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={uiStyles.draftButton}>
            <Ionicons name="bookmark-outline" size={18} color="#2563eb" style={{ marginRight: 8 }} />
            <Text style={uiStyles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const uiStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' },
  iconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },

  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#ffffff' },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', marginBottom: 4 },
  stepCircleActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  stepCircleText: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  stepCircleTextActive: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
  stepText: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  stepTextActive: { fontSize: 10, color: '#2563eb', fontWeight: '600' },
  stepLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0', marginHorizontal: 8, marginBottom: 16 },

  scrollContent: { padding: 20, paddingBottom: 100 },
  
  heroSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heroTextContent: { flex: 1, paddingRight: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8, lineHeight: 30 },
  heroSubtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  heroImagePlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  pinBadge: { position: 'absolute', top: -5, right: -5, width: 28, height: 28, borderRadius: 14, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f8fafc' },

  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 8, marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, height: 56, marginBottom: 16 },
  inputIconWrapper: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#0f172a' },
  charCount: { fontSize: 12, color: '#94a3b8', marginRight: 16 },

  stylesScroll: { flexDirection: 'row', marginBottom: 16 },
  stylePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  stylePillActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  stylePillText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  stylePillTextActive: { color: '#f97316' },

  hintRow: { flexDirection: 'row', alignItems: 'center' },
  hintText: { fontSize: 12, color: '#64748b', marginLeft: 6 },

  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  nextButton: { backgroundColor: '#2563eb', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  nextButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  draftButton: { height: 56, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  draftButtonText: { fontSize: 16, fontWeight: '600', color: '#2563eb' },
});
