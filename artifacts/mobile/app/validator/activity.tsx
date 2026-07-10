import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useAuth, ScanRecord } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { scanHistory, user } = useAuth();
  const validCount = scanHistory.filter((s) => s.status === "valid").length;
  const invalidCount = scanHistory.filter((s) => s.status === "invalid").length;
  const usedCount = scanHistory.filter((s) => s.status === "already_used").length;

  const statusConfig = {
    valid: { icon: "checkmark-circle" as const, color: "#22C55E", label: "Valid", bg: "#F0FDF4" },
    invalid: { icon: "close-circle" as const, color: "#EF4444", label: "Invalid", bg: "#FEF2F2" },
    already_used: { icon: "warning" as const, color: "#F59E0B", label: "Used", bg: "#FFFBEB" },
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Math.round((Date.now() - d.getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    subHeader: {
      backgroundColor: colors.card,
      paddingTop: 14,
      paddingBottom: 12,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    screenTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    countBadge: {
      backgroundColor: colors.primary + "1A",
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    countBadgeText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    summaryRow: {
      flexDirection: "row",
      gap: 10,
    },
    sumCard: {
      flex: 1,
      borderRadius: 12,
      padding: 10,
      alignItems: "center",
    },
    sumVal: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
    },
    sumLbl: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    listContent: {
      padding: 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    info: { flex: 1 },
    holder: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 2,
    },
    meta: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    right: { alignItems: "flex-end", gap: 4 },
    badge: {
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
    },
    time: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    empty: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    emptySubText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  const renderItem = ({ item }: { item: ScanRecord }) => {
    const sc = statusConfig[item.status];
    return (
      <View style={s.item}>
        <View style={[s.iconWrap, { backgroundColor: sc.bg }]}>
          <Ionicons name={sc.icon} size={22} color={sc.color} />
        </View>
        <View style={s.info}>
          <Text style={s.holder}>{item.holderName}</Text>
          <Text style={s.meta}>{item.ticketId} · {item.gate}</Text>
          <Text style={[s.meta, { marginTop: 1 }]}>{item.eventName}</Text>
        </View>
        <View style={s.right}>
          <View style={[s.badge, { backgroundColor: sc.bg }]}>
            <Text style={[s.badgeText, { color: sc.color }]}>{sc.label}</Text>
          </View>
          <Text style={s.time}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={s.root}>
      <AppHeader right={<ThemeToggleButton />} />
      <View style={s.subHeader}>
        <View style={s.titleRow}>
          <Text style={s.screenTitle}>Scan Activity</Text>
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{scanHistory.length} scan{scanHistory.length !== 1 ? "s" : ""}</Text>
          </View>
        </View>
        <View style={s.summaryRow}>
          <View style={[s.sumCard, { backgroundColor: "#F0FDF4" }]}>
            <Text style={[s.sumVal, { color: "#22C55E" }]}>{validCount}</Text>
            <Text style={s.sumLbl}>Valid</Text>
          </View>
          <View style={[s.sumCard, { backgroundColor: "#FFFBEB" }]}>
            <Text style={[s.sumVal, { color: "#F59E0B" }]}>{usedCount}</Text>
            <Text style={s.sumLbl}>Used</Text>
          </View>
          <View style={[s.sumCard, { backgroundColor: "#FEF2F2" }]}>
            <Text style={[s.sumVal, { color: "#EF4444" }]}>{invalidCount}</Text>
            <Text style={s.sumLbl}>Invalid</Text>
          </View>
          <View style={[s.sumCard, { backgroundColor: colors.muted }]}>
            <Text style={[s.sumVal, { color: colors.primary }]}>{scanHistory.length}</Text>
            <Text style={s.sumLbl}>Total</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={scanHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!scanHistory.length}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="time-outline" size={48} color={colors.mutedForeground} />
            <Text style={s.emptyText}>No scans yet</Text>
            <Text style={s.emptySubText}>Start scanning tickets to see activity here</Text>
          </View>
        }
      />
    </View>
  );
}
