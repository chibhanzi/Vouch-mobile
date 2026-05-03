import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  style?: ViewStyle;
}

export function ThemeToggleButton({ style }: Props) {
  const { theme, toggleTheme } = useTheme();
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: colors.muted },
        style,
        pressed && { opacity: 0.7 },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleTheme();
      }}
      hitSlop={8}
    >
      <Ionicons
        name={theme === "light" ? "moon-outline" : "sunny-outline"}
        size={18}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
