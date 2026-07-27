import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { DestinationEdgeState } from '../../constants/destinationTypes';

interface DestinationEdgeStatesProps {
  state: DestinationEdgeState;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export default function DestinationEdgeStates({ 
  state, 
  onRetry,
  onGoBack 
}: DestinationEdgeStatesProps) {
  if (state === 'idle') return null;

  if (state === 'loading') {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size="large" color={Colors.blue500} />
        <Text style={styles.loadingText}>Loading Destination...</Text>
      </View>
    );
  }

  // Banners for non-blocking states (offline, slow network)
  if (state === 'offline' || state === 'slow_network') {
    return (
      <View style={[
        styles.banner, 
        state === 'offline' ? styles.bannerOffline : styles.bannerWarning
      ]}>
        <Ionicons 
          name={state === 'offline' ? 'cloud-offline' : 'speedometer'} 
          size={20} 
          color={Colors.white} 
        />
        <Text style={styles.bannerText}>
          {state === 'offline' 
            ? 'You are offline. Showing downloaded content.'
            : 'Slow network detected. Content may take longer to load.'}
        </Text>
      </View>
    );
  }

  // Blocking errors
  return (
    <View style={styles.fullScreen}>
      <View style={styles.errorIconBox}>
        <Ionicons 
          name={state === 'maintenance' ? 'construct' : 'alert-circle'} 
          size={48} 
          color={Colors.danger} 
        />
      </View>
      <Text style={styles.errorTitle}>
        {state === 'maintenance' ? 'Under Maintenance' : 'Oops! Something went wrong.'}
      </Text>
      <Text style={styles.errorText}>
        {state === 'maintenance' 
          ? 'We are currently updating our destination data. Please check back later.'
          : 'We could not load this destination. Please check your connection and try again.'}
      </Text>
      
      <View style={styles.actionRow}>
        {onGoBack && (
          <Pressable style={styles.secondaryButton} onPress={onGoBack}>
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </Pressable>
        )}
        {state !== 'maintenance' && onRetry && (
          <Pressable style={styles.primaryButton} onPress={onRetry}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 100,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.secondaryText,
    marginTop: Spacing.m,
  },
  banner: {
    position: 'absolute',
    top: 50, // rough safe area
    left: Spacing.m,
    right: Spacing.m,
    padding: Spacing.m,
    borderRadius: Radius.m,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerOffline: {
    backgroundColor: Colors.offline,
  },
  bannerWarning: {
    backgroundColor: Colors.orange500,
  },
  bannerText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '500',
    marginLeft: Spacing.s,
    flex: 1,
  },
  errorIconBox: {
    width: 96,
    height: 96,
    borderRadius: Radius.circular,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  errorTitle: {
    ...Typography.headingL,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  errorText: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  primaryButton: {
    backgroundColor: Colors.blue500,
    paddingHorizontal: Spacing.l,
    paddingVertical: 14,
    borderRadius: Radius.s,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.disabledBg,
    paddingHorizontal: Spacing.l,
    paddingVertical: 14,
    borderRadius: Radius.s,
    minWidth: 120,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.primaryText,
    fontWeight: '600',
  },
});
