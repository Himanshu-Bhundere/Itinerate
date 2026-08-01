import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import type { RecentSearch } from '../../constants/searchTypes';

interface RecentSearchItemProps {
  item: RecentSearch;
  onPress: (query: string) => void;
  onRemove: (id: string) => void;
  onPin: (id: string) => void;
}

export default function RecentSearchItem({
  item,
  onPress,
  onRemove,
  onPin,
}: RecentSearchItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.query)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Recent search: ${item.query}`}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.pinned ? 'pin' : 'time-outline'}
          size={16}
          color={item.pinned ? Colors.blue500 : Colors.secondaryText}
        />
      </View>

      <Text style={styles.queryText} numberOfLines={1}>
        {item.query}
      </Text>

      {/* Pin button */}
      <TouchableOpacity
        onPress={() => onPin(item.id)}
        style={styles.actionButton}
        accessibilityLabel={item.pinned ? 'Unpin search' : 'Pin search'}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={item.pinned ? 'pin' : 'pin-outline'}
          size={16}
          color={item.pinned ? Colors.blue500 : Colors.placeholder}
        />
      </TouchableOpacity>

      {/* Remove button */}
      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={styles.actionButton}
        accessibilityLabel="Remove search"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={16} color={Colors.placeholder} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s + 2,
    paddingHorizontal: Spacing.l,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.circular,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  queryText: {
    ...Typography.body,
    color: Colors.primaryText,
    flex: 1,
    fontWeight: '400',
  },
  actionButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
