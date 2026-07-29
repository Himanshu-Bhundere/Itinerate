import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../../constants/tokens';

interface Props {
  visible: boolean;
  onPress: () => void;
}

/** Screen 24 – Scroll To Top floating action button */
export default function ScrollToTopFAB({ visible, onPress }: Props) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Scroll to top"
    >
      <Ionicons name="chevron-up" size={24} color={Colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.l,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.blue500,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.fab,
  },
});
