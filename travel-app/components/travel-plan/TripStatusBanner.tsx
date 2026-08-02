import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { TripLifecycle } from '../../constants/travelPlanTypes';

interface TripStatusBannerProps {
  status: TripLifecycle;
}

export default function TripStatusBanner({ status }: TripStatusBannerProps) {
  let bgColor: string = Colors.blue50;
  let textColor: string = Colors.blue600;
  let iconName: keyof typeof Ionicons.glyphMap = 'calendar-outline';
  let message = '';

  switch (status) {
    case 'upcoming':
      bgColor = Colors.blue50;
      textColor = Colors.blue600;
      iconName = 'calendar-outline';
      message = 'Upcoming Trip';
      break;
    case 'starts_tomorrow':
      bgColor = Colors.warning + '20'; // 20% opacity
      textColor = '#B45309'; // Dark amber
      iconName = 'time-outline';
      message = 'Starts Tomorrow';
      break;
    case 'starts_today':
      bgColor = Colors.orange500 + '20';
      textColor = Colors.orange500;
      iconName = 'alert-circle-outline';
      message = 'Starts Today';
      break;
    case 'live_now':
      bgColor = Colors.success + '20';
      textColor = Colors.success;
      iconName = 'radio-outline';
      message = 'Live Now';
      break;
    case 'completed':
      bgColor = Colors.surface;
      textColor = Colors.secondaryText;
      iconName = 'checkmark-done-outline';
      message = 'Completed';
      break;
    case 'cancelled':
      bgColor = Colors.danger + '20';
      textColor = Colors.danger;
      iconName = 'close-circle-outline';
      message = 'Cancelled';
      break;
    case 'archived':
      bgColor = Colors.surface;
      textColor = Colors.placeholder;
      iconName = 'archive-outline';
      message = 'Archived';
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Ionicons name={iconName} size={16} color={textColor} />
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  text: {
    ...Typography.bodySmall,
    fontWeight: '600',
  }
});
