import * as Haptics from "expo-haptics";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const bottom =
    Platform.OS === "web" ? 20 : Math.max(insets.bottom, 8) + 10;

  return (
    <View style={[styles.wrapper, { bottom }]} pointerEvents="box-none">
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.card,
            shadowColor: "#000",
            borderColor: colors.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name, route.params);
            }
          };

          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? "#FFFFFF" : colors.mutedForeground,
            size: 22,
          });

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              icon={icon}
              onPress={onPress}
              activeChipColor={colors.primary}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  isFocused,
  icon,
  onPress,
  activeChipColor,
}: {
  isFocused: boolean;
  icon: React.ReactNode;
  onPress: () => void;
  activeChipColor: string;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.84, { damping: 14, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 300 });
      }}
      style={styles.tab}
    >
      <Animated.View
        style={[
          styles.chip,
          isFocused
            ? { backgroundColor: activeChipColor }
            : { backgroundColor: "transparent" },
          animStyle,
        ]}
      >
        {icon}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "stretch",
  },
  bar: {
    flexDirection: "row",
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.13,
    shadowRadius: 32,
    elevation: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    width: 52,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
