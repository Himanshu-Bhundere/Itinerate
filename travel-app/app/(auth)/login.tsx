import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, StatusBar, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
const GOOGLE_ICON = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg';

type AuthMode = 'login' | 'otp';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    if (!email) {
      Alert.alert('Email Required', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    if (error) {
      if (error.status === 429) {
        Alert.alert('Too Many Requests', 'Please wait a moment before requesting another code.');
      } else {
        Alert.alert('Error', error.message);
      }
    } else {
      setMode('otp');
    }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    if (!otp) {
      Alert.alert('Code Required', 'Please enter the 6-digit code sent to your email.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    });

    if (error) {
      Alert.alert('Verification Failed', 'Invalid or expired code. Please try again.');
    }
    // Success will be caught by _layout.tsx
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          {/* Top Logo */}
          <View style={[styles.headerContainer, { marginTop: Math.max(insets.top, 40) }]}>
            <View style={styles.logoRow}>
              <View style={styles.logoIconPlaceholder}>
                <Ionicons name="location" size={20} color="#fff" />
              </View>
              <Text style={styles.logoText}>Itinerate</Text>
            </View>
          </View>

          {/* Bottom Card */}
          <View style={styles.card}>
            {/* Floating Logo */}
            <View style={styles.floatingLogoContainer}>
              <View style={styles.floatingLogo}>
                <Ionicons name="location" size={28} color="#0080ff" />
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{mode === 'login' ? 'Welcome Back' : 'Check your Email'}</Text>
              <Text style={styles.cardSubtitle}>
                {mode === 'login' ? 'Sign in to continue your journey' : `We sent a 6-digit code to ${email}`}
              </Text>

              {mode === 'login' ? (
                <>
                  {/* Email Input */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email address"
                        placeholderTextColor="#94a3b8"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  {/* Send OTP Button */}
                  <TouchableOpacity onPress={handleSendOtp} disabled={loading} activeOpacity={0.8}>
                    <View style={[styles.button, { backgroundColor: '#2563eb' }]}>
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Send OTP</Text>
                          <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google Button */}
                  <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
                    <Ionicons name="logo-google" size={20} color="#db4437" style={styles.googleIcon} />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>6-Digit Code</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="keypad-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter code"
                        placeholderTextColor="#94a3b8"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>
                  </View>

                  {/* Verify Button */}
                  <TouchableOpacity onPress={handleVerifyOtp} disabled={loading} activeOpacity={0.8}>
                    <View style={[styles.button, { backgroundColor: '#2563eb' }]}>
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Verify Code</Text>
                          <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setMode('login')} style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#64748b', fontWeight: '500' }}>Back to Login</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Bottom Terms */}
              <View style={styles.termsContainer}>
                <Ionicons name="lock-closed-outline" size={14} color="#64748b" style={{ marginRight: 6 }} />
                <Text style={styles.termsText}>By continuing, you agree to our</Text>
              </View>
              <View style={styles.termsLinksRow}>
                <Text style={styles.termsLink}>Terms of Service</Text>
                <Text style={styles.termsText}> and </Text>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter overlay since image is bright
    justifyContent: 'space-between',
  },
  headerContainer: { paddingHorizontal: 24, marginTop: 60 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIconPlaceholder: {
    width: 36, height: 36, backgroundColor: '#2563eb', borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
    borderBottomRightRadius: 0, // Teardrop shape approximation
  },
  logoText: {
    fontSize: 28, fontWeight: '700', color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 40, borderTopRightRadius: 40,
    marginTop: 'auto',
  },
  floatingLogoContainer: {
    alignItems: 'center',
    marginTop: -32,
  },
  floatingLogo: {
    width: 64, height: 64, backgroundColor: '#ffffff', borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  cardContent: {
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  cardTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 8 },
  cardSubtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 32, fontWeight: '500' },
  inputWrapper: { marginBottom: 24 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', height: 56, backgroundColor: '#ffffff', borderWidth: 1,
    borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1, height: '100%', fontSize: 15, color: '#0f172a', fontWeight: '500',
  },
  button: {
    width: '100%', height: 56, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  buttonIcon: { position: 'absolute', right: 24 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#f1f5f9' },
  dividerText: { marginHorizontal: 16, color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: 56, backgroundColor: '#ffffff', borderWidth: 1,
    borderColor: '#e2e8f0', borderRadius: 16, marginBottom: 32,
  },
  googleIcon: { marginRight: 12 },
  googleButtonText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
  termsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  termsText: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  termsLinksRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  termsLink: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
});
