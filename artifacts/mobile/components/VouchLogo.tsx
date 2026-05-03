import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface VouchLogoProps {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export function VouchLogo({ size = "md", light = false }: VouchLogoProps) {
  const colors = useColors();

  const iconSizes = { sm: 20, md: 28, lg: 40 };
  const textSizes = { sm: 16, md: 22, lg: 32 };
  const boxSizes = { sm: 32, md: 44, lg: 64 };
  const iconSize = iconSizes[size];
  const textSize = textSizes[size];
  const boxSize = boxSizes[size];

  const logoColor = light ? "#FFFFFF" : colors.primary;
  const textColor = light ? "#FFFFFF" : colors.primary;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: boxSize * 0.22,
            backgroundColor: logoColor,
          },
        ]}
      >
        <Ionicons name="checkmark-sharp" size={iconSize} color="#FFFFFF" />
      </View>
      <Text
        style={[
          styles.text,
          { fontSize: textSize, color: textColor, marginLeft: boxSize * 0.2 },
        ]}
      >
        Vouch
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
});
