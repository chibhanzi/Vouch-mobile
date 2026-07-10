import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
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
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useColors } from "@/hooks/useColors";

type ScanResult = {
  status: "valid" | "invalid" | "already_used";
  ticketId: string;
  holderName: string;
  eventName: string;
};

const MOCK_TICKETS: Record<
  string,
  { holderName: string; eventName: string; used: boolean }
> = {
  "TKT-1001": { holderName: "Alice Morgan", eventName: "TechConf 2026", used: false },
  "TKT-1002": { holderName: "Bob Turner", eventName: "TechConf 2026", used: false },
  "TKT-1003": { holderName: "Carol White", eventName: "TechConf 2026", used: true },
  "TKT-9999": { holderName: "Unknown", eventName: "TechConf 2026", used: false },
};

const usedTickets = new Set<string>(["TKT-1003"]);

const SWIPE_THRESHOLD = 80;

export default function OrganizerScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addScan } = useAuth();
  const { notify } = useNotifications();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [processing, setProcessing] = useState(false);
  const lastScanRef = useRef<string>("");

  const translateY = useSharedValue(300);

  useEffect(() => {
    if (result) {
      translateY.value = 300;
      translateY.value = withSpring(0, { damping: 24, stiffness: 320 });
    }
  }, [result]);

  const handleDismiss = () => {
    setResult(null);
    lastScanRef.current = "";
    setScanning(true);
  };

  const handleApprove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResult(null);
    lastScanRef.current = "";
    setScanning(true);
  };

  const handleReject = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setResult(null);
    lastScanRef.current = "";
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY < -SWIPE_THRESHOLD) {
        runOnJS(handleApprove)();
      } else if (e.translationY > SWIPE_THRESHOLD) {
        runOnJS(handleReject)();
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 300 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const processTicket = async (code: string) => {
    if (processing || code === lastScanRef.current) return;
    lastScanRef.current = code;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    const ticket = MOCK_TICKETS[code.toUpperCase()];
    let scanResult: ScanResult;

    if (!ticket) {
      scanResult = {
        status: "invalid",
        ticketId: code,
        holderName: "Unknown",
        eventName: "TechConf 2026",
      };
      notify("fraud", "Invalid Ticket Detected", `${code} · Organizer Gate`);
    } else if (usedTickets.has(code.toUpperCase())) {
      scanResult = {
        status: "already_used",
        ticketId: code,
        holderName: ticket.holderName,
        eventName: ticket.eventName,
      };
      notify(
        "already_used",
        "Ticket Already Used",
        `${code} · ${ticket.holderName} · Organizer Gate`
      );
    } else {
      usedTickets.add(code.toUpperCase());
      scanResult = {
        status: "valid",
        ticketId: code,
        holderName: ticket.holderName,
        eventName: ticket.eventName,
      };
    }

    addScan({
      ticketId: scanResult.ticketId,
      holderName: scanResult.holderName,
      eventName: scanResult.eventName,
      status: scanResult.status,
      gate: "Organizer",
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
      darkBg: "#052e16",
      icon: "checkmark-circle" as const,
      iconColor: "#22C55E",
      title: "Valid Ticket",
      hint: "Swipe up · Approve",
    },
    invalid: {
      bg: "#FEF2F2",
      darkBg: "#1c0808",
      icon: "close-circle" as const,
      iconColor: "#EF4444",
      title: "Invalid Ticket",
      hint: "Swipe down · Reject",
    },
    already_used: {
      bg: "#FFFBEB",
      darkBg: "#1c1508",
      icon: "warning" as const,
      iconColor: "#F59E0B",
      title: "Already Used",
      hint: "Swipe to dismiss",
    },
  };

  const isDark = colors.card === "#1E293B";
  const showCamera = scanning && permission?.granted;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 100 : 110);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <AppHeader
        right={<ThemeToggleButton />}
        center={
          <View style={s.onlineBadge}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>Organizer</Text>
          </View>
        }
      />

      <View style={[s.content, { paddingBottom: bottomPad }]}>
        <View style={[s.scanCard, { backgroundColor: colors.card }]}>
          <View style={s.scanCardTitle}>
            <Ionicons name="scan-outline" size={18} color={colors.primary} />
            <Text style={[s.scanCardTitleText, { color: colors.foreground }]}>
              Quick Validate
            </Text>
          </View>

          <View
            style={[
              s.cameraWrap,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            {showCamera ? (
              <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={handleBarCodeScanned}
              />
            ) : (
              <View style={s.placeholder}>
                <Ionicons
                  name="camera-outline"
                  size={44}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[s.placeholderText, { color: colors.mutedForeground }]}
                >
                  Point camera at ticket QR
                </Text>
              </View>
            )}
            {processing && (
              <View
                style={[
                  s.processingOverlay,
                  { backgroundColor: isDark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)" },
                ]}
              >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[s.processingText, { color: colors.primary }]}>
                  Verifying…
                </Text>
              </View>
            )}
          </View>

          <View style={s.btnRow}>
            <Pressable
              style={({ pressed }) => [
                s.scanBtn,
                { backgroundColor: scanning ? "#DC2626" : colors.primary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={async () => {
                if (!permission?.granted) await requestPermission();
                setScanning((v) => !v);
                lastScanRef.current = "";
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Ionicons
                name={scanning ? "stop" : "scan-outline"}
                size={18}
                color="#fff"
              />
              <Text style={s.btnText}>{scanning ? "Stop" : "Scan Ticket"}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                s.altBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setShowManual(true)}
            >
              <Ionicons name="keypad-outline" size={18} color={colors.foreground} />
              <Text style={[s.altBtnText, { color: colors.foreground }]}>
                Enter Code
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {result && (
        <Modal transparent animationType="none" visible={!!result}>
          <View style={s.overlay}>
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  s.resultSheet,
                  {
                    backgroundColor: isDark
                      ? resultConfig[result.status].darkBg
                      : resultConfig[result.status].bg,
                  },
                  sheetStyle,
                ]}
              >
                <View style={s.swipeIndicator} />

                <Text style={[s.swipeHint, { color: colors.mutedForeground }]}>
                  {resultConfig[result.status].hint}
                </Text>

                <Ionicons
                  name={resultConfig[result.status].icon}
                  size={60}
                  color={resultConfig[result.status].iconColor}
                />
                <Text style={[s.resultTitle, { color: colors.foreground }]}>
                  {resultConfig[result.status].title}
                </Text>
                <Text style={[s.resultId, { color: colors.mutedForeground }]}>
                  {result.ticketId}
                </Text>

                <View
                  style={[s.infoBox, { backgroundColor: colors.card + "88" }]}
                >
                  {[
                    ["Holder", result.holderName],
                    ["Event", result.eventName],
                    ["Gate", "Organizer"],
                    [
                      "Status",
                      result.status === "valid"
                        ? "Admitted"
                        : result.status === "already_used"
                        ? "Already Scanned"
                        : "Denied",
                    ],
                  ].map(([label, value]) => (
                    <View key={label} style={s.infoRow}>
                      <Text
                        style={[s.infoLabel, { color: colors.mutedForeground }]}
                      >
                        {label}
                      </Text>
                      <Text
                        style={[
                          s.infoValue,
                          { color: colors.foreground },
                          label === "Status" && {
                            color: resultConfig[result.status].iconColor,
                          },
                        ]}
                      >
                        {value}
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    s.doneBtn,
                    { backgroundColor: colors.primary },
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={handleDismiss}
                >
                  <Text style={s.doneBtnText}>Scan Next</Text>
                </Pressable>
              </Animated.View>
            </GestureDetector>
          </View>
        </Modal>
      )}

      {showManual && (
        <Modal transparent animationType="slide" visible={showManual}>
          <Pressable style={s.overlay} onPress={() => setShowManual(false)}>
            <Pressable
              style={[s.manualSheet, { backgroundColor: colors.card }]}
              onPress={() => {}}
            >
              <Text style={[s.manualTitle, { color: colors.foreground }]}>
                Enter Ticket Code
              </Text>
              <View
                style={[
                  s.inputWrap,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[s.input, { color: colors.foreground }]}
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
                style={({ pressed }) => [
                  s.manualBtn,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleManualSubmit}
              >
                <Text style={s.manualBtnText}>Validate</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1A56DB" },
  onlineText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#1A56DB",
  },
  content: { flex: 1, padding: 16 },
  scanCard: {
    borderRadius: 20,
    padding: 18,
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
    marginBottom: 14,
  },
  scanCardTitleText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  cameraWrap: {
    height: 230,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  placeholder: { alignItems: "center", gap: 10 },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  processingText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  btnRow: { flexDirection: "row", gap: 10 },
  scanBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    paddingVertical: 13,
  },
  btnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  altBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 13,
  },
  altBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "flex-end",
  },
  resultSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    alignItems: "center",
    paddingBottom: 40,
  },
  swipeIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 10,
  },
  swipeHint: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginTop: 12,
    marginBottom: 4,
  },
  resultId: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 18,
  },
  infoBox: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  doneBtn: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  manualSheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  manualTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
  },
  inputWrap: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    height: 46,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  manualBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  manualBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
