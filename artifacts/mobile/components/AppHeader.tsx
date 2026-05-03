import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { VouchLogo } from "./VouchLogo";

interface AppHeaderProps {
  right?: React.ReactNode;
  center?: React.ReactNode;
  logoSize?: "sm" | "md";
}

export function AppHeader({
  right,
  center,
  logoSize = "sm",
}: AppHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <VouchLogo size={logoSize} />
      {center ? (
        <View style={styles.center}>{center}</View>
      ) : (
        <View style={styles.spacer} />
      )}
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 11,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  spacer: { flex: 1 },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
