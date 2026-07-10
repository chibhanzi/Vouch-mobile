import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { height } = Dimensions.get("window");

function SplashHex({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <Defs>
        <LinearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#00CFFF" />
          <Stop offset="100%" stopColor="#1060D0" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 22.54,6 Q 26,4 29.46,6 L 41.59,13 Q 45.05,15 45.05,19 L 45.05,33 Q 45.05,37 41.59,39 L 29.46,46 Q 26,48 22.54,46 L 10.41,39 Q 6.95,37 6.95,33 L 6.95,19 Q 6.95,15 10.41,13 Z"
        fill="url(#splashGrad)"
      />
      <Path
        d="M 14.5,27 L 22,34.5 L 38,17.5"
        stroke="#0A1628"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

interface Props {
  onFinish: () => void;
}

export function SplashAnimation({ onFinish }: Props) {
  // Orbs
  const orb1Scale = useSharedValue(0);
  const orb1Op = useSharedValue(0);
  const orb2Scale = useSharedValue(0);
  const orb2Op = useSharedValue(0);
  const orb3Scale = useSharedValue(0);
  const orb3Op = useSharedValue(0);

  // Hex icon
  const hexScale = useSharedValue(0);
  const hexOp = useSharedValue(0);
  const hexRotate = useSharedValue(-15);

  // Glow ring behind hex
  const glowScale = useSharedValue(0.8);
  const glowOp = useSharedValue(0);

  // "Vouch" wordmark slides in from left
  const wordX = useSharedValue(-40);
  const wordOp = useSharedValue(0);

  // Tagline
  const tagOp = useSharedValue(0);
  const tagY = useSharedValue(14);

  // Shimmer stripe that sweeps across the logo row
  const shimmerX = useSharedValue(-200);
  const shimmerOp = useSharedValue(0);

  // Progress bar
  const progress = useSharedValue(0);
  const progressOp = useSharedValue(0);

  // Exit
  const containerOp = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    // ── Phase 1: Orbs float in (0–350ms) ──────────────────────────
    orb1Scale.value = withSpring(1, { damping: 14, stiffness: 70 });
    orb1Op.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) });

    orb2Scale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 60 }));
    orb2Op.value = withDelay(100, withTiming(1, { duration: 450 }));

    orb3Scale.value = withDelay(200, withSpring(1, { damping: 16, stiffness: 80 }));
    orb3Op.value = withDelay(200, withTiming(1, { duration: 350 }));

    // ── Phase 2: Hex icon bounces in (180ms) ──────────────────────
    hexScale.value = withDelay(180, withSpring(1, { damping: 6, stiffness: 180, mass: 0.75 }));
    hexOp.value = withDelay(180, withTiming(1, { duration: 180 }));
    hexRotate.value = withDelay(180, withSpring(0, { damping: 8, stiffness: 160 }));

    // ── Phase 3: Glow ring pulses (300ms) ─────────────────────────
    glowOp.value = withDelay(300, withTiming(0.4, { duration: 350 }));
    glowScale.value = withDelay(300,
      withRepeat(
        withSequence(
          withTiming(1.25, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.85, { duration: 1100, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // ── Phase 4: Wordmark slides in (520ms) ───────────────────────
    wordX.value = withDelay(520, withSpring(0, { damping: 11, stiffness: 140 }));
    wordOp.value = withDelay(520, withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }));

    // ── Phase 5: Shimmer sweep (750ms) ────────────────────────────
    shimmerOp.value = withDelay(750, withTiming(0.6, { duration: 100 }));
    shimmerX.value = withDelay(750, withTiming(400, { duration: 700, easing: Easing.inOut(Easing.ease) }, () => {
      shimmerOp.value = withTiming(0, { duration: 150 });
    }));

    // ── Phase 6: Tagline fades up (950ms) ────────────────────────
    tagOp.value = withDelay(950, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    tagY.value = withDelay(950, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // ── Phase 7: Progress bar fills (1150–2050ms) ─────────────────
    progressOp.value = withDelay(1150, withTiming(1, { duration: 200 }));
    progress.value = withDelay(1150, withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }));

    // ── Phase 8: Exit (2250ms) ────────────────────────────────────
    containerOp.value = withDelay(
      2250,
      withTiming(0, { duration: 480, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      })
    );
    containerScale.value = withDelay(
      2250,
      withTiming(1.07, { duration: 480, easing: Easing.in(Easing.cubic) })
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ scale: orb1Scale.value }],
    opacity: orb1Op.value,
  }));
  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ scale: orb2Scale.value }],
    opacity: orb2Op.value,
  }));
  const orb3Style = useAnimatedStyle(() => ({
    transform: [{ scale: orb3Scale.value }],
    opacity: orb3Op.value,
  }));
  const hexStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hexScale.value }, { rotate: `${hexRotate.value}deg` }],
    opacity: hexOp.value,
  }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOp.value,
  }));
  const wordStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wordX.value }],
    opacity: wordOp.value,
  }));
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }, { rotate: "20deg" }],
    opacity: shimmerOp.value,
  }));
  const tagStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tagY.value }],
    opacity: tagOp.value,
  }));
  const progressFillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));
  const progressWrapStyle = useAnimatedStyle(() => ({ opacity: progressOp.value }));
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOp.value,
    transform: [{ scale: containerScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Deep navy background */}
      <View style={styles.bg} />

      {/* Animated orbs */}
      <Animated.View style={[styles.orb1, orb1Style]} />
      <Animated.View style={[styles.orb2, orb2Style]} />
      <Animated.View style={[styles.orb3, orb3Style]} />

      {/* Main content */}
      <View style={styles.center}>
        {/* Logo row */}
        <View style={styles.logoRow}>
          {/* Hex with glow ring */}
          <View style={styles.hexWrap}>
            <Animated.View style={[styles.glowOuter, glowStyle]} />
            <Animated.View style={[styles.glowInner, glowStyle]} />
            <Animated.View style={hexStyle}>
              <SplashHex size={76} />
            </Animated.View>
          </View>

          {/* "Vouch" wordmark */}
          <View style={styles.wordClip}>
            <Animated.Text style={[styles.wordmark, wordStyle]}>
              Vouch
            </Animated.Text>
            {/* Shimmer sweep */}
            <Animated.View style={[styles.shimmer, shimmerStyle]} />
          </View>
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, tagStyle]}>
          Seamless ticket validation
        </Animated.Text>
      </View>

      {/* Progress bar */}
      <Animated.View style={[styles.progressWrap, progressWrapStyle]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressFillStyle]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    overflow: "hidden",
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#07101F",
  },

  // Orbs
  orb1: {
    position: "absolute",
    top: -110,
    right: -90,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "#1A56DB",
    opacity: 0.26,
  },
  orb2: {
    position: "absolute",
    bottom: -130,
    left: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#3B82F6",
    opacity: 0.18,
  },
  orb3: {
    position: "absolute",
    top: height * 0.38,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#60A5FA",
    opacity: 0.13,
  },

  // Center content
  center: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginBottom: 30,
  },

  // Hex + glow
  hexWrap: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  glowOuter: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#3B82F6",
    opacity: 0.18,
  },
  glowInner: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#60A5FA",
    opacity: 0.28,
  },

  // Wordmark + shimmer
  wordClip: {
    overflow: "hidden",
    position: "relative",
  },
  wordmark: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -2,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 4,
  },

  // Tagline
  tagline: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.4,
  },

  // Progress bar
  progressWrap: {
    position: "absolute",
    bottom: 60,
    left: 52,
    right: 52,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
});
