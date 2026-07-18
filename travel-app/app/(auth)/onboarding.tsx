import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingPage from '../../components/auth/OnboardingPage';
import { useAuthStore } from '../../stores/useAuthStore';
import { Colors, Gradients, Typography, Spacing, Radius, ButtonSize } from '../../constants/tokens';

const PAGES = [
  {
    icon: 'compass-outline' as const,
    title: 'Discover Destinations',
    subtitle: 'Explore hidden gems and trending spots curated by real travellers around the world.',
    accent: Colors.blue500,
  },
  {
    icon: 'map-outline' as const,
    title: 'Plan with Timeline & Maps',
    subtitle: 'Build day-by-day itineraries with interactive maps, budgets, and smart suggestions.',
    accent: Colors.teal500,
  },
  {
    icon: 'people-outline' as const,
    title: 'Join the Community',
    subtitle: 'Connect with fellow explorers, share your plans, and discover travel meetups.',
    accent: Colors.orange500,
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setOnboardingComplete, setOnboardingStep } = useAuthStore();

  const handleNext = useCallback(() => {
    if (currentIndex < PAGES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      setOnboardingStep(nextIndex);
    } else {
      // Last page → go to auth choice
      setOnboardingComplete();
      router.replace('/(auth)/auth-choice');
    }
  }, [currentIndex, router, setOnboardingComplete, setOnboardingStep]);

  const handleSkip = useCallback(() => {
    setOnboardingComplete();
    router.replace('/(auth)/auth-choice');
  }, [router, setOnboardingComplete]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const isLastPage = currentIndex === PAGES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <LinearGradient
        colors={[Colors.surface, Colors.white]}
        style={StyleSheet.absoluteFill}
      />

      {/* Skip button (hidden on last page) */}
      {!isLastPage && (
        <TouchableOpacity
          style={[styles.skipButton, { top: Math.max(insets.top, 20) + Spacing.s }]}
          onPress={handleSkip}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, i) => String(i)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <OnboardingPage
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            accentColor={item.accent}
          />
        )}
      />

      {/* Bottom controls */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        {/* Progress dots */}
        <View style={styles.dotsContainer}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNext}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isLastPage ? 'Get Started' : 'Next'}
        >
          <Text style={styles.ctaText}>
            {isLastPage ? 'Get Started' : 'Next'}
          </Text>
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
  skipButton: {
    position: 'absolute',
    right: Spacing.l,
    zIndex: 10,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
  },
  skipText: {
    ...Typography.body,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.l,
    gap: Spacing.s,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.blue500,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.divider,
  },
  ctaButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.blue500,
    borderRadius: ButtonSize.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
});
