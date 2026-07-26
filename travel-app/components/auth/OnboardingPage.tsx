import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

interface OnboardingPageProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  accentColor?: string;
}

export default function OnboardingPage({
  icon,
  title,
  subtitle,
  accentColor = Colors.blue500,
}: OnboardingPageProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.page, { width }]}>
      {/* Illustration area */}
      <View style={[styles.illustrationContainer, { backgroundColor: accentColor + '10' }]}>
        <View style={[styles.iconCircle, { backgroundColor: accentColor + '1A' }]}>
          <View style={[styles.iconInner, { backgroundColor: accentColor + '26' }]}>
            <Ionicons name={icon} size={64} color={accentColor} />
          </View>
        </View>
      </View>

      {/* Text content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.l,
  },
  illustrationContainer: {
    width: 240,
    height: 240,
    borderRadius: Radius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: Radius.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: Radius.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
  },
  title: {
    ...Typography.headingL,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
});
