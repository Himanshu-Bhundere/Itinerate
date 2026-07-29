import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { trackHomeEvent } from '../../lib/analytics';

/** Screen 18 – Empty Home state when no personalized data */
export default function HomeEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="compass-outline" size={56} color={Colors.blue500} />
      </View>
      <Text style={styles.title}>Your travel world is empty</Text>
      <Text style={styles.description}>
        Start exploring destinations or create your first plan to get personalized recommendations.
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            trackHomeEvent('create_started');
            router.push('/create');
          }}
          accessibilityRole="button"
          accessibilityLabel="Create a plan"
        >
          <Ionicons name="add" size={20} color={Colors.white} />
          <Text style={styles.primaryBtnText}>Create Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => {
            trackHomeEvent('widget_clicked', { widget: 'explore' });
            router.push('/explore');
          }}
          accessibilityRole="button"
          accessibilityLabel="Explore destinations"
        >
          <Ionicons name="search" size={20} color={Colors.blue500} />
          <Text style={styles.secondaryBtnText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  description: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.l,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.blue500,
    paddingHorizontal: Spacing.l,
    height: 48,
    borderRadius: Radius.s,
  },
  primaryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.blue500,
    paddingHorizontal: Spacing.l,
    height: 48,
    borderRadius: Radius.s,
  },
  secondaryBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.blue500,
  },
});
