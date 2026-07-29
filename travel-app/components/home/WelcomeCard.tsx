import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { trackHomeEvent } from '../../lib/analytics';

const WELCOME_IMG = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop';

/** Screen 02 – First-Time Home welcome card */
export default function WelcomeCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: WELCOME_IMG }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color={Colors.blue500} />
          <Text style={styles.badgeText}>WELCOME TO ITINERATE</Text>
        </View>
        <Text style={styles.title}>Start Your Journey</Text>
        <Text style={styles.description}>
          Discover destinations, create itineraries, and connect with fellow travelers.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Ionicons name="compass-outline" size={20} color={Colors.teal500} />
            <Text style={styles.featureText}>Explore curated destinations</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="map-outline" size={20} color={Colors.teal500} />
            <Text style={styles.featureText}>Build smart itineraries</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="people-outline" size={20} color={Colors.teal500} />
            <Text style={styles.featureText}>Join a travel community</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            trackHomeEvent('widget_clicked', { widget: 'explore_plans' });
            router.push('/explore');
          }}
          accessibilityRole="button"
          accessibilityLabel="Explore plans"
        >
          <Text style={styles.primaryBtnText}>Explore Plans</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => {
            trackHomeEvent('create_started');
            router.push('/create');
          }}
          accessibilityRole="button"
          accessibilityLabel="Create your first plan"
        >
          <Text style={styles.secondaryBtnText}>Create Your First Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    borderRadius: Radius.m,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: Spacing.l,
    gap: Spacing.m,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.blue50,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.circular,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.micro,
    fontWeight: '700',
    color: Colors.blue500,
    letterSpacing: 0.5,
  },
  title: {
    ...Typography.headingL,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  description: {
    ...Typography.body,
    color: Colors.secondaryText,
    lineHeight: 24,
  },
  features: {
    gap: Spacing.s,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  featureText: {
    ...Typography.body,
    color: Colors.primaryText,
  },
  primaryBtn: {
    backgroundColor: Colors.blue500,
    height: 48,
    borderRadius: Radius.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: Radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.blue500,
  },
  secondaryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.blue500,
  },
});
