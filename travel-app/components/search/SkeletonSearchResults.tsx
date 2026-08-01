import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors, Spacing, Radius } from '../../constants/tokens';

function ShimmerBlock({ width, height, style }: { width: number | string; height: number; style?: object }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          backgroundColor: Colors.divider,
          borderRadius: Radius.xs,
        },
        style,
        animStyle,
      ]}
    />
  );
}

export default function SkeletonSearchResults() {
  return (
    <View style={styles.container}>
      {/* Skeleton result cards */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.card}>
          {/* Image placeholder */}
          <ShimmerBlock width={64} height={64} style={{ borderRadius: Radius.s, marginRight: Spacing.m }} />

          {/* Text placeholders */}
          <View style={styles.textContainer}>
            {/* Type badge */}
            <ShimmerBlock width={60} height={16} style={{ marginBottom: 6, borderRadius: Radius.circular }} />
            {/* Title */}
            <ShimmerBlock width={'85%' as unknown as number} height={16} style={{ marginBottom: 6 }} />
            {/* Subtitle */}
            <ShimmerBlock width={'60%' as unknown as number} height={12} style={{ marginBottom: 6 }} />
            {/* Meta */}
            <View style={styles.metaRow}>
              <ShimmerBlock width={80} height={12} />
              <ShimmerBlock width={50} height={12} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginBottom: Spacing.s,
  },
  textContainer: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.s,
  },
});
