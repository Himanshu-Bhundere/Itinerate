import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { QUICK_ACTIONS, MarkerQuickAction } from '../../constants/exploreTypes';

interface Props {
  visible: boolean;
  markerTitle: string;
  onAction: (action: MarkerQuickAction) => void;
  onClose: () => void;
}

/** Long-press quick actions sheet: Save, Share, Navigate, Create Plan Here, Report */
export default function MarkerQuickActions({ visible, markerTitle, onAction, onClose }: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title} numberOfLines={1}>{markerTitle}</Text>

          <View style={styles.actions}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.actionItem}
                onPress={() => {
                  onAction(action.key);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons
                    name={action.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={action.color}
                  />
                </View>
                <Text style={[styles.actionLabel, action.destructive && styles.destructiveLabel]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.l,
    paddingBottom: Spacing['3xl'],
    ...Shadows.bottomSheet,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginBottom: Spacing.m,
  },
  title: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: Spacing.l,
  },
  actions: {
    gap: Spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    borderRadius: Radius.m,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  destructiveLabel: {
    color: Colors.danger,
  },
});
