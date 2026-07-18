import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import PermissionCard from '../../components/auth/PermissionCard';
import { useAuthStore } from '../../stores/useAuthStore';
import { trackAuthEvent } from '../../lib/analytics';
import { Colors, Typography, Spacing } from '../../constants/tokens';

interface PermissionStep {
  key: string;
  icon: 'location-outline' | 'notifications-outline' | 'images-outline';
  title: string;
  description: string;
}

const PERMISSION_STEPS: PermissionStep[] = [
  {
    key: 'location',
    icon: 'location-outline',
    title: 'Enable Location',
    description: 'Find nearby destinations, meetups, and personalised recommendations based on where you are.',
  },
  {
    key: 'notifications',
    icon: 'notifications-outline',
    title: 'Stay Updated',
    description: 'Get notified about trip updates, community activity, and travel alerts that matter to you.',
  },
  {
    key: 'photos',
    icon: 'images-outline',
    title: 'Access Photos',
    description: 'Share your travel memories and set a profile picture from your gallery.',
  },
];

export default function PermissionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPermissionsComplete } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  const advanceOrFinish = useCallback(() => {
    if (currentStep < PERMISSION_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setPermissionsComplete();
      router.replace('/(auth)/auth-success');
    }
  }, [currentStep, router, setPermissionsComplete]);

  const handleAllow = useCallback(async () => {
    const step = PERMISSION_STEPS[currentStep];

    try {
      if (step.key === 'location') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        trackAuthEvent(
          status === 'granted' ? 'permission_granted' : 'permission_denied',
          { type: 'location' },
        );
      } else if (step.key === 'notifications') {
        const { status } = await Notifications.requestPermissionsAsync();
        trackAuthEvent(
          status === 'granted' ? 'permission_granted' : 'permission_denied',
          { type: 'notifications' },
        );
      } else if (step.key === 'photos') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        trackAuthEvent(
          status === 'granted' ? 'permission_granted' : 'permission_denied',
          { type: 'photos' },
        );
      }
    } catch {
      // Permission request failed, continue anyway
    }

    advanceOrFinish();
  }, [currentStep, advanceOrFinish]);

  const handleSkip = useCallback(() => {
    const step = PERMISSION_STEPS[currentStep];
    trackAuthEvent('permission_denied', { type: step.key });
    advanceOrFinish();
  }, [currentStep, advanceOrFinish]);

  const step = PERMISSION_STEPS[currentStep];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Progress */}
      <View style={styles.progressContainer}>
        {PERMISSION_STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i <= currentStep ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      {/* Step label */}
      <Text style={styles.stepLabel}>
        Step {currentStep + 1} of {PERMISSION_STEPS.length}
      </Text>

      {/* Permission card */}
      <View style={styles.cardContainer}>
        <PermissionCard
          icon={step.icon}
          title={step.title}
          description={step.description}
          onAllow={handleAllow}
          onSkip={handleSkip}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.s,
    marginBottom: Spacing.m,
    paddingHorizontal: Spacing.l,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
    flex: 1,
  },
  progressActive: {
    backgroundColor: Colors.blue500,
  },
  progressInactive: {
    backgroundColor: Colors.divider,
  },
  stepLabel: {
    ...Typography.caption,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontWeight: '600',
  },
  cardContainer: {
    paddingHorizontal: Spacing.m,
  },
});
