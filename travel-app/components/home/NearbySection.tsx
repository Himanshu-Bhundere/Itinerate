import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { NearbyAdventure } from '../../stores/useHomeStore';
import { trackHomeEvent } from '../../lib/analytics';

interface Props {
  adventures: NearbyAdventure[];
}

const TYPE_ICONS: Record<NearbyAdventure['type'], string> = {
  trek: 'trail-sign-outline',
  stay: 'bed-outline',
  meetup: 'people-outline',
  experience: 'sparkles-outline',
};

const TYPE_COLORS: Record<NearbyAdventure['type'], string> = {
  trek: Colors.teal500,
  stay: Colors.blue500,
  meetup: Colors.orange500,
  experience: '#8B5CF6',
};

/** Screen 09 – Nearby Adventures with location-aware discovery */
export default function NearbySection({ adventures }: Props) {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
    } else {
      // Open settings if denied twice
      if (Platform.OS === 'android') {
        Linking.openSettings();
      } else {
        Linking.openURL('app-settings:');
      }
    }
  };

  // Permission denied state – Location Permission Card
  if (permissionGranted === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Nearby Adventures</Text>
        <View style={styles.permissionCard}>
          <Ionicons name="location-outline" size={40} color={Colors.blue500} />
          <Text style={styles.permissionTitle}>Enable Location</Text>
          <Text style={styles.permissionDesc}>
            Allow location access to discover adventures near you.
          </Text>
          <TouchableOpacity
            style={styles.enableBtn}
            onPress={requestPermission}
            accessibilityRole="button"
            accessibilityLabel="Enable location permission"
          >
            <Text style={styles.enableBtnText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (adventures.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Nearby Adventures</Text>
        <TouchableOpacity
          onPress={() => trackHomeEvent('widget_clicked', { widget: 'open_map' })}
          accessibilityRole="button"
          accessibilityLabel="Open map"
        >
          <View style={styles.mapBtn}>
            <Ionicons name="map-outline" size={14} color={Colors.blue500} />
            <Text style={styles.mapBtnText}>Map</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {adventures.map((adventure) => (
          <TouchableOpacity
            key={adventure.id}
            style={styles.card}
            onPress={() => trackHomeEvent('widget_clicked', { widget: 'nearby', adventure_id: adventure.id })}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`View ${adventure.title}`}
          >
            <Image source={{ uri: adventure.image_url }} style={styles.cardImage} />
            <View style={styles.typeBadge}>
              <Ionicons
                name={TYPE_ICONS[adventure.type] as keyof typeof Ionicons.glyphMap}
                size={12}
                color={TYPE_COLORS[adventure.type]}
              />
              <Text style={[styles.typeText, { color: TYPE_COLORS[adventure.type] }]}>
                {adventure.type.charAt(0).toUpperCase() + adventure.type.slice(1)}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>{adventure.title}</Text>
              <View style={styles.distanceRow}>
                <Ionicons name="navigate-outline" size={12} color={Colors.secondaryText} />
                <Text style={styles.distanceText}>{adventure.distance}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Ionicons name="car-outline" size={12} color={Colors.secondaryText} />
                <Text style={styles.distanceText}>{adventure.travelTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
    paddingHorizontal: Spacing.l,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.blue50,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.circular,
  },
  mapBtnText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.blue500,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
    marginTop: Spacing.s,
  },
  card: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  typeBadge: {
    position: 'absolute',
    top: Spacing.s,
    left: Spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: Radius.circular,
  },
  typeText: {
    ...Typography.micro,
    fontWeight: '600',
  },
  cardContent: {
    padding: Spacing.s,
    gap: Spacing.xs,
  },
  cardTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  metaDot: {
    ...Typography.caption,
    color: Colors.divider,
  },
  // Permission Card
  permissionCard: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.s,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.l,
    alignItems: 'center',
    gap: Spacing.s,
    ...Shadows.card,
  },
  permissionTitle: {
    ...Typography.headingS,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  permissionDesc: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
  enableBtn: {
    backgroundColor: Colors.blue500,
    paddingHorizontal: Spacing.l,
    height: 44,
    borderRadius: Radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  enableBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.white,
  },
});
