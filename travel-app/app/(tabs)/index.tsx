import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Design tokens
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';

// Store
import { useHomeStore, PlanCard, NearbyAdventure, CommunityPick } from '../../stores/useHomeStore';
import { useAuthStore } from '../../stores/useAuthStore';

// Analytics
import { trackHomeEvent } from '../../lib/analytics';

// Home components
import SkeletonHome from '../../components/home/SkeletonHome';
import WelcomeCard from '../../components/home/WelcomeCard';
import HomeHero from '../../components/home/HomeHero';
import FeedSection, { FeedItem } from '../../components/home/FeedSection';
import ContinuePlanningSection from '../../components/home/ContinuePlanningSection';
import HomeErrorState from '../../components/home/HomeErrorState';
import HomeEmptyState from '../../components/home/HomeEmptyState';
import ScrollToTopFAB from '../../components/home/ScrollToTopFAB';
import SaveToast from '../../components/home/SaveToast';

// ─── Helpers ──────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const mapPlansToFeedItems = (plans: PlanCard[], savedIds: Set<string>): FeedItem[] => {
  return plans.map(p => ({
    id: p.id,
    title: p.title,
    subtitle: `by ${p.profiles?.display_name || 'Anonymous'}`,
    image_url: p.image_url || '',
    meta1: p.duration_days ? `${p.duration_days} days` : undefined,
    type: 'plan',
    isSaved: savedIds.has(p.id)
  }));
};

const mapNearbyToFeedItems = (nearby: NearbyAdventure[]): FeedItem[] => {
  return nearby.map(n => ({
    id: n.id,
    title: n.title,
    subtitle: `${n.distance} • ${n.travelTime}`,
    image_url: n.image_url,
    type: 'destination'
  }));
};

const mapCommunityToFeedItems = (picks: CommunityPick[]): FeedItem[] => {
  return picks.map(c => ({
    id: c.id,
    title: c.title,
    subtitle: c.reason,
    image_url: c.image_url,
    meta1: c.creator,
    meta2: c.verified ? 'Verified' : undefined,
    type: 'plan'
  }));
};

