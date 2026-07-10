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

import { AppHeader } from "@/components/AppHeader";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const HOURLY = [
  { hour: "8am", count: 12 },
  { hour: "9am", count: 45 },
  { hour: "10am", count: 89 },
  { hour: "11am", count: 134 },
  { hour: "12pm", count: 76 },
  { hour: "1pm", count: 58 },
  { hour: "2pm", count: 102 },
  { hour: "3pm", count: 67 },
];

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events, validators, scanHistory } = useAuth();
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const totalScans = scanHistory.length;
  const validScans = scanHistory.filter((s) => s.status === "valid").length;
  const invalidScans = scanHistory.filter((s) => s.status === "invalid").length;
  const usedScans = scanHistory.filter((s) => s.status === "already_used").length;
  const successRate = totalScans > 0 ? Math.round((validScans / totalScans) * 100) : 0;

  const maxCount = Math.max(...HOURLY.map((h) => h.count));

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
    periodRow: {
      flexDirection: "row",
      backgroundColor: colors.muted,
      borderRadius: 10,
      padding: 3,
    },
    periodBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      alignItems: "center",
      borderRadius: 8,
    },
    periodBtnActive: {
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1,
    },
    periodText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    periodTextActive: { color: colors.foreground },
    content: {
      padding: 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    kpiRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    kpiCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 1,
    },
    kpiValue: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 2,
    },
    kpiLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 14,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 6,
      height: 100,
    },
    barCol: {
      flex: 1,
      alignItems: "center",
    },
    barWrap: {
      flex: 1,
      width: "100%",
      justifyContent: "flex-end",
    },
    bar: {
      width: "100%",
      borderRadius: 4,
    },
    barLabel: {
      fontSize: 9,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 6,
    },
    statusCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 8,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    statusLabel: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    statusCount: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    statusPct: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginLeft: 6,
      width: 36,
      textAlign: "right",
    },
    rateCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 8,
    },
    rateVal: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: "#fff",
    },
    rateLbl: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: "#fff",
      opacity: 0.8,
    },
    rateTitle: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 12,
    },
    validatorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    valBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      overflow: "hidden",
    },
    valFill: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.secondary,
    },
    valName: {
      width: 70,
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    valCount: {
      width: 36,
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textAlign: "right",
    },
  });

  const maxScans = Math.max(...validators.map((v) => v.scansToday), 1);

  return (
    <View style={s.root}>
      <AppHeader
        right={
          <>
            <Pressable hitSlop={8}>
              <Ionicons name="download-outline" size={22} color={colors.mutedForeground} />
            </Pressable>
            <ThemeToggleButton />
          </>
        }
      />
      <View style={s.subHeader}>
        <View style={s.titleRow}>
          <Text style={s.screenTitle}>Analytics</Text>
          <View style={s.periodRow}>
            {(["today", "week", "month"] as const).map((p) => (
              <Pressable
                key={p}
                style={[s.periodBtn, period === p && s.periodBtnActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[s.periodText, period === p && s.periodTextActive]}>
                  {p === "today" ? "Today" : p === "week" ? "Week" : "Month"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.kpiRow}>
          <View style={s.kpiCard}>
            <Text style={s.kpiValue}>{totalScans}</Text>
            <Text style={s.kpiLabel}>Total Scans</Text>
          </View>
          <View style={s.kpiCard}>
            <Text style={[s.kpiValue, { color: colors.success }]}>{validScans}</Text>
            <Text style={s.kpiLabel}>Valid</Text>
          </View>
          <View style={s.kpiCard}>
            <Text style={[s.kpiValue, { color: colors.destructive }]}>{invalidScans + usedScans}</Text>
            <Text style={s.kpiLabel}>Rejected</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Hourly Scan Volume</Text>
        <View style={s.chartCard}>
          <View style={s.chartRow}>
            {HOURLY.map((h) => (
              <View key={h.hour} style={s.barCol}>
                <View style={s.barWrap}>
                  <View
                    style={[
                      s.bar,
                      {
                        height: (h.count / maxCount) * 80,
                        backgroundColor: colors.primary,
                        opacity: h.hour === "11am" ? 1 : 0.55,
                      },
                    ]}
                  />
                </View>
                <Text style={s.barLabel}>{h.hour}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={s.sectionTitle}>Scan Status Breakdown</Text>
        <View style={s.statusCard}>
          <View style={s.rateCircle}>
            <Text style={s.rateVal}>{successRate}%</Text>
            <Text style={s.rateLbl}>success</Text>
          </View>
          <Text style={s.rateTitle}>Validation Success Rate</Text>

          {[
            { label: "Valid", count: validScans, color: colors.success },
            { label: "Already Used", count: usedScans, color: colors.warning },
            { label: "Invalid", count: invalidScans, color: colors.destructive },
          ].map((item) => (
            <View key={item.label} style={s.statusRow}>
              <View style={[s.statusDot, { backgroundColor: item.color }]} />
              <Text style={s.statusLabel}>{item.label}</Text>
              <Text style={s.statusCount}>{item.count}</Text>
              <Text style={s.statusPct}>
                {totalScans > 0 ? Math.round((item.count / totalScans) * 100) : 0}%
              </Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>Top Validators</Text>
        <View style={s.statusCard}>
          {validators
            .filter((v) => v.scansToday > 0)
            .sort((a, b) => b.scansToday - a.scansToday)
            .map((v, i) => (
              <View
                key={v.id}
                style={[
                  s.validatorRow,
                  i === validators.filter((x) => x.scansToday > 0).length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Text style={s.valName} numberOfLines={1}>{v.name.split(" ")[0]}</Text>
                <View style={s.valBar}>
                  <View
                    style={[
                      s.valFill,
                      { width: `${(v.scansToday / maxScans) * 100}%` as any },
                    ]}
                  />
                </View>
                <Text style={s.valCount}>{v.scansToday}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
