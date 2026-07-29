import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';

interface Props {
  message: string;
  onDismiss: () => void;
  onUndo?: () => void;
}

/** Screen 15 – Save interaction toast with undo */
export default function SaveToast({ message, onDismiss, onUndo }: Props) {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [translateY]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.content}>
        <Ionicons
          name={message.includes('Saved') ? 'heart' : 'checkmark-circle'}
          size={20}
          color={message.includes('Saved') ? Colors.danger : Colors.success}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.actions}>
        {onUndo && (
          <TouchableOpacity
            onPress={onUndo}
            style={styles.undoBtn}
            accessibilityRole="button"
            accessibilityLabel="Undo"
          >
            <Text style={styles.undoText}>Undo</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        >
          <Ionicons name="close" size={18} color={Colors.secondaryText} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.m,
    right: Spacing.m,
    backgroundColor: Colors.primaryText,
    borderRadius: Radius.s,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    flex: 1,
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.white,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  undoBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.s,
  },
  undoText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.blue300,
  },
});
