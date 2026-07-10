import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function ValidAnimation() {
  const scale = useSharedValue(0);
  const ring1Scale = useSharedValue(0.5);
  const ring1Op = useSharedValue(0);
  const ring2Scale = useSharedValue(0.5);
  const ring2Op = useSharedValue(0);
  const ring3Scale = useSharedValue(0.5);
  const ring3Op = useSharedValue(0);

  useEffect(() => {
    // Main icon bounces in
    scale.value = withSpring(1, { damping: 7, stiffness: 180, mass: 0.7 });

    // Ring 1
    ring1Op.value = withDelay(
      150,
      withSequence(withTiming(0.55, { duration: 80 }), withTiming(0, { duration: 700 }))
    );
    ring1Scale.value = withDelay(150, withTiming(2.1, { duration: 780 }));

    // Ring 2
    ring2Op.value = withDelay(
      320,
      withSequence(withTiming(0.35, { duration: 80 }), withTiming(0, { duration: 800 }))
    );
    ring2Scale.value = withDelay(320, withTiming(2.6, { duration: 880 }));

    // Ring 3
    ring3Op.value = withDelay(
      500,
      withSequence(withTiming(0.2, { duration: 80 }), withTiming(0, { duration: 900 }))
    );
    ring3Scale.value = withDelay(500, withTiming(3.0, { duration: 980 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Op.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Op.value,
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring3Scale.value }],
    opacity: ring3Op.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ring, { borderColor: "#22C55E" }, ring3Style]} />
      <Animated.View style={[styles.ring, { borderColor: "#22C55E" }, ring2Style]} />
      <Animated.View style={[styles.ring, { borderColor: "#22C55E" }, ring1Style]} />
      <Animated.View style={iconStyle}>
        <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
      </Animated.View>
    </View>
  );
}

export function InvalidAnimation() {
  const scale = useSharedValue(0);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 9, stiffness: 200 });
    shakeX.value = withDelay(
      200,
      withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-5, { duration: 55 }),
        withTiming(5, { duration: 55 }),
        withTiming(0, { duration: 55 })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={style}>
        <Ionicons name="close-circle" size={72} color="#EF4444" />
      </Animated.View>
    </View>
  );
}

export function AlreadyUsedAnimation() {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 180 });
    rotate.value = withDelay(
      180,
      withSequence(
        withTiming(-12, { duration: 80 }),
        withTiming(12, { duration: 80 }),
        withTiming(-8, { duration: 80 }),
        withTiming(8, { duration: 80 }),
        withTiming(0, { duration: 80 })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={style}>
        <Ionicons name="warning" size={72} color="#F59E0B" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderWidth: 2,
  },
});
