import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { VouchLogo } from "@/components/VouchLogo";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type ScanResult = {
  status: "valid" | "invalid" | "already_used";
  ticketId: string;
  holderName: string;
  eventName: string;
};

const MOCK_TICKETS: Record<string, { holderName: string; eventName: string; used: boolean }> = {
  "TKT-1001": { holderName: "Alice Morgan", eventName: "TechConf 2026", used: false },
  "TKT-1002": { holderName: "Bob Turner", eventName: "TechConf 2026", used: false },
  "TKT-1003": { holderName: "Carol White", eventName: "TechConf 2026", used: true },
  "TKT-9999": { holderName: "Unknown", eventName: "TechConf 2026", used: false },
};

const usedTickets = new Set<string>(["TKT-1003"]);

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, addScan } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [processing, setProcessing] = useState(false);
  const lastScanRef = useRef<string>("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 100 : 90);

  const processTicket = async (code: string) => {
    if (processing || code === lastScanRef.current) return;
    lastScanRef.current = code;
    setProcessing(true);

    await new Promise((r) => setTimeout(r, 600));

    const ticket = MOCK_TICKETS[code.toUpperCase()];
    let scanResult: ScanResult;

    if (!ticket) {
      scanResult = { status: "invalid", ticketId: code, holderName: "Unknown", eventName: "TechConf 2026" };
    } else if (usedTickets.has(code.toUpperCase())) {
      scanResult = { status: "already_used", ticketId: code, holderName: ticket.holderName, eventName: ticket.eventName };
    } else {
      usedTickets.add(code.toUpperCase());
      scanResult = { status: "valid", ticketId: code, holderName: ticket.holderName, eventName: ticket.eventName };
    }

    addScan({
      ticketId: scanResult.ticketId,
      holderName: scanResult.holderName,
      eventName: scanResult.eventName,
      status: scanResult.status,
      gate: user?.validatorCode ?? "Gate A",
    });

    if (scanResult.status === "valid") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setResult(scanResult);
    setProcessing(false);
    setScanning(false);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanning || processing) return;
    processTicket(data);
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    processTicket(manualCode.trim());
    setShowManual(false);
    setManualCode("");
  };

  const resultConfig = {
    valid: {
      bg: "#F0FDF4",
      icon: "checkmark-circle" as const,
      iconColor: "#22C55E",
      title: "Valid Ticket",
      btnText: "Scan Next",
    },
    invalid: {
      bg: "#FEF2F2",
      icon: "close-circle" as const,
      iconColor: "#EF4444",
      title: "Invalid Ticket",
      btnText: "Try Again",
    },
    already_used: {
      bg: "#FFFBEB",
      icon: "warning" as const,
      iconColor: "#F59E0B",
      title: "Already Used",
      btnText: "Scan Next",
    },
  };

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.card,
      paddingTop: topPad + 12,
      paddingBottom: 14,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#DCFCE7",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#22C55E" },
    statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#15803D" },
    content: {
      flex: 1,
      padding: 20,
      paddingBottom: bottomPad,
    },
    scanCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    scanCardTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    scanCardTitleText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    cameraWrap: {
      height: 240,
      backgroundColor: colors.muted,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: colors.border,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    cameraPlaceholder: {
      alignItems: "center",
      gap: 10,
    },
    cameraPlaceholderText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    cameraPlaceholderSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    btnRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 16,
    },
    scanBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
    },
    scanBtnActive: {
      backgroundColor: "#DC2626",
    },
    uploadBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingVertical: 14,
    },
    btnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    uploadBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    statusItemText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    resultSheet: {
      width: "100%",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 28,
      alignItems: "center",
    },
    resultTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginTop: 12,
      marginBottom: 6,
    },
    resultTicketId: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    resultInfoBox: {
      width: "100%",
      backgroundColor: colors.muted,
      borderRadius: 14,
      padding: 16,
      marginBottom: 20,
    },
    resultRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
    },
    resultRowLabel: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    resultRowValue: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    resultBtn: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
    },
    resultBtnText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    manualInput: {
      flex: 1,
      height: 48,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    manualInputWrap: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      marginBottom: 14,
    },
    manualSheet: {
      width: "100%",
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
    },
    manualTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 16,
    },
    manualBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    manualBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    processingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(255,255,255,0.85)",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      gap: 10,
    },
    processingText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
  });

  const showCamera = scanning && permission?.granted && Platform.OS !== "web";

  return (
    <View style={s.root}>
      <View style={s.header}>
        <VouchLogo size="sm" />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={s.statusBadge}>
            <View style={s.statusDot} />
            <Text style={s.statusText}>Online</Text>
          </View>
          <ThemeToggleButton />
        </View>
      </View>

      <View style={s.content}>
        <View style={s.scanCard}>
          <View style={s.scanCardTitle}>
            <Ionicons name="scan-outline" size={20} color={colors.primary} />
            <Text style={s.scanCardTitleText}>Enhanced Ticket Scanner</Text>
          </View>

          <View style={s.cameraWrap}>
            {showCamera ? (
              <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={handleBarCodeScanned}
              />
            ) : (
              <View style={s.cameraPlaceholder}>
                <Ionicons name="camera-outline" size={48} color={colors.mutedForeground} />
                <Text style={s.cameraPlaceholderText}>
                  Point camera at QR code or NFC tag
                </Text>
                <Text style={s.cameraPlaceholderSub}>Blockchain verification enabled</Text>
              </View>
            )}

            {processing && (
              <View style={s.processingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={s.processingText}>Verifying ticket...</Text>
              </View>
            )}
          </View>

          <View style={s.btnRow}>
            <Pressable
              style={({ pressed }) => [
                s.scanBtn,
                scanning && s.scanBtnActive,
                pressed && { opacity: 0.85 },
              ]}
              onPress={async () => {
                if (!permission?.granted) {
                  await requestPermission();
                }
                setScanning((v) => !v);
                lastScanRef.current = "";
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Ionicons name={scanning ? "stop" : "scan-outline"} size={18} color="#fff" />
              <Text style={s.btnText}>{scanning ? "Stop" : "Scan Ticket"}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [s.uploadBtn, pressed && { opacity: 0.8 }]}
              onPress={() => setShowManual(true)}
            >
              <Ionicons name="keypad-outline" size={18} color={colors.foreground} />
              <Text style={s.uploadBtnText}>Enter Code</Text>
            </Pressable>
          </View>

          <View style={s.statusRow}>
            <View style={s.statusItem}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#22C55E" />
              <Text style={s.statusItemText}>Blockchain Verified</Text>
            </View>
            <View style={s.statusItem}>
              <Ionicons name="people-outline" size={14} color={colors.secondary} />
              <Text style={s.statusItemText}>Team Synced</Text>
            </View>
          </View>
        </View>

        <View style={s.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.mutedForeground} />
          <Text style={s.infoText}>
            {user?.name ? `Signed in as ${user.name}` : "Validator"} · {user?.validatorCode ?? ""} · TechConf 2026
          </Text>
        </View>
      </View>

      {result && (
        <Modal transparent animationType="slide" visible={!!result}>
          <Pressable style={s.overlay} onPress={() => {}}>
            <View
              style={[
                s.resultSheet,
                { backgroundColor: resultConfig[result.status].bg },
              ]}
            >
              <Ionicons
                name={resultConfig[result.status].icon}
                size={64}
                color={resultConfig[result.status].iconColor}
              />
              <Text style={s.resultTitle}>{resultConfig[result.status].title}</Text>
              <Text style={s.resultTicketId}>{result.ticketId}</Text>

              <View style={s.resultInfoBox}>
                <View style={s.resultRow}>
                  <Text style={s.resultRowLabel}>Ticket Holder</Text>
                  <Text style={s.resultRowValue}>{result.holderName}</Text>
                </View>
                <View style={s.resultRow}>
                  <Text style={s.resultRowLabel}>Event</Text>
                  <Text style={s.resultRowValue}>{result.eventName}</Text>
                </View>
                <View style={s.resultRow}>
                  <Text style={s.resultRowLabel}>Gate</Text>
                  <Text style={s.resultRowValue}>{user?.validatorCode ?? "Gate A"}</Text>
                </View>
                <View style={s.resultRow}>
                  <Text style={s.resultRowLabel}>Status</Text>
                  <Text
                    style={[
                      s.resultRowValue,
                      { color: resultConfig[result.status].iconColor },
                    ]}
                  >
                    {result.status === "valid"
                      ? "Admitted"
                      : result.status === "already_used"
                      ? "Already Scanned"
                      : "Denied"}
                  </Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [s.resultBtn, pressed && { opacity: 0.85 }]}
                onPress={() => {
                  setResult(null);
                  lastScanRef.current = "";
                  setScanning(true);
                }}
              >
                <Text style={s.resultBtnText}>{resultConfig[result.status].btnText}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}

      {showManual && (
        <Modal transparent animationType="slide" visible={showManual}>
          <Pressable style={s.overlay} onPress={() => setShowManual(false)}>
            <Pressable style={s.manualSheet} onPress={() => {}}>
              <Text style={s.manualTitle}>Enter Ticket Code</Text>
              <View style={s.manualInputWrap}>
                <TextInput
                  style={s.manualInput}
                  placeholder="e.g. TKT-1001"
                  placeholderTextColor={colors.mutedForeground}
                  value={manualCode}
                  onChangeText={(t) => setManualCode(t.toUpperCase())}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoFocus
                />
              </View>
              <Pressable
                style={({ pressed }) => [s.manualBtn, pressed && { opacity: 0.85 }]}
                onPress={handleManualSubmit}
              >
                <Text style={s.manualBtnText}>Validate Ticket</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
