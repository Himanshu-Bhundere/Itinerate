import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../../constants/tokens';
import { TravelPlanMetadata, UserRole } from '../../constants/travelPlanTypes';

interface TravelPlanHeroProps {
  metadata: TravelPlanMetadata;
  scrollY: Animated.Value;
  userRole: UserRole;
  onBack: () => void;
  onShare: () => void;
  onMore: () => void;
}

const HERO_MAX_HEIGHT = 300;
const HERO_MIN_HEIGHT = 100; // Expanded to accommodate title when collapsed

export default function TravelPlanHero({
  metadata,
  scrollY,
  userRole,
  onBack,
  onShare,
  onMore
}: TravelPlanHeroProps) {
  const insets = useSafeAreaInsets();

  const height = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [HERO_MAX_HEIGHT, HERO_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT - 50, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT - 50, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { height }]}>
      {/* Background Image */}
      <Animated.Image
        source={{ uri: metadata.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop' }}
        style={styles.image}
      />
      <View style={styles.overlay} />

      {/* Top Navigation Bar */}
      <View style={[styles.topNav, { top: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>

        <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
          <Text style={styles.headerTitle} numberOfLines={1}>{metadata.title}</Text>
        </Animated.View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconButton} onPress={onShare}>
            <Ionicons name="share-outline" size={22} color={Colors.primaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onMore}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded Hero Content */}
      <Animated.View style={[styles.heroContent, { opacity: titleOpacity }]}>
        {metadata.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{metadata.category.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.title}>{metadata.title}</Text>
        <View style={styles.authorRow}>
          <Text style={styles.authorText}>by {metadata.profiles?.display_name || 'Unknown'}</Text>
          {metadata.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color={Colors.blue400} style={{ marginLeft: 4 }} />
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  topNav: {
    position: 'absolute',
    left: Spacing.m,
    right: Spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.s,
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: Spacing.m,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.bodyLarge,
    color: Colors.white,
    fontWeight: '600',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.l,
    right: Spacing.l,
    zIndex: 15,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: Spacing.s,
  },
  badgeText: {
    ...Typography.micro,
    color: Colors.white,
    fontWeight: '700',
  },
  title: {
    ...Typography.headingXL,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
  }
});
