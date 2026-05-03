import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ValidatorsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { validators, toggleValidator } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const activeCount = validators.filter((v) => v.active).length;
  const totalScans = validators.reduce((a, v) => a + v.scansToday, 0);

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
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    addBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
    },
    addBtnText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: "#fff",
    },
    summaryRow: {
      flexDirection: "row",
      gap: 10,
    },
    sumCard: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
    },
    sumVal: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    sumLbl: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    content: {
      padding: 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    sectionLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 10,
      marginTop: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 1,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
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
      marginBottom: 2,
    },
    code: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    right: {
      alignItems: "flex-end",
      gap: 6,
    },
    scans: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    scansLbl: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    lastSeen: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  const avatarColors = ["#1B3A7A", "#3B82F6", "#7C3AED", "#059669", "#DC2626"];

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Team</Text>
          <Pressable style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.8 }]}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={s.addBtnText}>Invite</Text>
          </Pressable>
        </View>
        <View style={s.summaryRow}>
          <View style={s.sumCard}>
            <Text style={s.sumVal}>{validators.length}</Text>
            <Text style={s.sumLbl}>Total</Text>
          </View>
          <View style={s.sumCard}>
            <Text style={[s.sumVal, { color: colors.success }]}>{activeCount}</Text>
            <Text style={s.sumLbl}>Active</Text>
          </View>
          <View style={s.sumCard}>
            <Text style={[s.sumVal, { color: colors.primary }]}>{totalScans}</Text>
            <Text style={s.sumLbl}>Scans Today</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionLabel}>Validators</Text>
        {validators.map((v, i) => (
          <View key={v.id} style={s.card}>
            <View style={[s.avatar, { backgroundColor: avatarColors[i % avatarColors.length] }]}>
              <Text style={s.avatarText}>{getInitials(v.name)}</Text>
            </View>
            <View style={s.info}>
              <Text style={s.name}>{v.name}</Text>
              <Text style={s.code}>{v.code} · {v.email}</Text>
              <Text style={[s.lastSeen, { marginTop: 3 }]}>Last seen {v.lastSeen}</Text>
            </View>
            <View style={s.right}>
              <Switch
                value={v.active}
                onValueChange={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleValidator(v.id);
                }}
                trackColor={{ false: colors.muted, true: colors.success }}
                thumbColor="#fff"
              />
              <Text style={s.scans}>{v.scansToday}</Text>
              <Text style={s.scansLbl}>scans</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
