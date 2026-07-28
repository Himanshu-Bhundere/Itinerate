import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import type { CompareItem } from '../../constants/exploreTypes';

interface Props {
  visible: boolean;
  items: CompareItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

const COMPARE_FIELDS: { key: keyof CompareItem; label: string; icon: string }[] = [
  { key: 'distance', label: 'Distance', icon: 'navigate-outline' },
  { key: 'budget', label: 'Budget', icon: 'wallet-outline' },
  { key: 'difficulty', label: 'Difficulty', icon: 'fitness-outline' },
  { key: 'weather', label: 'Weather', icon: 'partly-sunny-outline' },
  { key: 'crowd', label: 'Crowd', icon: 'people-outline' },
  { key: 'travelTime', label: 'Travel Time', icon: 'time-outline' },
];

/** Screen 09 — side-by-side comparison of 2–4 destinations */
export default function ComparePlacesSheet({ visible, items, onRemove, onClose }: Props) {
  if (!visible || items.length < 2) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Compare Places</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close comparison">
              <Ionicons name="close" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Column headers */}
            <View style={styles.row}>
              <View style={styles.labelCell} />
              {items.map((item) => (
                <View key={item.id} style={styles.headerCell}>
                  <Text style={styles.headerName} numberOfLines={2}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => onRemove(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={16} color={Colors.placeholder} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Comparison rows */}
            {COMPARE_FIELDS.map((field, idx) => (
              <View key={field.key} style={[styles.row, idx % 2 === 0 && styles.rowAlt]}>
                <View style={styles.labelCell}>
                  <Ionicons
                    name={field.icon as keyof typeof Ionicons.glyphMap}
                    size={14}
                    color={Colors.secondaryText}
                  />
                  <Text style={styles.labelText}>{field.label}</Text>
                </View>
                {items.map((item) => (
                  <View key={item.id} style={styles.valueCell}>
                    <Text style={styles.valueText}>
                      {String(item[field.key] ?? '–')}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '80%',
    ...Shadows.bottomSheet,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginTop: Spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  title: {
    ...Typography.headingS,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing['3xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowAlt: {
    backgroundColor: Colors.surface,
  },
  labelCell: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: Spacing.s,
  },
  labelText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  headerName: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  valueCell: {
    flex: 1,
    alignItems: 'center',
  },
  valueText: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
    textAlign: 'center',
  },
});
