import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { UpcomingTrip, FeaturedDestination } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  greeting: string;
  greetingSub: string;
  upcomingTrip?: UpcomingTrip | null;
  featuredDestination?: FeaturedDestination | null;
  scrollY: Animated.Value;
}

export default function HomeHero({ greeting, greetingSub, upcomingTrip, featuredDestination, scrollY }: Props) {
  const router = useRouter();

  // Simple parallax effect for the background image
  const translateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const renderUpcomingTrip = (trip: UpcomingTrip) => (
    <View style={styles.cardContent}>
      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{trip.status}</Text>
      </View>
      <Text style={styles.destinationTitle}>{trip.destination}</Text>
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="calendar-outline" size={16} color={Colors.white} />
          <Text style={styles.detailText}>{trip.daysUntil} days away</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="partly-sunny-outline" size={16} color={Colors.white} />
          <Text style={styles.detailText}>{trip.weather}</Text>
        </View>
      </View>
      <View style={styles.reminderRow}>
        <Ionicons name="bag-outline" size={14} color={Colors.warning} />
        <Text style={styles.reminderText}>{trip.packingReminder}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            trackHomeEvent('widget_clicked', { widget: 'open_trip' });
            router.push(`/plans/${trip.id}`);
          }}
        >
          <Text style={styles.primaryBtnText}>Open Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => trackHomeEvent('widget_clicked', { widget: 'view_checklist' })}
        >
          <Text style={styles.secondaryBtnText}>View Checklist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeatured = (dest: FeaturedDestination) => (
    <View style={styles.cardContent}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Featured</Text>
      </View>
      <Text style={styles.destinationTitle}>{dest.name}</Text>
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="thermometer-outline" size={14} color={Colors.white} />
          <Text style={styles.detailText}>{dest.temperature}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="calendar-outline" size={14} color={Colors.white} />
          <Text style={styles.detailText}>{dest.bestTime}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="wallet-outline" size={14} color={Colors.white} />
          <Text style={styles.detailText}>{dest.budget}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.guideBtn}
          onPress={() => trackHomeEvent('destination_viewed', { destination_id: dest.id })}
        >
          <Ionicons name="book-outline" size={16} color={Colors.primaryText} />
          <Text style={styles.guideBtnText}>Open Guide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const bgImage = upcomingTrip ? upcomingTrip.image_url : featuredDestination?.image_url;

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.greetingSub}>{greetingSub}</Text>
      </View>

      {(upcomingTrip || featuredDestination) && (
        <View style={styles.heroCard}>
          <View style={styles.imageContainer}>
            <Animated.Image 
              source={{ uri: bgImage }} 
              style={[styles.image, { transform: [{ translateY }] }]} 
            />
            <View style={styles.overlay} />
          </View>
          {upcomingTrip ? renderUpcomingTrip(upcomingTrip) : featuredDestination ? renderFeatured(featuredDestination) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.m,
  },
  greetingContainer: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.m,
  },
  greeting: {
    ...Typography.headingM,
    color: Colors.primaryText,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  greetingSub: {
    ...Typography.body,
    color: Colors.secondaryText,
    lineHeight: 24,
  },
  heroCard: {
    marginHorizontal: Spacing.l,
    borderRadius: Radius.l,
    overflow: 'hidden',
    height: 280,
    ...Shadows.card,
  },
  imageContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '130%', // extra height for parallax
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardContent: {
    flex: 1,
    padding: Spacing.l,
    justifyContent: 'flex-end',
    gap: Spacing.s,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.circular,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.white,
  },
  destinationTitle: {
    ...Typography.headingL,
    fontWeight: '800',
    color: Colors.white,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '500',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
  },
  reminderText: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.s,
    marginTop: Spacing.xs,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    height: 40,
    borderRadius: Radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: 40,
    borderRadius: Radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  secondaryBtnText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.white,
  },
  guideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    height: 40,
    borderRadius: Radius.circular,
  },
  guideBtnText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
  },
});
