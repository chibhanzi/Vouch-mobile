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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ValidatorSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace("/login");
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
    },
    content: {
      padding: 16,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 90),
    },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#fff",
    },
    profileName: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    profileCode: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.secondary,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    rowFirst: {
      borderTopWidth: 0,
    },
    rowLabel: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    rowValue: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    logoutBtn: {
      backgroundColor: "#FEF2F2",
      borderRadius: 14,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 4,
    },
    logoutText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.destructive,
    },
  });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{getInitials(user?.name ?? "V")}</Text>
          </View>
          <Text style={s.profileName}>{user?.name ?? "Validator"}</Text>
          <Text style={s.profileCode}>{user?.validatorCode}</Text>
          <Text style={s.profileEmail}>{user?.email}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionLabel}>Account</Text>
          {[
            { icon: "person-outline", label: "Role", value: "Validator", bg: "#EFF6FF", color: colors.secondary },
            { icon: "card-outline", label: "Validator Code", value: user?.validatorCode ?? "", bg: "#F0FDF4", color: "#22C55E" },
            { icon: "mail-outline", label: "Email", value: user?.email ?? "", bg: colors.muted, color: colors.mutedForeground },
          ].map((item, i) => (
            <View key={item.label} style={[s.row, i === 0 && s.rowFirst]}>
              <View style={[s.iconWrap, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={16} color={item.color} />
              </View>
              <Text style={s.rowLabel}>{item.label}</Text>
              <Text style={s.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionLabel}>Scanner</Text>
          {[
            { icon: "qr-code-outline", label: "Default Event", value: "TechConf 2026", bg: "#F5F3FF", color: "#7C3AED" },
            { icon: "location-outline", label: "Default Gate", value: user?.validatorCode ?? "Gate A", bg: "#FFF7ED", color: "#F59E0B" },
            { icon: "shield-checkmark-outline", label: "Blockchain Verify", value: "Enabled", bg: "#F0FDF4", color: "#22C55E" },
          ].map((item, i) => (
            <View key={item.label} style={[s.row, i === 0 && s.rowFirst]}>
              <View style={[s.iconWrap, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={16} color={item.color} />
              </View>
              <Text style={s.rowLabel}>{item.label}</Text>
              <Text style={s.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
          <Text style={s.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
