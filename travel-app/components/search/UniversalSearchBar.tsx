import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows, IconSize, Typography } from '../../constants/tokens';

interface UniversalSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  onVoiceSearchPress?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  autoFocus?: boolean;
  isFocused?: boolean;
  filterCount?: number;
  placeholder?: string;
}

export default function UniversalSearchBar({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onSubmit,
  onClear,
  onFilterPress,
  onVoiceSearchPress,
  onCancel,
  onBack,
  showBackButton = false,
  autoFocus = false,
  isFocused = false,
  filterCount = 0,
  placeholder = 'Search destinations, treks, creators...',
}: UniversalSearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const expandAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: isFocused ? 1 : 0,
      friction: 8,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }, [isFocused, expandAnim]);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  const cancelWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const cancelOpacity = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={IconSize.small} color={Colors.primaryText} />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name="search"
            size={IconSize.small}
            color={isFocused ? Colors.blue500 : Colors.placeholder}
            style={styles.searchIcon}
          />
        )}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          autoFocus={autoFocus}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search input"
          accessibilityHint="Type to search destinations, treks, and more"
        />

        {/* Clear button */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.iconButton}
            accessibilityLabel="Clear search"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={IconSize.small} color={Colors.placeholder} />
          </TouchableOpacity>
        )}

        {/* Voice Search Button (only visible when not typing/focused) */}
        {!isFocused && value.length === 0 && (
          <TouchableOpacity
            onPress={onVoiceSearchPress}
            style={styles.iconButton}
            accessibilityLabel="Voice search"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="mic-outline" size={IconSize.small} color={Colors.secondaryText} />
          </TouchableOpacity>
        )}

        {/* Filter button */}
        <TouchableOpacity
          onPress={onFilterPress}
          style={[styles.filterButton, filterCount > 0 && styles.filterButtonActive]}
          accessibilityLabel={`Filters${filterCount > 0 ? `, ${filterCount} active` : ''}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="options-outline"
            size={IconSize.small}
            color={filterCount > 0 ? Colors.white : Colors.secondaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Cancel button (animated) */}
      <Animated.View style={{ width: cancelWidth, opacity: cancelOpacity, overflow: 'hidden' }}>
        <TouchableOpacity
          onPress={onCancel}
          style={styles.cancelButton}
          accessibilityLabel="Cancel search"
        >
          <Animated.Text style={styles.cancelText} numberOfLines={1}>Cancel</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.m,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    ...Shadows.card,
  },
  searchBarFocused: {
    borderColor: Colors.blue500,
    backgroundColor: Colors.white,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  backButton: {
    marginRight: Spacing.s,
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.body,
    color: Colors.primaryText,
  },
  iconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  filterButtonActive: {
    backgroundColor: Colors.blue500,
  },
  cancelButton: {
    paddingLeft: Spacing.m,
    height: 48,
    justifyContent: 'center',
  },
  cancelText: {
    ...Typography.body,
    color: Colors.blue500,
    fontWeight: '600',
  },
});
