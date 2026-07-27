import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface DestinationAIBannerProps {
  message: string;
  type?: 'suggestion' | 'alert' | 'weather'; // 25, 27, 28
  onPress?: () => void;
}

export default function DestinationAIBanner({ 
  message, 
  type = 'suggestion', 
  onPress 
}: DestinationAIBannerProps) {
  
  const getConfig = () => {
    switch (type) {
      case 'alert':
        return { icon: 'warning', color: Colors.warning, bg: '#FEF9C3' };
      case 'weather':
        return { icon: 'cloudy-night', color: Colors.blue500, bg: Colors.blue50 };
      default:
        return { icon: 'sparkles', color: '#8B5CF6', bg: '#F5F3FF' };
    }
  };

  const config = getConfig();

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: config.bg }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon as any} size={20} color={config.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {type === 'suggestion' ? 'AI Suggestion' : type === 'alert' ? 'Crowd Alert' : 'Weather Update'}
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={16} color={Colors.placeholder} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.m,
    marginVertical: Spacing.s,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  content: {
    flex: 1,
    marginRight: Spacing.s,
  },
  title: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    lineHeight: 20,
  },
});
