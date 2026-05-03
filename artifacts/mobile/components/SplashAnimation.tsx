import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const logoImage = require("@/assets/images/vouch-logo.png");

interface SplashAnimationProps {
  onFinish: () => void;
}

export function SplashAnimation({ onFinish }: SplashAnimationProps) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const logoY = useSharedValue(20);

  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(12);

  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    logoScale.value = withDelay(
      200,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.15)) })
    );
    logoY.value = withDelay(
      200,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    taglineOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    taglineY.value = withDelay(
      700,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    overlayOpacity.value = withDelay(
      1800,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      })
    );
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));

  const taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const containerAnimStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimStyle]}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, logoAnimStyle]}>
          <Image
            source={logoImage}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text style={[styles.tagline, taglineAnimStyle]}>
          Seamless ticket validation
        </Animated.Text>
      </View>

      <Animated.View style={[styles.footer, taglineAnimStyle]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotMid]} />
        <View style={styles.dot} />
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
  bgTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0A1628",
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: "#0D1F3C",
  },
  orb1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#1A56DB",
    opacity: 0.25,
  },
  orb2: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#3B82F6",
    opacity: 0.18,
  },
  orb3: {
    position: "absolute",
    top: height * 0.35,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#60A5FA",
    opacity: 0.12,
  },
  center: {
    alignItems: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 260,
    height: 80,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 0.3,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotMid: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
  },
});
