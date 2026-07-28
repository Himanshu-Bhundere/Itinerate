import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const STEPS = [
  {
    icon: 'map-outline' as const,
    title: 'Persistent Map',
    desc: 'The map stays as you browse. Pan, zoom, and explore freely.',
    color: Colors.blue500,
  },
  {
    icon: 'swap-vertical-outline' as const,
    title: 'Swipe Up for Feed',
    desc: 'Drag the bottom panel up to see cards. Tap a card to highlight it on the map.',
    color: Colors.teal500,
  },
  {
    icon: 'layers-outline' as const,
    title: '15 Discovery Modes',
    desc: 'Switch between Nearby, Trending, Trekking, Food, and more. The map updates instantly.',
    color: Colors.orange500,
  },
  {
    icon: 'hand-left-outline' as const,
    title: 'Long-Press Markers',
    desc: 'Long-press any marker for quick actions: Save, Share, Navigate, or Create a Plan.',
    color: '#9333EA',
  },
];

/** Screen 40 — first-time onboarding overlay */
export default function ExploreTutorial({ visible, onDismiss }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onDismiss();
    } else {
      setStep(s => s + 1);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: current.color + '15' }]}>
            <Ionicons name={current.icon} size={36} color={current.color} />
          </View>

          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.desc}>{current.desc}</Text>

          {/* Dots */}
          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step && { backgroundColor: current.color, width: 20 }]}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onDismiss} accessibilityLabel="Skip tutorial">
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: current.color }]}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel={isLast ? 'Get started' : 'Next step'}
            >
              <Text style={styles.nextText}>{isLast ? 'Get Started' : 'Next'}</Text>
              <Ionicons
                name={isLast ? 'checkmark' : 'arrow-forward'}
                size={16}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: SCREEN_WIDTH - 64,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.m,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.headingM,
    fontWeight: '700',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  desc: {
    ...Typography.body,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.s,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Spacing.m,
  },
  skipText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: Radius.circular,
  },
  nextText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
});
