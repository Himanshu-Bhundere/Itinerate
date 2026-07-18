import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/useAuthStore';
import { trackAuthEvent } from '../../lib/analytics';
import {
  Colors,
  Gradients,
  Typography,
  Spacing,
  Radius,
  ButtonSize,
  IconSize,
} from '../../constants/tokens';

export default function AuthSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    trackAuthEvent('auth_completed');

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  function handleStartExploring() {
    router.replace('/(tabs)');
  }

  // Extract display name from user metadata or email
  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Traveller';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[Gradients.primary[0], Gradients.primary[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Success illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <Ionicons name="checkmark-circle" size={IconSize.illustration} color={Colors.white} />
            </View>
          </View>
        </View>

        {/* Welcome text */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.subtitle}>
            You're all set. Let's start exploring amazing destinations together.
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 32) }]}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            onPress={handleStartExploring}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Start Exploring"
          >
            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>Start Exploring</Text>
              <Ionicons name="arrow-forward" size={IconSize.small} color={Colors.blue500} style={styles.ctaIcon} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blue500,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationContainer: {
    marginBottom: Spacing.xxl,
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: Radius.circular,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 130,
    height: 130,
    borderRadius: Radius.circular,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    ...Typography.displayL,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  nameText: {
    ...Typography.headingXL,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
  },
  ctaButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.white,
    borderRadius: ButtonSize.radius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.blue500,
  },
  ctaIcon: {
    marginLeft: Spacing.s,
  },
});
