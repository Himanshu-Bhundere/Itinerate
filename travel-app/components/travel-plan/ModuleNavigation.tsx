import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { ModuleId } from '../../constants/travelPlanTypes';

interface ModuleConfig {
  id: ModuleId;
  label: string;
  badgeCount?: number;
}

const MODULES: ModuleConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline', badgeCount: 3 },
  { id: 'route', label: 'Route' },
  { id: 'places', label: 'Places' },
  { id: 'activities', label: 'Activities' },
  { id: 'budget', label: 'Budget' },
  { id: 'packing', label: 'Packing' },
  { id: 'documents', label: 'Documents' },
  { id: 'travelers', label: 'Travelers' },
  { id: 'media', label: 'Media' },
  { id: 'ai', label: 'AI Assistant' },
  { id: 'discussion', label: 'Discussion', badgeCount: 12 },
  { id: 'versions', label: 'Versions' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

interface ModuleNavigationProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
}

export default function ModuleNavigation({ activeModule, onSelectModule }: ModuleNavigationProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MODULES.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <TouchableOpacity 
              key={mod.id} 
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onSelectModule(mod.id)}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {mod.label}
              </Text>
              {mod.badgeCount !== undefined && mod.badgeCount > 0 && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {mod.badgeCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingVertical: Spacing.s,
  },
  scrollContent: {
    paddingHorizontal: Spacing.m,
    gap: Spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    backgroundColor: 'transparent',
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.blue50,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.blue600,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.divider,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.circular,
  },
  badgeActive: {
    backgroundColor: Colors.blue500,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  badgeTextActive: {
    color: Colors.white,
  }
});
