import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/tokens';
import { MARKER_CONFIGS, MarkerType } from '../../constants/exploreTypes';

interface Props {
  type: MarkerType;
  isSelected?: boolean;
  isHighlighted?: boolean;
  clusterCount?: number;
}

/**
 * Custom map marker supporting 16 marker types.
 * Each type has a distinct icon & color. Communicates type before opening.
 * When clusterCount > 0, renders as a cluster bubble.
 */
export default function MapMarkerCustom({ type, isSelected, isHighlighted, clusterCount }: Props) {
  const config = MARKER_CONFIGS[type] ?? MARKER_CONFIGS.destination;

  // Cluster marker
  if (clusterCount && clusterCount > 1) {
    return (
      <View style={[styles.clusterMarker, { backgroundColor: Colors.blue500 }]}>
        <Text style={styles.clusterText}>{clusterCount}</Text>
      </View>
    );
  }

  const size = isSelected ? 40 : isHighlighted ? 36 : 32;

  return (
    <View
      style={[
        styles.marker,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.color,
          borderWidth: isSelected ? 3 : 2,
          borderColor: isSelected ? Colors.white : 'rgba(255,255,255,0.8)',
        },
        isSelected && styles.markerSelected,
      ]}
    >
      <Ionicons
        name={config.icon as keyof typeof Ionicons.glyphMap}
        size={isSelected ? 18 : 14}
        color={Colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  clusterMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  clusterText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
