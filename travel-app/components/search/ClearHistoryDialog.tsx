import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, ButtonSize, Shadows } from '../../constants/tokens';

interface ClearHistoryDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearHistoryDialog({
  visible,
  onConfirm,
  onCancel,
}: ClearHistoryDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.iconContainer}>
            <Ionicons name="trash-outline" size={32} color={Colors.danger} />
          </View>

          <Text style={styles.title}>Clear Search History?</Text>
          <Text style={styles.subtitle}>
            This will remove all your recent searches. This action cannot be undone.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.8}
              accessibilityLabel="Clear history"
            >
              <Text style={styles.confirmText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  dialog: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.dialog,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.circular,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  title: {
    ...Typography.headingM,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.m,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: ButtonSize.medium,
    borderRadius: ButtonSize.radius,
    borderWidth: 1,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    ...Typography.body,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    height: ButtonSize.medium,
    borderRadius: ButtonSize.radius,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