// ─── Main Screen ──────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Use Animated.ScrollView ref
  const scrollRef = useRef<any>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Auth store
  const { hasCompletedOnboarding, user } = useAuthStore();

  // Home store
  const {
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    isFirstTime,
    plans,
    draftPlans,
    trendingPlans,
    recommendations,
    nearbyAdventures,
    communityPicks,
    featuredDestination,
    upcomingTrip,
    showScrollToTop,
    hasMorePlans,
    isLoadingMore,
    savedPlanIds,
    toastMessage,
    userLocation,
    fetchHomeData,
    fetchUserLocation,
    refreshHome,
    loadMorePlans,
    toggleSaved,
    setShowScrollToTop,
    dismissToast,
  } = useHomeStore();

  // ─── Data Fetching ────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      fetchHomeData(!hasCompletedOnboarding);
      fetchUserLocation();
    }, [fetchHomeData, fetchUserLocation, hasCompletedOnboarding]),
  );

  // ─── Scroll Handling ──────────────────────────────────
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (e: any) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        setShowScrollToTop(offsetY > 600);

        // Infinite scroll trigger
        const { layoutMeasurement, contentSize } = e.nativeEvent;
        const isNearBottom = offsetY + layoutMeasurement.height >= contentSize.height - 200;
        if (isNearBottom && hasMorePlans && !isLoadingMore) {
          loadMorePlans();
        }
      }
    }
  );

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  // ─── Loading State (Screen 01) ────────────────────────
  if (isLoading) {
    return <SkeletonHome />;
  }

  // ─── Error State (Screen 19) ──────────────────────────
  if (hasError) {
    return (
      <View style={[styles.fullScreen, { paddingTop: insets.top }]}>
        <HomeErrorState
          message={errorMessage}
          onRetry={() => fetchHomeData(!hasCompletedOnboarding)}
        />
      </View>
    );
  }

  // ─── Determine empty (Screen 18) ─────────────────────
  const hasNoContent =
    plans.length === 0 &&
    draftPlans.length === 0 &&
    !upcomingTrip &&
    !isFirstTime;

  const showWelcomeCard = 
    isFirstTime && 
    plans.length === 0 && 
    draftPlans.length === 0 && 
    !upcomingTrip;

  // ─── User display name ────────────────────────────────
  const displayName = user?.user_metadata?.display_name || 'Explorer';
  
  // ─── Feed Items Mapping ───────────────────────────────
  const recommendationsFeed = mapPlansToFeedItems(recommendations, savedPlanIds);
  const trendingFeed = mapPlansToFeedItems(trendingPlans, savedPlanIds);
  const nearbyFeed = mapNearbyToFeedItems(nearbyAdventures);
  const communityFeed = mapCommunityToFeedItems(communityPicks);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ─── Top App Bar ─────────────────────────────────── */}
      <View style={[styles.appBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.appBarTop}>
          <Text style={styles.logoText}>Itinerate</Text>

          <TouchableOpacity style={styles.locationChip}>
            <Ionicons name="location-outline" size={14} color={Colors.primaryText} />
            <Text style={styles.locationText}>{userLocation || 'Location...'}</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.primaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => {
              trackHomeEvent('widget_clicked', { widget: 'notifications' });
            }}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.primaryText} />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── Search Bar (Screen 12) ──────────────────── */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => {
            trackHomeEvent('search_started');
            // @ts-ignore
            router.push('/search');
          }}
          activeOpacity={0.8}
          accessibilityRole="search"
          accessibilityLabel="Search destinations, plans, treks"
        >
          <Ionicons name="search" size={18} color={Colors.placeholder} />
          <Text style={styles.searchPlaceholder}>Search destinations, plans, treks…</Text>
          <Ionicons name="options-outline" size={18} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      {/* ─── Scrollable Content ──────────────────────────── */}
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshHome}
            tintColor={Colors.blue500}
            colors={[Colors.blue500]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Hero Section with Greeting ──────────────── */}
        <HomeHero 
          greeting={`${getGreeting()}, ${displayName}! 👋`}
          greetingSub={isFirstTime ? "Welcome to Itinerate. Let's plan your first adventure." : "Here's what's happening in your travel world."}
          upcomingTrip={upcomingTrip}
          featuredDestination={featuredDestination}
          scrollY={scrollY}
        />

        {/* ─── Welcome Card ─────────────────────────────── */}
        {showWelcomeCard && <WelcomeCard />}

        {/* ─── Continue Planning ───────────── */}
        {draftPlans.length > 0 && (
          <ContinuePlanningSection drafts={draftPlans} />
        )}

        {/* ─── Personalized Recommendations (Screen 07) ── */}
        {/* ─── Personalized Recommendations (Screen 07) ── */}
        {recommendationsFeed.length > 0 && (
          <FeedSection 
            title="Recommended for you" 
            subtitle="Based on your interests"
            items={recommendationsFeed} 
            onSave={toggleSaved} 
          />
        )}

        {/* ─── Trending Plans (Screen 08) ──────────────── */}
        {trendingFeed.length > 0 && (
          <FeedSection 
            title="Trending this week" 
            items={trendingFeed} 
            onSave={toggleSaved} 
            onViewAll={() => router.push('/search')}
          />
        )}

        {/* ─── Nearby Adventures (Screen 09) ───────────── */}
        {nearbyFeed.length > 0 && (
          <FeedSection 
            title="Nearby adventures" 
            items={nearbyFeed} 
            onViewAll={() => router.push('/search')}
          />
        )}

        {/* ─── Community Picks (Screen 10) ─────────────── */}
        {communityFeed.length > 0 && (
          <FeedSection 
            title="Community picks" 
            subtitle="Top rated by travelers"
            items={communityFeed} 
            onSave={toggleSaved} 
          />
        )}

        {/* ─── Empty State (Screen 18) ─────────────────── */}
        {hasNoContent && <HomeEmptyState />}

        {/* ─── Infinite Scroll Loading (Screen 14) ─────── */}
        {isLoadingMore && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={Colors.blue500} />
            <Text style={styles.loadingMoreText}>Loading more recommendations…</Text>
          </View>
        )}

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* ─── Scroll To Top FAB (Screen 24) ───────────── */}
      <ScrollToTopFAB visible={showScrollToTop} onPress={scrollToTop} />

      {/* ─── Save Toast (Screen 15) ──────────────────── */}
      {toastMessage ? (
        <SaveToast
          message={toastMessage}
          onDismiss={dismissToast}
          onUndo={
            toastMessage.includes('Saved')
              ? () => {
                  dismissToast();
                }
              : undefined
          }
        />
      ) : null}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  // App Bar
  appBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
    ...Shadows.card,
    zIndex: 10,
  },
  appBarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  logoText: {
    ...Typography.headingL,
    color: Colors.blue500,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.l,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  locationText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  notifBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 0,
    backgroundColor: Colors.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notifBadgeText: {
    ...Typography.micro,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.white,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: Spacing.s,
  },
  searchPlaceholder: {
    ...Typography.bodySmall,
    color: Colors.placeholder,
    flex: 1,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },

  // Infinite Scroll Loading
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.s,
    paddingVertical: Spacing.l,
  },
  loadingMoreText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
  },
});
