import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface OfflineBannerProps {
  isSlowNetwork?: boolean;
}

export default function OfflineBanner({ isSlowNetwork = false }: OfflineBannerProps) {
  return (
    <View style={[styles.container, isSlowNetwork ? styles.slowBg : styles.offlineBg]}>
      <Ionicons
        name={isSlowNetwork ? 'cellular-outline' : 'cloud-offline-outline'}
        size={16}
        color={isSlowNetwork ? Colors.warning : Colors.white}
      />
      <Text style={[styles.text, isSlowNetwork && styles.slowText]}>
        {isSlowNetwork
          ? 'Slow connection — showing cached results'
          : "You're offline — showing cached results"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  offlineBg: {
    backgroundColor: Colors.offline,
  },
  slowBg: {
    backgroundColor: '#FEF9C3',
  },
  text: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  slowText: {
    color: '#92400E',
  },
});
