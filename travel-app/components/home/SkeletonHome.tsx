import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/tokens';

/** Screen 01 – Skeleton loading state for the Home screen */
export default function SkeletonHome() {
  const insets = useSafeAreaInsets();

  const SkeletonBlock = ({ width, height, style }: { width: number | string; height: number; style?: object }) => (
    <View style={[styles.skeleton, { width: width as number, height }, style]} />
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* App Bar Skeleton */}
      <View style={styles.appBar}>
        <SkeletonBlock width={120} height={28} />
        <SkeletonBlock width={100} height={28} style={{ borderRadius: 14 }} />
        <SkeletonBlock width={36} height={36} style={{ borderRadius: 18 }} />
      </View>

      {/* Search Bar Skeleton */}
      <View style={styles.searchSkeleton}>
        <SkeletonBlock width={'100%' as unknown as number} height={48} style={{ borderRadius: 24 }} />
      </View>

      {/* Greeting Skeleton */}
      <View style={styles.section}>
        <SkeletonBlock width={220} height={24} />
        <SkeletonBlock width={280} height={16} style={{ marginTop: 8 }} />
      </View>

      {/* Hero Card Skeleton */}
      <View style={styles.section}>
        <SkeletonBlock width={'100%' as unknown as number} height={200} style={{ borderRadius: 16 }} />
      </View>

      {/* Cards Row Skeleton */}
      <View style={styles.section}>
        <SkeletonBlock width={160} height={20} />
        <View style={styles.cardsRow}>
          <SkeletonBlock width={180} height={180} style={{ borderRadius: 12 }} />
          <SkeletonBlock width={180} height={180} style={{ borderRadius: 12 }} />
        </View>
      </View>

      {/* Second Cards Row Skeleton */}
      <View style={styles.section}>
        <SkeletonBlock width={140} height={20} />
        <View style={styles.cardsRow}>
          <SkeletonBlock width={160} height={140} style={{ borderRadius: 12 }} />
          <SkeletonBlock width={160} height={140} style={{ borderRadius: 12 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  skeleton: {
    backgroundColor: Colors.divider,
    borderRadius: 8,
    opacity: 0.6,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
  },
  searchSkeleton: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: Spacing.m,
    marginTop: Spacing.s,
  },
});
