import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function TeamScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { validators, user } = useAuth();
  const active = validators.filter((v) => v.active);
  const totalScans = active.reduce((a, v) => a + v.scansToday, 0);
  const maxScans = Math.max(...validators.map((v) => v.scansToday), 1);

  const avatarColors = ["#1B3A7A", "#3B82F6", "#7C3AED", "#059669", "#DC2626"];

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    subHeader: {
      backgroundColor: colors.card,
      paddingTop: 14,
      paddingBottom: 14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    screenTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    activeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#DCFCE7",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#22C55E",
    },
    activeBadgeText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#15803D",
    },
    content: {
      padding: 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    syncCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "#EFF6FF",
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#BFDBFE",
    },
    syncText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: "#1D4ED8",
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 1,
    },
    cardTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    info: { flex: 1 },
    name: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    code: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    right: { alignItems: "flex-end", gap: 3 },
    scansCount: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    scansLbl: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.secondary,
    },
    cardBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    bottomText: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
    },
    youBadge: {
      backgroundColor: colors.accent,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    youText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    summaryCard: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    summaryLeft: { flex: 1 },
    summaryTitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      marginBottom: 4,
    },
    summaryVal: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: "#fff",
    },
    summarySubVal: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      marginTop: 2,
    },
    summaryIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={s.root}>
      <AppHeader right={<ThemeToggleButton />} />
      <View style={s.subHeader}>
        <View style={s.titleRow}>
          <Text style={s.screenTitle}>Team</Text>
          <View style={s.activeBadge}>
            <View style={s.activeDot} />
            <Text style={s.activeBadgeText}>{active.length} active</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.syncCard}>
          <Ionicons name="wifi" size={18} color="#3B82F6" />
          <Text style={s.syncText}>Team synced — real-time scan coordination active</Text>
          <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
        </View>

        <View style={s.summaryCard}>
          <View style={s.summaryLeft}>
            <Text style={s.summaryTitle}>Total Team Scans Today</Text>
            <Text style={s.summaryVal}>{totalScans}</Text>
            <Text style={s.summarySubVal}>{active.length} validators on duty</Text>
          </View>
          <View style={s.summaryIcon}>
            <Ionicons name="scan" size={26} color="#fff" />
          </View>
        </View>

        <Text style={s.sectionTitle}>Validator Status</Text>

        {[...validators]
          .sort((a, b) => b.scansToday - a.scansToday)
          .map((v, i) => {
            const isMe = v.code === user?.validatorCode;
            const pct = (v.scansToday / maxScans) * 100;
            return (
              <View key={v.id} style={s.card}>
                <View style={s.cardTop}>
                  <View style={[s.avatar, { backgroundColor: avatarColors[i % avatarColors.length] }]}>
                    <Text style={s.avatarText}>{getInitials(v.name)}</Text>
                  </View>
                  <View style={s.info}>
                    <Text style={s.name}>{v.name}</Text>
                    <Text style={s.code}>{v.code}</Text>
                  </View>
                  <View style={s.right}>
                    <Text style={s.scansCount}>{v.scansToday}</Text>
                    <Text style={s.scansLbl}>scans</Text>
                  </View>
                </View>

                <View style={s.progressBar}>
                  <View style={[s.progressFill, { width: `${pct}%` as any }]} />
                </View>

                <View style={s.cardBottom}>
                  <View style={[s.statusBadge, { backgroundColor: v.active ? "#DCFCE7" : colors.muted }]}>
                    <View style={[s.statusDot, { backgroundColor: v.active ? "#22C55E" : colors.mutedForeground }]} />
                    <Text style={[s.statusText, { color: v.active ? "#15803D" : colors.mutedForeground }]}>
                      {v.active ? "Active" : "Offline"}
                    </Text>
                  </View>
                  {isMe ? (
                    <View style={s.youBadge}>
                      <Text style={s.youText}>You</Text>
                    </View>
                  ) : (
                    <Text style={s.bottomText}>Last seen {v.lastSeen}</Text>
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}
