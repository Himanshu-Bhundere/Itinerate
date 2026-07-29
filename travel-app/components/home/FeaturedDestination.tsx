import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { FeaturedDestination as FeaturedDestinationType } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  destination: FeaturedDestinationType;
}

/** Screen 06 – Featured Destination daily inspiration hero */
export default function FeaturedDestination({ destination }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Featured Destination</Text>
        <Text style={styles.subtitle}>Daily inspiration for your next trip</Text>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: destination.image_url }} style={styles.image} />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.name}>{destination.name}</Text>

          <View style={styles.details}>
            <View style={styles.detail}>
              <Ionicons name="thermometer-outline" size={14} color={Colors.white} />
              <Text style={styles.detailText}>{destination.temperature}</Text>
            </View>
            <View style={styles.detail}>
              <Ionicons name="calendar-outline" size={14} color={Colors.white} />
              <Text style={styles.detailText}>{destination.bestTime}</Text>
            </View>
            <View style={styles.detail}>
              <Ionicons name="wallet-outline" size={14} color={Colors.white} />
              <Text style={styles.detailText}>{destination.budget}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.guideBtn}
              onPress={() => trackHomeEvent('destination_viewed', { destination_id: destination.id })}
              accessibilityRole="button"
              accessibilityLabel="Open guide"
            >
              <Ionicons name="book-outline" size={16} color={Colors.primaryText} />
              <Text style={styles.guideBtnText}>Open Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => trackHomeEvent('plan_saved', { destination_id: destination.id })}
              accessibilityRole="button"
              accessibilityLabel="Save destination"
            >
              <Ionicons name="heart-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => trackHomeEvent('plan_shared', { destination_id: destination.id })}
              accessibilityRole="button"
              accessibilityLabel="Share destination"
            >
              <Ionicons name="share-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.l,
  },
  header: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  card: {
    marginHorizontal: Spacing.l,
    borderRadius: Radius.m,
    overflow: 'hidden',
    height: 260,
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    ...StyleSheet.absoluteFill,
    padding: Spacing.l,
    justifyContent: 'flex-end',
    gap: Spacing.s,
  },
  name: {
    ...Typography.headingL,
    fontWeight: '700',
    color: Colors.white,
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    marginTop: Spacing.xs,
  },
  guideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    height: 36,
    borderRadius: Radius.circular,
  },
  guideBtnText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
