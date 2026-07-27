import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { DestinationMetadata } from '../../constants/destinationTypes';

interface DestinationHeroProps {
  metadata: DestinationMetadata;
  scrollY: Animated.Value;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  onSearch: () => void;
}

const HERO_MAX_HEIGHT = 350;
const HERO_MIN_HEIGHT = 100; // Expanded header height with safe area
const SCROLL_DISTANCE = HERO_MAX_HEIGHT - HERO_MIN_HEIGHT;

export default function DestinationHero({
  metadata,
  scrollY,
  onBack,
  onSave,
  onShare,
  onDownload,
  onSearch,
}: DestinationHeroProps) {
  
  // Interpolations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [HERO_MAX_HEIGHT, HERO_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { height: headerHeight }]}>
      <Animated.Image 
        source={{ uri: metadata.heroImageUrl }} 
        style={[styles.image, { opacity: imageOpacity }]} 
        resizeMode="cover" 
      />
      
      {/* Gradient Overlay for text readability */}
      <View style={styles.overlay} />

      {/* Top Nav Bar */}
      <View style={styles.topNav}>
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        
        <View style={styles.topNavActions}>
          <Pressable onPress={onSearch} style={styles.iconButton}>
            <Ionicons name="search" size={22} color={Colors.white} />
          </Pressable>
          <Pressable onPress={onDownload} style={styles.iconButton}>
            <Ionicons 
              name={metadata.isDownloaded ? "cloud-done" : "cloud-download-outline"} 
              size={22} 
              color={metadata.isDownloaded ? Colors.teal400 : Colors.white} 
            />
          </Pressable>
          <Pressable onPress={onShare} style={styles.iconButton}>
            <Ionicons name="share-outline" size={22} color={Colors.white} />
          </Pressable>
          <Pressable onPress={onSave} style={styles.iconButton}>
            <Ionicons 
              name={metadata.isSaved ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={metadata.isSaved ? Colors.teal400 : Colors.white} 
            />
          </Pressable>
        </View>
      </View>

      {/* Destination Title Area */}
      <Animated.View 
        style={[
          styles.titleContainer, 
          { 
            transform: [
              { scale: titleScale },
              { translateY: titleTranslateY }
            ] 
          }
        ]}
      >
        <Text style={styles.country}>{metadata.country.toUpperCase()}</Text>
        <Text style={styles.title}>{metadata.name}</Text>
        
        {/* Quick Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.ratingText}>{metadata.rating}</Text>
          </View>
          <Text style={styles.metaDivider}>•</Text>
          <View style={styles.weatherBadge}>
            <Ionicons name="partly-sunny" size={14} color={Colors.white} />
            <Text style={styles.weatherText}>{metadata.currentTemperature}°</Text>
          </View>
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
    backgroundColor: Colors.blue900,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingTop: 50, // rough safe area
    zIndex: 20,
  },
  topNavActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.circular,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.l,
    right: Spacing.l,
    zIndex: 20,
  },
  country: {
    ...Typography.caption,
    color: Colors.teal300,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
    fontWeight: '700',
  },
  title: {
    ...Typography.displayL,
    color: Colors.white,
    marginBottom: Spacing.s,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.s,
    gap: 4,
  },
  ratingText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '600',
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.s,
    gap: 4,
  },
  weatherText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '600',
  },
  metaDivider: {
    color: Colors.white,
    opacity: 0.5,
  },
});
