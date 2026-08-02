import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';
import { UserRole } from '../../constants/travelPlanTypes';

interface StickyActionAreaProps {
  userRole: UserRole;
  onAction: (action: string) => void;
}

export default function StickyActionArea({ userRole, onAction }: StickyActionAreaProps) {
  const insets = useSafeAreaInsets();

  const renderActions = () => {
    switch (userRole) {
      case 'organizer':
      case 'creator':
        return (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={() => onAction('edit')}>
              <Ionicons name="create-outline" size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Edit Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => onAction('publish')}>
              <Ionicons name="globe-outline" size={20} color={Colors.blue600} />
              <Text style={styles.secondaryButtonText}>Publish</Text>
            </TouchableOpacity>
          </>
        );
      case 'traveler':
        return (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={() => onAction('book')}>
              <Ionicons name="card-outline" size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Book</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => onAction('clone')}>
              <Ionicons name="copy-outline" size={20} color={Colors.blue600} />
              <Text style={styles.secondaryButtonText}>Clone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => onAction('download')}>
              <Ionicons name="cloud-download-outline" size={20} color={Colors.primaryText} />
            </TouchableOpacity>
          </>
        );
      case 'collaborator':
        return (
          <TouchableOpacity style={styles.primaryButton} onPress={() => onAction('edit_section')}>
            <Ionicons name="create-outline" size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>Edit Assigned Section</Text>
          </TouchableOpacity>
        );
      case 'viewer':
      default:
        return (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={() => onAction('save')}>
              <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => onAction('share')}>
              <Ionicons name="share-outline" size={20} color={Colors.blue600} />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.m) }]}>
      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceElevated,
    flexDirection: 'row',
    paddingHorizontal: Spacing.m,
    paddingTop: Spacing.m,
    gap: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: Colors.blue500,
    borderRadius: Radius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: Spacing.xs,
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.blue50,
    borderRadius: Radius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: Spacing.xs,
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.blue600,
    fontWeight: '600',
  },
  iconButton: {
    width: 50,
    backgroundColor: Colors.disabledBg,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
