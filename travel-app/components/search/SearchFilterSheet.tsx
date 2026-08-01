import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, ButtonSize, Shadows, InputSize } from '../../constants/tokens';
import type { SearchFilters, SearchDifficulty, SearchSortOption } from '../../constants/searchTypes';

interface SearchFilterSheetProps {
  visible: boolean;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  onReset: () => void;
  onClose: () => void;
  onSavePreset?: (name: string) => void;
}

const SORT_OPTIONS: { key: SearchSortOption; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'popularity', label: 'Most Popular' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'newest', label: 'Newest First' },
  { key: 'price_low', label: 'Price: Low → High' },
  { key: 'price_high', label: 'Price: High → Low' },
];

export default function SearchFilterSheet({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
  onSavePreset,
}: SearchFilterSheetProps) {
  const [local, setLocal] = useState<SearchFilters>({ ...filters });

  const updateLocal = (patch: Partial<SearchFilters>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset} accessibilityLabel="Reset filters">
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Destination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destination</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={18} color={Colors.placeholder} />
              <TextInput
                style={styles.input}
                placeholder="Any destination"
                placeholderTextColor={Colors.placeholder}
                value={local.destination ?? ''}
                onChangeText={(t) => updateLocal({ destination: t || null })}
              />
            </View>
          </View>

          {/* Budget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget (₹)</Text>
            <View style={styles.rangeRow}>
              <View style={[styles.inputContainer, styles.rangeInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  placeholderTextColor={Colors.placeholder}
                  keyboardType="numeric"
                  value={local.budgetMin?.toString() ?? ''}
                  onChangeText={(t) => updateLocal({ budgetMin: t ? Number(t) : null })}
                />
              </View>
              <Text style={styles.rangeSeparator}>–</Text>
              <View style={[styles.inputContainer, styles.rangeInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  placeholderTextColor={Colors.placeholder}
                  keyboardType="numeric"
                  value={local.budgetMax?.toString() ?? ''}
                  onChangeText={(t) => updateLocal({ budgetMax: t ? Number(t) : null })}
                />
              </View>
            </View>
          </View>


          {/* Sort */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            {SORT_OPTIONS.map((opt) => {
              const selected = local.sort === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.sortOption}
                  onPress={() => updateLocal({ sort: opt.key })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.sortText, selected && styles.sortTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom CTAs */}
        <View style={styles.bottomRow}>
          {onSavePreset && (
            <TouchableOpacity
              style={styles.savePresetButton}
              onPress={() => onSavePreset('My Filter')}
              accessibilityLabel="Save filter preset"
            >
              <Ionicons name="bookmark-outline" size={18} color={Colors.blue500} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
            accessibilityLabel="Apply filters"
          >
            <Text style={styles.applyText}>Apply Filters</Text>
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
    zIndex: 50,
  },
  backdrop: {
    flex: 0.15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    flex: 0.85,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    ...Shadows.bottomSheet,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginTop: Spacing.m,
    marginBottom: Spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    ...Typography.headingM,
    color: Colors.primaryText,
  },
  resetText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  section: {
    paddingTop: Spacing.l,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: Radius.s,
    paddingHorizontal: Spacing.m,
    gap: Spacing.s,
  },
  input: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.primaryText,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    ...Typography.body,
    color: Colors.secondaryText,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  chip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    backgroundColor: Colors.blue500,
    borderColor: Colors.blue500,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.white,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: Spacing.s,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
    paddingVertical: Spacing.s + 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.circular,
    borderWidth: 2,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.blue500,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: Radius.circular,
    backgroundColor: Colors.blue500,
  },
  sortText: {
    ...Typography.body,
    color: Colors.primaryText,
  },
  sortTextSelected: {
    color: Colors.blue500,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  savePresetButton: {
    width: ButtonSize.medium,
    height: ButtonSize.medium,
    borderRadius: ButtonSize.radius,
    borderWidth: 1,
    borderColor: Colors.blue500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    height: ButtonSize.primary,
    borderRadius: ButtonSize.radius,
    backgroundColor: Colors.blue500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
