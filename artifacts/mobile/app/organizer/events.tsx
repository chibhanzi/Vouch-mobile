import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth, Event } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function EventsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = filter === "all" ? events : events.filter((e) => e.status === filter);

  const statusConfig = {
    active: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E", label: "Live" },
    upcoming: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6", label: "Upcoming" },
    completed: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8", label: "Completed" },
  };

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.card,
      paddingTop: topPad + 12,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 14,
    },
    filterRow: {
      flexDirection: "row",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.muted,
    },
    chipActive: {
      backgroundColor: colors.primary,
    },
    chipText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    chipTextActive: {
      color: "#fff",
    },
    content: {
      padding: 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 4,
      marginRight: 10,
    },
    cardInfo: { flex: 1 },
    cardName: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 3,
    },
    cardVenue: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    badge: {
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      gap: 8,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
    },
    statVal: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    statLbl: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      overflow: "hidden",
      marginTop: 12,
    },
    progressFill: {
      height: 6,
      borderRadius: 3,
    },
    progressLabel: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
    },
    progressText: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 8,
    },
    dateText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const renderEvent = (event: Event) => {
    const sc = statusConfig[event.status];
    const pct = event.ticketsSold > 0
      ? Math.round((event.ticketsValidated / event.ticketsSold) * 100)
      : 0;
    return (
      <View key={event.id} style={s.card}>
        <View style={s.cardTop}>
          <View style={[s.statusDot, { backgroundColor: sc.dot }]} />
          <View style={s.cardInfo}>
            <Text style={s.cardName}>{event.name}</Text>
            <Text style={s.cardVenue}>{event.venue}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: sc.bg }]}>
            <Text style={[s.badgeText, { color: sc.text }]}>{sc.label}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statVal}>{event.ticketsSold.toLocaleString()}</Text>
            <Text style={s.statLbl}>Sold</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statVal}>{event.ticketsValidated.toLocaleString()}</Text>
            <Text style={s.statLbl}>Validated</Text>
          </View>
          <View style={s.statBox}>
            <Text style={[s.statVal, { color: colors.primary }]}>{pct}%</Text>
            <Text style={s.statLbl}>Rate</Text>
          </View>
        </View>

        <View style={s.progressBar}>
          <View
            style={[
              s.progressFill,
              { width: `${pct}%` as any, backgroundColor: sc.dot },
            ]}
          />
        </View>

        <View style={s.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={colors.mutedForeground} />
          <Text style={s.dateText}>{formatDate(event.date)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={s.filterRow}>
            {(["all", "active", "upcoming", "completed"] as const).map((f) => (
              <Pressable
                key={f}
                style={[s.chip, filter === f && s.chipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[s.chipText, filter === f && s.chipTextActive]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {filtered.map(renderEvent)}
      </ScrollView>
    </View>
  );
}
