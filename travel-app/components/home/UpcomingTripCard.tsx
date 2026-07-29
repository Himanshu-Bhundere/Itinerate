import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { UpcomingTrip } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  trip: UpcomingTrip;
}

/** Screen 04 – Home With Upcoming Trip card */
export default function UpcomingTripCard({ trip }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: trip.image_url }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>

        <Text style={styles.destination}>{trip.destination}</Text>

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
            accessibilityRole="button"
            accessibilityLabel="Open trip"
          >
            <Text style={styles.primaryBtnText}>Open Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => trackHomeEvent('widget_clicked', { widget: 'view_checklist' })}
            accessibilityRole="button"
            accessibilityLabel="View checklist"
          >
            <Text style={styles.secondaryBtnText}>View Checklist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    borderRadius: Radius.m,
    overflow: 'hidden',
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: 220,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    ...StyleSheet.absoluteFill,
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
  destination: {
    ...Typography.headingM,
    fontWeight: '700',
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
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.xs,
  },
  reminderText: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '500',
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
    fontWeight: '600',
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
});
