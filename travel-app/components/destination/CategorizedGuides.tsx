import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { DestinationSection } from '../../constants/destinationTypes';

interface CategorizedGuidesProps {
  onPressCategory: (section: DestinationSection) => void;
}

const CATEGORIES = [
  { id: 'food', label: 'Food & Drink Guide', icon: 'restaurant', color: Colors.orange500, bg: '#FFF7ED' },
  { id: 'stay', label: 'Where to Stay', icon: 'bed', color: Colors.blue600, bg: '#EFF6FF' },
  { id: 'transport', label: 'Getting Around', icon: 'bus', color: Colors.teal600, bg: '#F0FDFA' },
  { id: 'events', label: 'Local Events', icon: 'calendar', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'community', label: 'Community Tips', icon: 'people', color: '#EC4899', bg: '#FDF2F8' },
] as const;

export default function CategorizedGuides({ onPressCategory }: CategorizedGuidesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>More to Explore</Text>
      
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.card}
            onPress={() => onPressCategory(cat.id as DestinationSection)}
          >
            <View style={[styles.iconBox, { backgroundColor: cat.bg }]}>
              <Ionicons name={cat.icon as any} size={24} color={cat.color} />
            </View>
            <Text style={styles.label}>{cat.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.placeholder} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.primaryText,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  grid: {
    paddingHorizontal: Spacing.m,
    gap: Spacing.s,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  label: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.primaryText,
    flex: 1,
  },
});
