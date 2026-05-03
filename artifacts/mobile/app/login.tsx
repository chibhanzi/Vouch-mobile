import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VouchLogo } from "@/components/VouchLogo";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const logoImage = require("@/assets/images/vouch-logo.png");

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>("organizer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validatorCode, setValidatorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setError("");
    setEmail("");
    setPassword("");
    setValidatorCode("");
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (role === "validator" && !validatorCode.trim()) {
      setError("Please enter your validator code");
      return;
    }
    setError("");
    setLoading(true);
    const result = await login({
      email: email.trim(),
      password,
      role,
      validatorCode: validatorCode.trim() || undefined,
    });
    setLoading(false);
    if (result.success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (role === "organizer") {
        router.replace("/organizer");
      } else {
        router.replace("/validator");
      }
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error ?? "Login failed");
    }
  };

  const isOrganizer = role === "organizer";

  const s = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flexGrow: 1,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: insets.top + (Platform.OS === "web" ? 20 : 12),
      paddingBottom: insets.bottom + 24,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
    },
    themeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 4,
    },
    appLogoWrap: {
      alignItems: "center",
      marginBottom: 18,
    },
    appLogo: {
      width: 180,
      height: 56,
    },
    title: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 20,
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 3,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 9,
      borderRadius: 10,
    },
    tabActive: {
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    tabText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    tabTextActive: {
      color: colors.foreground,
    },
    roleInfo: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 12,
      marginBottom: 20,
    },
    roleInfoText: {
      flex: 1,
    },
    roleInfoTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 3,
    },
    roleInfoDesc: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      lineHeight: 17,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      marginBottom: 6,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
      paddingHorizontal: 14,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    eyeBtn: {
      padding: 4,
    },
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#FEF2F2",
      borderRadius: 10,
      padding: 10,
      marginBottom: 14,
    },
    errorText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.destructive,
      flex: 1,
    },
    btn: {
      backgroundColor: colors.primary,
      borderRadius: 13,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 4,
    },
    btnValidator: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    btnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    btnTextValidator: {
      color: colors.foreground,
    },
    demo: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 12,
    },
    joinCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    joinIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    joinText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    joinSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
  });

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.inner}>
          <View style={s.header}>
            <VouchLogo size="md" />
            <View style={s.themeBtn}>
              <Ionicons name="sunny-outline" size={18} color={colors.mutedForeground} />
            </View>
          </View>

          <View style={s.card}>
            <View style={s.appLogoWrap}>
              <Image source={logoImage} style={s.appLogo} resizeMode="contain" />
            </View>

            <Text style={s.title}>Sign In to Vouch</Text>
            <Text style={s.subtitle}>Choose your account type to continue</Text>

            <View style={s.tabs}>
              <Pressable
                style={[s.tab, isOrganizer && s.tabActive]}
                onPress={() => handleRoleSwitch("organizer")}
              >
                <Ionicons
                  name="business-outline"
                  size={15}
                  color={isOrganizer ? colors.foreground : colors.mutedForeground}
                />
                <Text style={[s.tabText, isOrganizer && s.tabTextActive]}>
                  Organizer
                </Text>
              </Pressable>
              <Pressable
                style={[s.tab, !isOrganizer && s.tabActive]}
                onPress={() => handleRoleSwitch("validator")}
              >
                <Ionicons
                  name="scan-outline"
                  size={15}
                  color={!isOrganizer ? colors.foreground : colors.mutedForeground}
                />
                <Text style={[s.tabText, !isOrganizer && s.tabTextActive]}>
                  Validator
                </Text>
              </Pressable>
            </View>

            {isOrganizer ? (
              <View
                style={[
                  s.roleInfo,
                  { backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
                ]}
              >
                <Ionicons name="shield-outline" size={18} color={colors.secondary} />
                <View style={s.roleInfoText}>
                  <Text style={[s.roleInfoTitle, { color: colors.primary }]}>
                    Event Organizer
                  </Text>
                  <Text style={[s.roleInfoDesc, { color: "#1D4ED8" }]}>
                    Full access to create events, manage validators, view analytics,
                    and control all validation settings.
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  s.roleInfo,
                  { backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0" },
                ]}
              >
                <Ionicons name="people-outline" size={18} color="#16A34A" />
                <View style={s.roleInfoText}>
                  <Text style={[s.roleInfoTitle, { color: "#15803D" }]}>
                    Validator
                  </Text>
                  <Text style={[s.roleInfoDesc, { color: "#166534" }]}>
                    Scan and validate tickets at event gates. Access to scanning
                    interface and team coordination.
                  </Text>
                </View>
              </View>
            )}

            <Text style={s.label}>
              {isOrganizer ? "Organization Email" : "Validator Email"}
            </Text>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder={
                  isOrganizer ? "organizer@company.com" : "validator@event.com"
                }
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {!isOrganizer && (
              <>
                <Text style={s.label}>Validator Code</Text>
                <View style={s.inputWrap}>
                  <TextInput
                    style={s.input}
                    placeholder="Enter validator code"
                    placeholderTextColor={colors.mutedForeground}
                    value={validatorCode}
                    onChangeText={(t) => setValidatorCode(t.toUpperCase())}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>
              </>
            )}

            <Text style={s.label}>Password</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCorrect={false}
              />
              <Pressable style={s.eyeBtn} onPress={() => setShowPassword((p) => !p)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>

            {!!error && (
              <View style={s.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.destructive} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                s.btn,
                !isOrganizer && s.btnValidator,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={isOrganizer ? "#fff" : colors.primary} />
              ) : (
                <Text style={[s.btnText, !isOrganizer && s.btnTextValidator]}>
                  Sign In as {isOrganizer ? "Organizer" : "Validator"}
                </Text>
              )}
            </Pressable>

            <Text style={s.demo}>
              {isOrganizer
                ? "Demo: organizer@event.com / password"
                : "Demo: validator@event.com / VAL001 / password"}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [s.joinCard, pressed && { opacity: 0.8 }]}
            onPress={() => handleRoleSwitch("validator")}
          >
            <View style={s.joinIconWrap}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.joinText}>Join Event Team</Text>
              <Text style={s.joinSub}>Sign in as a validator to scan tickets</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
