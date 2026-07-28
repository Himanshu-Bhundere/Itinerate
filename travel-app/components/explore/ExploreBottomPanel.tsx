import React, { useRef, useCallback, ReactNode } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import type { PanelSnap } from '../../constants/exploreTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Snap positions (from top of screen)
const SNAP_COLLAPSED = SCREEN_HEIGHT * 0.70; // 30% visible
const SNAP_HALF = SCREEN_HEIGHT * 0.40;      // 60% visible

interface Props {
  snap: PanelSnap;
  onSnapChange: (snap: PanelSnap) => void;
  feedCount: number;
  children: ReactNode;
  mapControls?: ReactNode;
}

/**
 * Apple Maps–style draggable bottom panel with 3 snap positions.
 * Panel always persists — only the information layer changes.
 */
export default function ExploreBottomPanel({
  snap,
  onSnapChange,
  feedCount,
  children,
  mapControls,
}: Props) {
  const insets = useSafeAreaInsets();
  
  // Dynamic full snap ensures the panel stays strictly below the search bar
  const SNAP_FULL = insets.top + 90;

  const getSnapValue = useCallback((s: PanelSnap) => {
    switch (s) {
      case 'collapsed': return SNAP_COLLAPSED;
      case 'half': return SNAP_HALF;
      case 'full': return SNAP_FULL;
    }
  }, [SNAP_FULL]);

  const sheetY = useRef(new Animated.Value(getSnapValue(snap))).current;

  // Animate to a snap position
  const animateToSnap = useCallback((targetSnap: PanelSnap) => {
    onSnapChange(targetSnap);
    Animated.spring(sheetY, {
      toValue: getSnapValue(targetSnap),
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  }, [sheetY, onSnapChange, getSnapValue]);

  // PanResponder for drag gestures
  const panResponder = React.useMemo(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 10,
      onPanResponderMove: (_, gs) => {
        const current = getSnapValue(snap);
        const next = Math.max(SNAP_FULL, Math.min(SNAP_COLLAPSED, current + gs.dy));
        sheetY.setValue(next);
      },
      onPanResponderRelease: (_, gs) => {
        const threshold = SCREEN_HEIGHT * 0.12;
        const isFlickUp = gs.vy < -0.5;
        const isFlickDown = gs.vy > 0.5;

        let nextSnap: PanelSnap = snap;

        if (gs.dy < -threshold || isFlickUp) {
          // Step up one level
          if (snap === 'collapsed') nextSnap = 'half';
          else if (snap === 'half') nextSnap = 'full';
        } else if (gs.dy > threshold || isFlickDown) {
          // Step down one level
          if (snap === 'full') nextSnap = 'half';
          else if (snap === 'half') nextSnap = 'collapsed';
        }

        animateToSnap(nextSnap);
      },
    }), [snap, SNAP_FULL, getSnapValue, animateToSnap]);

  const hintLabel =
    snap === 'full'
      ? '🗺 Back to Map'
      : snap === 'half'
        ? `${feedCount} places nearby`
        : `↑ Browse ${feedCount} results`;

  return (
    <>
      {mapControls && snap !== 'full' && (
        <Animated.View 
          style={{ 
            position: 'absolute', 
            top: Animated.subtract(sheetY, 60), // Place it 60px above the sheet top
            right: 0, 
            zIndex: 10 
          }}
        >
          {mapControls}
        </Animated.View>
      )}
      <Animated.View style={[styles.sheet, { top: sheetY }]}>
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.handle} />
          <Text style={styles.hintText}>{hintLabel}</Text>
        </View>

        {/* Feed Content */}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadows.bottomSheet,
  },
  dragArea: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.disabledText,
    borderRadius: 2,
    marginBottom: 4,
  },
  hintText: {
    ...Typography.micro,
    color: Colors.placeholder,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
});
