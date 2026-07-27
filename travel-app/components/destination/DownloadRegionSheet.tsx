import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { DestinationMetadata } from '../../constants/destinationTypes';

interface DownloadRegionSheetProps {
  metadata: DestinationMetadata;
  onClose: () => void;
  onDownloadComplete: () => void;
}

export default function DownloadRegionSheet({ 
  metadata, 
  onClose, 
  onDownloadComplete 
}: DownloadRegionSheetProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    progress.addListener(({ value }) => {
      setProgressValue(value);
    });
    return () => progress.removeAllListeners();
  }, [progress]);

  const handleDownload = () => {
    setIsDownloading(true);
    Animated.timing(progress, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      onDownloadComplete();
    });
  };

  return (
    <Modal visible={true} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} disabled={isDownloading} />
      
      <View style={styles.sheet}>
        <View style={styles.handle} />
        
        <Text style={styles.title}>Download {metadata.name}</Text>
        <Text style={styles.description}>
          Get offline access to maps, saved itineraries, places, and emergency contacts.
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="map-outline" size={20} color={Colors.secondaryText} />
            <Text style={styles.infoText}>Detailed regional map</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="compass-outline" size={20} color={Colors.secondaryText} />
            <Text style={styles.infoText}>Offline routing</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color={Colors.secondaryText} />
            <Text style={styles.infoText}>Travel tips & guides</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="server-outline" size={20} color={Colors.secondaryText} />
            <Text style={styles.infoText}>Est. size: 45 MB</Text>
          </View>
        </View>

        {isDownloading ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <Animated.View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: progress.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%']
                    }) 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progressValue)}% Downloaded</Text>
          </View>
        ) : (
          <Pressable style={styles.downloadButton} onPress={handleDownload}>
            <Ionicons name="cloud-download" size={20} color={Colors.white} />
            <Text style={styles.downloadButtonText}>Start Download</Text>
          </Pressable>
        )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingTop: Spacing.s,
    ...Shadows.bottomSheet,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    ...Typography.headingM,
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  description: {
    ...Typography.body,
    color: Colors.secondaryText,
    marginBottom: Spacing.l,
  },
  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: Spacing.s,
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
  },
  downloadButton: {
    backgroundColor: Colors.blue500,
    borderRadius: Radius.m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: Spacing.s,
  },
  downloadButtonText: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.white,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.disabledBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.s,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.blue500,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});
