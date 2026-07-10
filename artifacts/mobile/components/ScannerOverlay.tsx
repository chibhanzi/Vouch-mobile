import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const GREEN = "#22C55E";
const SIDE = 28;
const VERT = 18;
const BRACKET = 24;
const THICK = 3;
const DARK = "rgba(0,0,0,0.58)";

interface Props {
  active: boolean;
}

export function ScannerOverlay({ active }: Props) {
  const scanY = useSharedValue(0);
  const glowOp = useSharedValue(0.6);
  const bracketOp = useSharedValue(0.7);

  useEffect(() => {
    if (active) {
      scanY.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      glowOp.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      bracketOp.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0.6, { duration: 1200 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(scanY);
      cancelAnimation(glowOp);
      cancelAnimation(bracketOp);
      scanY.value = 0;
      glowOp.value = 0.6;
      bracketOp.value = 0.7;
    }
  }, [active]);

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${5 + scanY.value * 88}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOp.value,
  }));

  const bracketStyle = useAnimatedStyle(() => ({
    opacity: bracketOp.value,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top dark strip */}
      <View style={[styles.strip, { height: VERT }]} />

      {/* Middle row */}
      <View style={styles.middle}>
        {/* Left dark strip */}
        <View style={[styles.strip, { width: SIDE }]} />

        {/* Scan window */}
        <View style={styles.window}>
          {/* Corner brackets */}
          <Animated.View style={bracketStyle}>
            <View style={[styles.bracket, styles.bracketTL]} />
            <View style={[styles.bracket, styles.bracketTR]} />
            <View style={[styles.bracket, styles.bracketBL]} />
            <View style={[styles.bracket, styles.bracketBR]} />
          </Animated.View>

          {/* Scan line */}
          <Animated.View style={[styles.scanLineWrap, scanLineStyle]}>
            {/* Outer glow */}
            <Animated.View style={[styles.scanGlow, glowStyle]} />
            {/* Mid glow */}
            <Animated.View style={[styles.scanMid, glowStyle]} />
            {/* Core line */}
            <View style={styles.scanCore} />
          </Animated.View>

          {/* Center target crosshair (static) */}
          {active && (
            <View style={styles.crosshair}>
              <View style={styles.crosshairH} />
              <View style={styles.crosshairV} />
            </View>
          )}
        </View>

        {/* Right dark strip */}
        <View style={[styles.strip, { width: SIDE }]} />
      </View>

      {/* Bottom dark strip */}
      <View style={[styles.strip, { height: VERT }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: DARK,
  },
  middle: {
    flex: 1,
    flexDirection: "row",
  },
  window: {
    flex: 1,
    position: "relative",
  },

  // Corner brackets
  bracket: {
    position: "absolute",
    width: BRACKET,
    height: BRACKET,
    borderColor: GREEN,
  },
  bracketTL: {
    top: 0,
    left: 0,
    borderTopWidth: THICK,
    borderLeftWidth: THICK,
    borderTopLeftRadius: 5,
  },
  bracketTR: {
    top: 0,
    right: 0,
    borderTopWidth: THICK,
    borderRightWidth: THICK,
    borderTopRightRadius: 5,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: THICK,
    borderLeftWidth: THICK,
    borderBottomLeftRadius: 5,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: THICK,
    borderRightWidth: THICK,
    borderBottomRightRadius: 5,
  },

  // Scan line layers (simulated glow)
  scanLineWrap: {
    position: "absolute",
    left: 4,
    right: 4,
  },
  scanGlow: {
    height: 10,
    backgroundColor: GREEN,
    opacity: 0.12,
    borderRadius: 5,
    marginHorizontal: -2,
  },
  scanMid: {
    height: 5,
    backgroundColor: GREEN,
    opacity: 0.3,
    borderRadius: 3,
    marginTop: -8,
    marginHorizontal: 1,
  },
  scanCore: {
    height: 2,
    backgroundColor: GREEN,
    borderRadius: 1,
    marginTop: -4,
  },

  // Crosshair
  crosshair: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  crosshairH: {
    position: "absolute",
    width: 20,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  crosshairV: {
    position: "absolute",
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});
