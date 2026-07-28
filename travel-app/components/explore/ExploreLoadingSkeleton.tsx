import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/tokens';

/** Screen 01 — skeleton shimmer for initial explore load */
export default function ExploreLoadingSkeleton() {
  return (
    <View style={styles.container}>
      {/* Search bar skeleton */}
      <View style={styles.searchSkeleton} />

      {/* Mode pills skeleton */}
      <View style={styles.pillsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.pillSkeleton} />
        ))}
      </View>

      {/* Cards skeleton */}
      <View style={styles.cardsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.cardSkeleton} />
        ))}
      </View>

      {/* List items skeleton */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.listItemSkeleton}>
          <View style={styles.thumbSkeleton} />
          <View style={styles.linesSkeleton}>
            <View style={styles.lineLong} />
            <View style={styles.lineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.l,
    gap: Spacing.m,
  },
  searchSkeleton: {
    height: 48,
    borderRadius: Radius.circular,
    backgroundColor: Colors.disabledBg,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.s,
  },
  pillSkeleton: {
    width: 80,
    height: 36,
    borderRadius: Radius.circular,
    backgroundColor: Colors.disabledBg,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  cardSkeleton: {
    width: 200,
    height: 180,
    borderRadius: Radius.l,
    backgroundColor: Colors.disabledBg,
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  thumbSkeleton: {
    width: 56,
    height: 56,
    borderRadius: Radius.s,
    backgroundColor: Colors.disabledBg,
  },
  linesSkeleton: {
    flex: 1,
    gap: 6,
  },
  lineLong: {
    height: 12,
    width: '70%',
    borderRadius: 6,
    backgroundColor: Colors.disabledBg,
  },
  lineShort: {
    height: 10,
    width: '45%',
    borderRadius: 5,
    backgroundColor: Colors.disabledBg,
  },
});
