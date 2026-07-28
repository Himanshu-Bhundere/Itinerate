import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import type { RoutePreviewData } from '../../constants/exploreTypes';

interface Props {
  route: RoutePreviewData;
  onOpenExternal: () => void;
  onClose: () => void;
}

const TRAFFIC_COLORS: Record<string, string> = {
  low: '#16A34A',
  moderate: '#F59E0B',
  heavy: '#DC2626',
};

/** Screen 08 — route info bar: travel time, distance, traffic + Open in Maps CTA */
export default function RoutePreviewOverlay({ route, onOpenExternal, onClose }: Props) {
  useEffect(() => {
    const onBackPress = () => {
      onClose();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [onClose]);

  const trafficColor = TRAFFIC_COLORS[route.trafficLevel] ?? Colors.secondaryText;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityLabel="Close route preview"
        >
          <Ionicons name="close" size={18} color={Colors.primaryText} />
        </TouchableOpacity>

        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color={Colors.blue500} />
            <Text style={styles.infoValue}>{route.durationMin} min</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Ionicons name="navigate-outline" size={16} color={Colors.teal500} />
            <Text style={styles.infoValue}>{route.distanceKm} km</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Ionicons name="car-outline" size={16} color={trafficColor} />
            <Text style={[styles.infoValue, { color: trafficColor }]}>
              {route.trafficLevel.charAt(0).toUpperCase() + route.trafficLevel.slice(1)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.openBtn}
          onPress={onOpenExternal}
          accessibilityRole="button"
          accessibilityLabel="Open in external maps"
        >
          <Ionicons name="open-outline" size={16} color={Colors.white} />
          <Text style={styles.openBtnText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.l,
    right: Spacing.l,
    zIndex: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.l,
    padding: Spacing.m,
    ...Shadows.card,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoValue: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.divider,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.blue500,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    marginLeft: Spacing.s,
  },
  openBtnText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },
});
