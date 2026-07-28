import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/tokens';

interface Props {
  onLayersPress: () => void;
  onRecenterPress: () => void;
  onCompassPress: () => void;
  compassHeading: number | null;
}

/** Floating map controls — Layers, Compass, Recenter. Visible when panel is collapsed. */
export default function MapControls({ onLayersPress, onRecenterPress, onCompassPress, compassHeading }: Props) {
  const showCompass = compassHeading !== null && compassHeading !== 0;

  return (
    <View style={styles.container}>


      {showCompass && (
        <TouchableOpacity
          style={styles.button}
          onPress={onCompassPress}
          accessibilityLabel="Reset compass"
          accessibilityRole="button"
        >
          <Ionicons
            name="compass-outline"
            size={20}
            color={Colors.primaryText}
            style={{ transform: [{ rotate: `${-(compassHeading ?? 0)}deg` }] }}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onRecenterPress}
        accessibilityLabel="Recenter map"
        accessibilityRole="button"
      >
        <Ionicons name="locate-outline" size={20} color={Colors.blue500} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    marginRight: 16,
  },
  button: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
