import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface FloatingAIAssistantProps {
  onPress: () => void;
}

export default function FloatingAIAssistant({ onPress }: FloatingAIAssistantProps) {
  const [expanded, setExpanded] = useState(false);
  const widthAnim = React.useRef(new Animated.Value(48)).current;
  const insets = useSafeAreaInsets();

  const toggleExpand = () => {
    Animated.timing(widthAnim, {
      toValue: expanded ? 48 : 160,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <Animated.View style={[
      styles.container, 
      { width: widthAnim, bottom: Math.max(insets.bottom, Spacing.m) + 80 }
    ]}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={expanded ? onPress : toggleExpand}
        activeOpacity={0.8}
      >
        <Ionicons name="sparkles" size={20} color={Colors.white} />
        {expanded && (
          <Text style={styles.text} numberOfLines={1}>
            Ask AI Assistant
          </Text>
        )}
      </TouchableOpacity>
      
      {expanded && (
        <TouchableOpacity 
          style={styles.closeBtn} 
          onPress={(e) => { e.stopPropagation(); toggleExpand(); }}
        >
          <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Spacing.m,
    height: 48,
    backgroundColor: Colors.blue900,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.blue500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: Spacing.s,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
