import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { useColors } from "@/hooks/useColors";

function VouchHex({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <Defs>
        <LinearGradient id="vg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#00CFFF" />
          <Stop offset="100%" stopColor="#1060D0" />
        </LinearGradient>
      </Defs>
      {/* Rounded hexagon */}
      <Path
        d="M 22.54,6 Q 26,4 29.46,6 L 41.59,13 Q 45.05,15 45.05,19 L 45.05,33 Q 45.05,37 41.59,39 L 29.46,46 Q 26,48 22.54,46 L 10.41,39 Q 6.95,37 6.95,33 L 6.95,19 Q 6.95,15 10.41,13 Z"
        fill="url(#vg)"
      />
      {/* Checkmark */}
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

interface VouchLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function VouchLogo({ size = "md", showText = true }: VouchLogoProps) {
  const colors = useColors();

  const iconSizes = { sm: 28, md: 36, lg: 52 };
  const textSizes = { sm: 16, md: 21, lg: 30 };
  const gaps = { sm: 6, md: 8, lg: 12 };

  return (
    <View style={[styles.row, { gap: gaps[size] }]}>
      <VouchHex size={iconSizes[size]} />
      {showText && (
        <Text
          style={[
            styles.text,
            { fontSize: textSizes[size], color: colors.foreground },
          ]}
        >
          Vouch
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
});
