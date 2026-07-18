import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { trackAuthEvent } from '../../lib/analytics';
import {
  Colors,
  Gradients,
  Typography,
  Spacing,
  Radius,
  ButtonSize,
  InputSize,
  Shadows,
  IconSize,
} from '../../constants/tokens';

export default function AuthChoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setAuthMethod } = useAuthStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin() {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Email Required', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    trackAuthEvent('auth_started', { method: 'email' });

    const { error } = await supabase.auth.signInWithOtp({ email: trimmed });

    if (error) {
      if (error.status === 429) {
        Alert.alert('Too Many Requests', 'Please wait a moment before requesting another code.');
      } else {
        Alert.alert('Error', error.message);
      }
      setLoading(false);
      return;
    }

    trackAuthEvent('otp_sent', { method: 'email' });
    setAuthMethod('email');
    setLoading(false);
    router.push({
      pathname: '/(auth)/otp-verification',
      params: { email: trimmed },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[Gradients.primary[0], Gradients.primary[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top section */}
      <View style={[styles.topSection, { paddingTop: Math.max(insets.top, 20) + Spacing.xl }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="location" size={IconSize.primary} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>Itinerate</Text>
        </View>

        <Text style={styles.heroTitle}>Welcome{'\n'}Traveller</Text>
        <Text style={styles.heroSubtitle}>
          Sign in to start planning your next adventure
        </Text>
      </View>

      {/* Bottom card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {/* Email input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={IconSize.small}
                color={Colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                accessibilityLabel="Email address"
              />
            </View>
          </View>

          {/* Continue with Email */}
          <TouchableOpacity
            onPress={handleEmailLogin}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Email"
          >
            <View style={[styles.primaryButton, loading && styles.buttonDisabled]}>
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Continue with Email</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={IconSize.small}
                    color={Colors.white}
                    style={styles.buttonArrow}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Terms & Privacy */}
          <View style={styles.termsContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={Colors.secondaryText}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.termsText}>By continuing, you agree to our</Text>
          </View>
          <View style={styles.termsLinksRow}>
            <TouchableOpacity accessibilityRole="link">
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> and </Text>
            <TouchableOpacity accessibilityRole="link">
              <Text style={styles.termsLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blue500,
  },
  topSection: {
    flex: 1,
    paddingHorizontal: Spacing.l,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
  },
  logoText: {
    ...Typography.headingL,
    color: Colors.white,
    fontWeight: '700',
  },
  heroTitle: {
    ...Typography.displayXL,
    color: Colors.white,
    marginBottom: Spacing.s,
  },
  heroSubtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    ...Shadows.bottomSheet,
  },
  cardContent: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
  },
  cardTitle: {
    ...Typography.headingM,
    color: Colors.primaryText,
    marginBottom: Spacing.l,
  },
  inputWrapper: {
    marginBottom: Spacing.l,
  },
  inputLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: InputSize.height,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: InputSize.radius,
    paddingHorizontal: InputSize.padding,
  },
  inputIcon: {
    marginRight: Spacing.s,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.body,
    color: Colors.primaryText,
  },
  primaryButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.blue500,
    borderRadius: ButtonSize.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.l,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
  buttonArrow: {
    position: 'absolute',
    right: Spacing.l,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  termsText: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  termsLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsLink: {
    ...Typography.caption,
    color: Colors.blue500,
    fontWeight: '600',
  },
});
