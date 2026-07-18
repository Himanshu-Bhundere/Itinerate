import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { trackAuthEvent } from '../../lib/analytics';
import OTPInput from '../../components/auth/OTPInput';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  ButtonSize,
  Shadows,
  IconSize,
} from '../../constants/tokens';

const RESEND_COOLDOWN = 30; // seconds

export default function OTPVerificationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = useCallback(async () => {
    if (otp.length < 6) {
      setError(true);
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage('');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email ?? '',
      token: otp.trim(),
      type: 'email',
    });

    if (verifyError) {
      trackAuthEvent('otp_failed', { reason: verifyError.message });

      if (verifyError.message.toLowerCase().includes('expired')) {
        setError(true);
        setErrorMessage('Code has expired. Please request a new one.');
      } else {
        setError(true);
        setErrorMessage('Invalid code. Please check and try again.');
      }
      setLoading(false);
      return;
    }

    trackAuthEvent('otp_verified');
    setLoading(false);
    // Auth state change will be caught by root _layout.tsx
  }, [otp, email, router]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    setError(false);
    setErrorMessage('');
    setOtp('');

    const { error: resendError } = await supabase.auth.signInWithOtp({
      email: email ?? '',
    });

    if (resendError) {
      Alert.alert('Error', resendError.message);
    } else {
      trackAuthEvent('otp_sent', { method: 'email', resend: true });
    }
  }, [canResend, email]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={IconSize.primary} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-open-outline" size={IconSize.hero} color={Colors.blue500} />
        </View>

        <Text style={styles.title}>Check your Email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OTPInput
            value={otp}
            onChange={(code) => {
              setOtp(code);
              setError(false);
              setErrorMessage('');
            }}
            error={error}
          />
        </View>

        {/* Error message */}
        {error && errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Verify button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading || otp.length < 6}
          activeOpacity={0.8}
          style={styles.verifyButtonWrapper}
          accessibilityRole="button"
          accessibilityLabel="Verify code"
        >
          <View
            style={[
              styles.verifyButton,
              (loading || otp.length < 6) && styles.buttonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Resend / Edit */}
        <View style={styles.resendRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} accessibilityRole="button">
              <Text style={styles.resendActive}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendDisabled}>
              Resend in {countdown}s
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.editButton}
          accessibilityRole="button"
          accessibilityLabel="Change email address"
        >
          <Ionicons name="pencil-outline" size={16} color={Colors.secondaryText} />
          <Text style={styles.editText}>Change email address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.circular,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: Radius.circular,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    ...Typography.headingL,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  emailText: {
    color: Colors.blue500,
    fontWeight: '600',
  },
  otpContainer: {
    marginBottom: Spacing.l,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.m,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.danger,
  },
  verifyButtonWrapper: {
    width: '100%',
    marginBottom: Spacing.l,
  },
  verifyButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.blue500,
    borderRadius: ButtonSize.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
  resendRow: {
    marginBottom: Spacing.m,
  },
  resendActive: {
    ...Typography.body,
    color: Colors.blue500,
    fontWeight: '600',
  },
  resendDisabled: {
    ...Typography.body,
    color: Colors.placeholder,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.s,
  },
  editText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
