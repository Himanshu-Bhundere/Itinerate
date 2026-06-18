import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, StatusBar } from 'react-native';
import { supabase } from '../../lib/supabase';

const BG_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';

type AuthMode = 'login' | 'signup';
type SignupStep = 'email' | 'otp' | 'password';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LOG IN FLOW ---
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    }
    setLoading(false);
  }

  // --- SIGN UP FLOW ---
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
      setSignupStep('otp');
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
    } else {
      // User is now authenticated, move to password setup
      setSignupStep('password');
    }
    setLoading(false);
  }

  async function handleSetPassword() {
    if (!password || password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your account is ready!');
      // State changes here will be caught by the _layout.tsx auth listener to redirect
    }
    setLoading(false);
  }

  // --- RENDER HELPERS ---
  function getTitle() {
    if (mode === 'login') return 'Welcome Back';
    if (signupStep === 'email') return 'Create Account';
    if (signupStep === 'otp') return 'Check your Email';
    return 'Secure Account';
  }

  function getSubtitle() {
    if (mode === 'login') return 'Log in to continue your journey';
    if (signupStep === 'email') return 'Enter your email to get started';
    if (signupStep === 'otp') return `We sent a 6-digit code to ${email}`;
    return 'Set a password for future logins';
  }

  function resetState() {
    setMode(mode === 'login' ? 'signup' : 'login');
    setSignupStep('email');
    setPassword('');
    setOtp('');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.backgroundImage}>
        <View style={styles.overlay}>

          <View style={styles.headerContainer}>
            <Text style={styles.logoText}>Itinerate</Text>
            <Text style={styles.tagline}>Discover your next great adventure.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{getTitle()}</Text>
            <Text style={styles.cardSubtitle}>{getSubtitle()}</Text>

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
                </TouchableOpacity>
              </>
            )}

            {/* SIGNUP MODE */}
            {mode === 'signup' && signupStep === 'email' && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Code</Text>}
                </TouchableOpacity>
              </>
            )}

            {mode === 'signup' && signupStep === 'otp' && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit code"
                    placeholderTextColor="#94a3b8"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
                </TouchableOpacity>
              </>
            )}

            {mode === 'signup' && signupStep === 'password' && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSetPassword} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Set Password & Finish</Text>}
                </TouchableOpacity>
              </>
            )}

            {/* TOGGLE MODE */}
            {signupStep === 'email' && (
              <TouchableOpacity onPress={resetState} style={styles.toggleContainer} disabled={loading}>
                <Text style={styles.toggleText}>
                  {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  headerContainer: { paddingHorizontal: 30, marginTop: 60 },
  logoText: {
    fontSize: 48, fontWeight: '900', color: '#ffffff', letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18, color: '#e2e8f0', marginTop: 8, fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },
  card: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingHorizontal: 30, paddingTop: 40, paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20,
  },
  cardTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  cardSubtitle: { fontSize: 15, color: '#64748b', marginBottom: 30, fontWeight: '500' },
  inputContainer: { marginBottom: 16 },
  input: {
    width: '100%', height: 56, backgroundColor: '#f8fafc', borderWidth: 1.5,
    borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 20, fontSize: 16,
    color: '#0f172a', fontWeight: '500',
  },
  button: {
    width: '100%', height: 56, backgroundColor: '#2563eb', borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    marginTop: 8, marginBottom: 20,
  },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 },
  toggleContainer: { paddingVertical: 10, alignItems: 'center' },
  toggleText: { color: '#3b82f6', fontSize: 15, fontWeight: '600' },
});
