import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  ButtonSize,
  Shadows,
  IconSize,
} from '../../constants/tokens';

interface CheckboxItemProps {
  checked: boolean;
  onToggle: () => void;
  label: string | React.ReactNode;
  sublabel?: string;
  required?: boolean;
}

function CheckboxItem({ checked, onToggle, label, sublabel, required }: CheckboxItemProps) {
  return (
    <TouchableOpacity
      style={styles.checkboxRow}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color={Colors.white} />}
      </View>
      <View style={styles.checkboxTextContainer}>
        <Text style={styles.checkboxLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
        {sublabel && <Text style={styles.checkboxSublabel}>{sublabel}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function AgeConsentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setConsentComplete } = useAuthStore();

  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const allAccepted = ageConfirmed && privacyAccepted && termsAccepted;

  function handleContinue() {
    if (!allAccepted) return;
    setConsentComplete();
    router.push('/(auth)/profile-setup');
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={IconSize.hero} color={Colors.blue500} />
        </View>

        <Text style={styles.title}>Age & Privacy</Text>
        <Text style={styles.subtitle}>
          Before you continue, we need to confirm a few things to keep the community safe.
        </Text>

        {/* Checkboxes */}
        <View style={styles.checkboxContainer}>
          <CheckboxItem
            checked={ageConfirmed}
            onToggle={() => setAgeConfirmed(!ageConfirmed)}
            label="I confirm I am 18 years or older"
            required
          />

          <CheckboxItem
            checked={privacyAccepted}
            onToggle={() => setPrivacyAccepted(!privacyAccepted)}
            label={
              <Text>
                I have read and agree to the{' '}
                <Text
                  style={styles.linkText}
                  onPress={(e) => {
                    e.stopPropagation();
                    openLink('https://example.com/privacy');
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            }
            sublabel="We respect your data and never sell it."
            required
          />

          <CheckboxItem
            checked={termsAccepted}
            onToggle={() => setTermsAccepted(!termsAccepted)}
            label={
              <Text>
                I accept the{' '}
                <Text
                  style={styles.linkText}
                  onPress={(e) => {
                    e.stopPropagation();
                    openLink('https://example.com/terms');
                  }}
                >
                  Terms of Service
                </Text>
              </Text>
            }
            sublabel="Community guidelines and usage terms."
            required
          />
        </View>

        {/* Validation message */}
        {!allAccepted && (
          <View style={styles.validationRow}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.secondaryText} />
            <Text style={styles.validationText}>
              All items above are required to continue.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!allAccepted}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !allAccepted }}
        >
          <View style={[styles.ctaButton, !allAccepted && styles.ctaDisabled]}>
            <Text style={[styles.ctaText, !allAccepted && styles.ctaTextDisabled]}>Continue</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
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
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  checkboxContainer: {
    width: '100%',
    gap: Spacing.m,
    marginBottom: Spacing.l,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    ...Shadows.card,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.xs,
    borderWidth: 2,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.blue500,
    borderColor: Colors.blue500,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  checkboxSublabel: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: Spacing.xs,
  },
  requiredStar: {
    color: Colors.danger,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.m,
  },
  validationText: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
  },
  ctaButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.blue500,
    borderRadius: ButtonSize.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: Colors.disabledBg,
  },
  ctaText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
  ctaTextDisabled: {
    color: Colors.disabledText,
  },
  linkText: {
    color: Colors.blue500,
    textDecorationLine: 'underline',
  },
});
