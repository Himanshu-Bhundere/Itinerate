import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import type { FilterPreset } from '../../constants/searchTypes';

interface Props {
  visible: boolean;
  presets: FilterPreset[];
  onApply: (preset: FilterPreset) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

/** Screen 19 – Saved Filter Presets bottom sheet */
export default function SavedFiltersSheet({
  visible,
  presets,
  onApply,
  onDelete,
  onClose,
}: Props) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Saved Filters</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close saved filters">
              <Ionicons name="close" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          {presets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={48} color={Colors.placeholder} />
              <Text style={styles.emptyTitle}>No saved filters</Text>
              <Text style={styles.emptyDesc}>
                Save filter combinations from the filter panel to quickly apply them later.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {presets.map((preset) => {
                const filterSummary = buildFilterSummary(preset);
                return (
                  <View key={preset.id} style={styles.presetCard}>
                    <TouchableOpacity
                      style={styles.presetContent}
                      onPress={() => onApply(preset)}
                      accessibilityRole="button"
                      accessibilityLabel={`Apply ${preset.name} filter`}
                    >
                      <View style={styles.presetIcon}>
                        <Ionicons name="funnel" size={18} color={Colors.teal500} />
                      </View>
                      <View style={styles.presetInfo}>
                        <Text style={styles.presetName}>{preset.name}</Text>
                        <Text style={styles.presetSummary} numberOfLines={1}>
                          {filterSummary}
                        </Text>
                        <Text style={styles.presetDate}>
                          Saved {new Date(preset.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => onDelete(preset.id)}
                      accessibilityLabel={`Delete ${preset.name}`}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Build a human-readable summary from a filter preset
function buildFilterSummary(preset: FilterPreset): string {
  const parts: string[] = [];
  const f = preset.filters;
  if (f.destination) parts.push(f.destination);
  if (f.budgetMin !== null || f.budgetMax !== null) {
    parts.push(`₹${f.budgetMin ?? 0}–${f.budgetMax ?? '∞'}`);
  }
  if (f.durationMin !== null || f.durationMax !== null) {
    parts.push(`${f.durationMin ?? 1}–${f.durationMax ?? '∞'} days`);
  }
  if (f.difficulty) parts.push(f.difficulty);
  if (f.travelStyle.length > 0) parts.push(f.travelStyle.join(', '));
  if (f.season.length > 0) parts.push(f.season.join(', '));
  return parts.length > 0 ? parts.join(' • ') : 'All filters';
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '70%',
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

  // Empty
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.m,
  },
  emptyTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  emptyDesc: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  presetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.m,
  },
  presetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.teal50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetInfo: {
    flex: 1,
    gap: 2,
  },
  presetName: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  presetSummary: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  presetDate: {
    ...Typography.micro,
    color: Colors.placeholder,
  },
  deleteBtn: {
    padding: Spacing.s,
  },
});
