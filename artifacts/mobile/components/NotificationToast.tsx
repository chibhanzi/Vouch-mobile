import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNotification, useNotifications } from "@/context/NotificationContext";
import { useColors } from "@/hooks/useColors";

export function NotificationToastContainer() {
  const { notifications } = useNotifications();
  const insets = useSafeAreaInsets();

  if (notifications.length === 0) return null;

  const topOffset = insets.top + (Platform.OS === "web" ? 8 : 6);

  return (
    <View
      style={[styles.container, { top: topOffset }]}
      pointerEvents="box-none"
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} />
      ))}
    </View>
  );
}

function ToastItem({ notification }: { notification: AppNotification }) {
  const { dismiss } = useNotifications();
  const colors = useColors();

  const isUsed = notification.type === "already_used";
  const accent = isUsed ? "#F59E0B" : "#EF4444";
  const iconName: any = isUsed ? "warning" : "alert-circle";
  const isDark = colors.card === "#1E293B";
  const bg = isDark
    ? isUsed
      ? "#1C1508"
      : "#1C0808"
    : isUsed
    ? "#FFFBEB"
    : "#FEF2F2";

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(20).stiffness(300)}
      exiting={FadeOutUp.duration(220)}
      layout={Layout.springify()}
      style={[
        styles.toast,
        {
          backgroundColor: bg,
          borderLeftColor: accent,
          shadowColor: accent,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: accent + "25" }]}>
        <Ionicons name={iconName} size={17} color={accent} />
      </View>

      <View style={styles.textWrap}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "#F8FAFC" : "#0F172A" },
          ]}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text
          style={[
            styles.body,
            { color: isDark ? "#94A3B8" : "#64748B" },
          ]}
          numberOfLines={1}
        >
          {notification.body}
        </Text>
      </View>

      <Pressable
        onPress={() => dismiss(notification.id)}
        hitSlop={10}
        style={styles.closeBtn}
      >
        <Ionicons
          name="close"
          size={15}
          color={isDark ? "#64748B" : "#94A3B8"}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 9999,
    gap: 6,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 14,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: { flex: 1 },
  title: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 1,
  },
  body: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  closeBtn: { padding: 3 },
});
