import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface Props {
  onRetry: () => void;
}

/** Screen 15 — offline banner: greyed features + retry */
export default function ExploreOfflineBanner({ onRetry }: Props) {
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={18} color={Colors.offline} />
      <Text style={styles.text}>You're offline. Some features are unavailable.</Text>
      <TouchableOpacity
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry connection"
      >
        <Ionicons name="refresh-outline" size={18} color={Colors.blue500} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    marginHorizontal: Spacing.l,
    borderRadius: Radius.m,
  },
  text: {
    flex: 1,
    ...Typography.caption,
    color: Colors.primaryText,
    fontWeight: '500',
  },
});
