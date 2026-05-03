import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const logoImage = require("@/assets/images/vouch-logo.png");

interface VouchLogoProps {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export function VouchLogo({ size = "md", light = false }: VouchLogoProps) {
  const colors = useColors();

  const heights = { sm: 28, md: 38, lg: 56 };
  const widths = { sm: 96, md: 130, lg: 192 };

  const h = heights[size];
  const w = widths[size];

  if (light) {
    return (
      <Image
        source={logoImage}
        style={{ width: w, height: h, tintColor: undefined }}
        resizeMode="contain"
      />
    );
  }

  return (
    <Image
      source={logoImage}
      style={{ width: w, height: h }}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({});
