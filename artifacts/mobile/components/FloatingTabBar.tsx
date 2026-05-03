import * as Haptics from "expo-haptics";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const bottom =
    Platform.OS === "web" ? 16 : Math.max(insets.bottom, 10) + 8;

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
            color: isFocused ? colors.primary : colors.mutedForeground,
            size: 22,
          });

          const label =
            options.title ??
            route.name.charAt(0).toUpperCase() + route.name.slice(1);

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              icon={icon}
              label={label as string}
              onPress={onPress}
              activeColor={colors.primary}
              inactiveColor={colors.mutedForeground}
              activeBg={colors.accent}
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
  label,
  onPress,
  activeColor,
  inactiveColor,
  activeBg,
}: {
  isFocused: boolean;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
  activeBg: string;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 12, stiffness: 260 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 260 });
      }}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        {isFocused && (
          <View style={[styles.activePill, { backgroundColor: activeBg }]} />
        )}
        <View style={styles.iconWrap}>{icon}</View>
        <Text
          style={[
            styles.label,
            {
              color: isFocused ? activeColor : inactiveColor,
              fontFamily: isFocused ? "Inter_600SemiBold" : "Inter_400Regular",
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "stretch",
  },
  bar: {
    flexDirection: "row",
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    gap: 3,
    position: "relative",
  },
  activePill: {
    position: "absolute",
    top: 0,
    left: 4,
    right: 4,
    bottom: 0,
    borderRadius: 18,
  },
  iconWrap: {
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    zIndex: 1,
    letterSpacing: 0.1,
  },
});
