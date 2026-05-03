import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { VouchLogo } from "@/components/VouchLogo";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function OrganizerDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events, validators, scanHistory, logout } = useAuth();

  const totalTickets = events.reduce((acc, e) => acc + e.ticketsSold, 0);
  const totalValidated = events.reduce((acc, e) => acc + e.ticketsValidated, 0);
  const activeValidators = validators.filter((v) => v.active).length;
  const activeEvents = events.filter((e) => e.status === "active").length;
  const validationRate = totalTickets > 0 ? Math.round((totalValidated / totalTickets) * 100) : 0;

  const recentScans = scanHistory.slice(0, 3);

  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace("/login");
  };

  const topPaddingWeb = Platform.OS === "web" ? 67 : insets.top;

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.card,
      paddingTop: topPaddingWeb + 12,
      paddingBottom: 16,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRight: { flexDirection: "row", gap: 8 },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    onlineBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#DCFCE7",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    onlineDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    onlineText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#15803D",
    },
    scroll: { flex: 1 },
    scrollContent: {
      padding: 20,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    greeting: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    greetingSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 20,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      minWidth: "44%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    statValue: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 12,
    },
    progressCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    progressLabel: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    progressPct: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    progressBar: {
      height: 10,
      backgroundColor: colors.muted,
      borderRadius: 5,
      overflow: "hidden",
    },
    progressFill: {
      height: 10,
      borderRadius: 5,
    },
    progressSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 8,
    },
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    eventDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
      marginTop: 2,
    },
    eventInfo: { flex: 1 },
    eventName: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 3,
    },
    eventMeta: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    eventBadge: {
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    eventBadgeText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
    },
    scanRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    scanDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    scanInfo: { flex: 1 },
    scanHolder: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    scanMeta: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 1,
    },
    scanTime: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    viewAll: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      marginTop: 12,
      paddingVertical: 8,
    },
    viewAllText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.secondary,
    },
  });

  const statusColors = {
    active: { bg: "#DCFCE7", text: "#15803D" },
    upcoming: { bg: "#EFF6FF", text: "#1D4ED8" },
    completed: { bg: colors.muted, text: colors.mutedForeground },
  };

  const scanStatusColor = {
    valid: colors.success,
    invalid: colors.destructive,
    already_used: colors.warning,
  };

  const formatTime = (iso: string) => {
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <VouchLogo size="md" />
        <View style={s.headerRight}>
          <View style={s.onlineBadge}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>Online</Text>
          </View>
          <ThemeToggleButton style={s.iconBtn} />
          <Pressable style={s.iconBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.greeting}>Welcome back</Text>
        <Text style={s.greetingSub}>Here's your event overview for today</Text>

        <View style={s.statsGrid}>
          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="calendar" size={18} color={colors.secondary} />
            </View>
            <Text style={s.statValue}>{events.length}</Text>
            <Text style={s.statLabel}>Total Events</Text>
          </View>

          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="people" size={18} color={colors.success} />
            </View>
            <Text style={s.statValue}>{activeValidators}</Text>
            <Text style={s.statLabel}>Active Validators</Text>
          </View>

          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: "#FFF7ED" }]}>
              <Ionicons name="ticket" size={18} color={colors.warning} />
            </View>
            <Text style={s.statValue}>{totalValidated}</Text>
            <Text style={s.statLabel}>Validated Today</Text>
          </View>

          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: "#F5F3FF" }]}>
              <Ionicons name="flash" size={18} color="#7C3AED" />
            </View>
            <Text style={s.statValue}>{activeEvents}</Text>
            <Text style={s.statLabel}>Live Events</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Validation Progress</Text>
        <View style={s.progressCard}>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}>Overall Rate</Text>
            <Text style={s.progressPct}>{validationRate}%</Text>
          </View>
          <View style={s.progressBar}>
            <View
              style={[
                s.progressFill,
                {
                  width: `${validationRate}%` as any,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={s.progressSub}>
            {totalValidated.toLocaleString()} of {totalTickets.toLocaleString()} tickets validated
          </Text>
        </View>

        <Text style={s.sectionTitle}>Active Events</Text>
        {events.filter((e) => e.status !== "completed").map((event) => {
          const sc = statusColors[event.status];
          const pct = event.ticketsSold > 0
            ? Math.round((event.ticketsValidated / event.ticketsSold) * 100)
            : 0;
          return (
            <View key={event.id} style={s.eventCard}>
              <View
                style={[
                  s.eventDot,
                  {
                    backgroundColor:
                      event.status === "active" ? colors.success : colors.secondary,
                  },
                ]}
              />
              <View style={s.eventInfo}>
                <Text style={s.eventName}>{event.name}</Text>
                <Text style={s.eventMeta}>
                  {event.venue} · {pct}% validated
                </Text>
              </View>
              <View style={[s.eventBadge, { backgroundColor: sc.bg }]}>
                <Text style={[s.eventBadgeText, { color: sc.text }]}>
                  {event.status}
                </Text>
              </View>
            </View>
          );
        })}

        <Text style={[s.sectionTitle, { marginTop: 8 }]}>Recent Scans</Text>
        <View style={[s.progressCard, { padding: 8, paddingHorizontal: 16 }]}>
          {recentScans.map((scan, i) => (
            <View
              key={scan.id}
              style={[s.scanRow, i === recentScans.length - 1 && { borderBottomWidth: 0 }]}
            >
              <View style={[s.scanDot, { backgroundColor: scanStatusColor[scan.status] }]} />
              <View style={s.scanInfo}>
                <Text style={s.scanHolder}>{scan.holderName}</Text>
                <Text style={s.scanMeta}>{scan.ticketId} · {scan.gate}</Text>
              </View>
              <Text style={s.scanTime}>{formatTime(scan.timestamp)}</Text>
            </View>
          ))}
          <Pressable style={s.viewAll} onPress={() => router.push("/organizer/analytics")}>
            <Text style={s.viewAllText}>View all activity</Text>
            <Ionicons name="arrow-forward" size={13} color={colors.secondary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
