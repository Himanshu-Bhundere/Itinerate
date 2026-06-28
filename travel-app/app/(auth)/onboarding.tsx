import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const AVATAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  async function completeProfile() {
    if (!session?.user?.id) return;
    
    if (!displayName || !homeCity) {
      Alert.alert('Missing Info', 'Please fill in your name and location.');
      return;
    }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.topSection, { paddingTop: Math.max(insets.top, 20) }]}>
          
          <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <View style={[styles.heroGradient, { backgroundColor: 'rgba(248, 250, 252, 0.4)' }]} />
            
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#0f172a" />
              </TouchableOpacity>
              
              <Text style={styles.logoText}>Itinerate</Text>
              
              <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            {/* Progress Indicators */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>

            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Let's set up{'\n'}your profile 🌴</Text>
              <Text style={styles.heroSubtitle}>Tell us a bit about yourself{'\n'}and start your travel journey.</Text>
            </View>

          </ImageBackground>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          
          {/* Avatar Upload */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatarImage} />
              <TouchableOpacity style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarTitle}>Add a profile picture</Text>
            <Text style={styles.avatarSubtitle}>Show your vibe to the travel community</Text>
            
            <View style={styles.avatarDots}>
              <View style={[styles.smallDot, { backgroundColor: '#2563eb' }]} />
              <View style={styles.smallDot} />
              <View style={styles.smallDot} />
              <View style={styles.smallDot} />
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            
            {/* Full Name */}
            <View style={styles.inputCard}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={20} color="#0ea5e9" />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#e0f2fe' }]}>
                <Feather name="at-sign" size={20} color="#0ea5e9" />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Choose a unique username"
                  placeholderTextColor="#94a3b8"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                <Text style={styles.inputHint}>This will be your identity on Itinerate</Text>
              </View>
              <View style={styles.validBadge}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#22c55e" />
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="location-outline" size={20} color="#10b981" />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Where are you from?"
                  placeholderTextColor="#94a3b8"
                  value={homeCity}
                  onChangeText={setHomeCity}
                />
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 8 }} />
            </View>

          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={completeProfile} disabled={loading || !displayName || !homeCity} activeOpacity={0.8} style={styles.buttonWrapper}>
            <View style={[styles.button, { backgroundColor: '#2563eb' }]}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                </>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.safeContainer}>
            <Ionicons name="lock-closed" size={12} color="#10b981" style={{ marginRight: 6 }} />
            <Text style={styles.safeText}>Your information is safe with us.</Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topSection: { height: 320, width: '100%' },
  heroImage: { flex: 1, width: '100%', height: '100%' },
  heroImageStyle: { opacity: 0.9 },
  heroGradient: { ...StyleSheet.absoluteFill as any },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  logoText: { fontSize: 24, fontWeight: '700', color: '#0ea5e9', fontStyle: 'italic' },
  
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  progressDot: { width: 24, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', marginHorizontal: 4 },
  progressDotActive: { backgroundColor: '#2563eb' },
  
  heroTextContainer: { paddingHorizontal: 24, marginTop: 40 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#0f172a', marginBottom: 12, lineHeight: 38 },
  heroSubtitle: { fontSize: 15, color: '#475569', fontWeight: '500', lineHeight: 22 },

  card: {
    flex: 1, backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    marginTop: -40, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5,
  },

  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#eff6ff' },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#ffffff',
  },
  avatarTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  avatarSubtitle: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  avatarDots: { flexDirection: 'row' },
  smallDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e2e8f0', marginHorizontal: 3 },

  formContainer: { marginBottom: 32 },
  inputCard: {
    flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f9ff',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  inputContent: { flex: 1, justifyContent: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  input: { fontSize: 15, color: '#334155', padding: 0, margin: 0, height: 20 },
  inputHint: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  validBadge: { justifyContent: 'center', paddingRight: 8 },

  buttonWrapper: { shadowColor: '#2563eb', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8, marginBottom: 20 },
  button: { width: '100%', height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  buttonIcon: { position: 'absolute', right: 24 },

  safeContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  safeText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
});
