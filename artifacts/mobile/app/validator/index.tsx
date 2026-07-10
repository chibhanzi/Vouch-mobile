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

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, addScan } = useAuth();
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
      notify(
        "fraud",
        "Fraudulent Ticket Detected",
        `${code} · ${user?.validatorCode ?? "Gate A"}`
      );
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
        `${code} · ${ticket.holderName} · ${user?.validatorCode ?? "Gate A"}`
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
      darkBg: "#052e16",
      icon: "checkmark-circle" as const,
      iconColor: "#22C55E",
      title: "Valid Ticket",
      hint: "↑ Swipe up to approve · ↓ Swipe down to reject",
    },
    invalid: {
      bg: "#FEF2F2",
      darkBg: "#1c0808",
      icon: "close-circle" as const,
      iconColor: "#EF4444",
      title: "Invalid Ticket",
      hint: "↑ Approve · ↓ Reject",
    },
    already_used: {
      bg: "#FFFBEB",
      darkBg: "#1c1508",
      icon: "warning" as const,
      iconColor: "#F59E0B",
      title: "Already Used",
      hint: "↑ Override · ↓ Deny",
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
            <Text style={s.onlineText}>Online</Text>
          </View>
        }
      />

      <View style={[s.content, { paddingBottom: bottomPad }]}>
        <View style={[s.scanCard, { backgroundColor: colors.card }]}>
          <View style={s.scanCardTitle}>
            <Ionicons name="scan-outline" size={18} color={colors.primary} />
            <Text style={[s.scanCardTitleText, { color: colors.foreground }]}>
              Ticket Scanner
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
                  Point camera at QR code
                </Text>
                <Text
                  style={[s.placeholderSub, { color: colors.mutedForeground }]}
                >
                  or enter code manually
                </Text>
              </View>
            )}
            {processing && (
              <View
                style={[
                  s.processingOverlay,
                  {
                    backgroundColor: isDark
                      ? "rgba(0,0,0,0.75)"
                      : "rgba(255,255,255,0.85)",
                  },
                ]}
              >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[s.processingText, { color: colors.primary }]}>
                  Verifying ticket…
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
                { backgroundColor: colors.card, borderColor: colors.border },
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

          <View style={s.statusRow}>
            <View style={s.statusItem}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#22C55E" />
              <Text style={[s.statusItemText, { color: colors.mutedForeground }]}>
                Verified
              </Text>
            </View>
            <View style={s.statusItem}>
              <Ionicons name="people-outline" size={13} color={colors.secondary} />
              <Text style={[s.statusItemText, { color: colors.mutedForeground }]}>
                {user?.validatorCode ?? "Gate A"}
              </Text>
            </View>
            <View style={s.statusItem}>
              <Ionicons name="notifications-outline" size={13} color={colors.warning} />
              <Text style={[s.statusItemText, { color: colors.mutedForeground }]}>
                Alerts On
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            s.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.mutedForeground}
          />
          <Text style={[s.infoText, { color: colors.mutedForeground }]}>
            {user?.name ?? "Validator"} · {user?.validatorCode ?? ""} · TechConf
            2026
          </Text>
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
                <View style={s.swipeHandle} />

                <Text style={[s.swipeHint, { color: colors.mutedForeground }]}>
                  {resultConfig[result.status].hint}
                </Text>

                <View style={s.approveRejectRow}>
                  <View style={[s.swipeActionHint, { backgroundColor: "#22C55E20" }]}>
                    <Ionicons name="checkmark" size={14} color="#22C55E" />
                    <Text style={[s.swipeActionText, { color: "#22C55E" }]}>Approve</Text>
                  </View>
                  <View style={[s.swipeActionHint, { backgroundColor: "#EF444420" }]}>
                    <Ionicons name="close" size={14} color="#EF4444" />
                    <Text style={[s.swipeActionText, { color: "#EF4444" }]}>Reject</Text>
                  </View>
                </View>

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
                    ["Ticket Holder", result.holderName],
                    ["Event", result.eventName],
                    ["Gate", user?.validatorCode ?? "Gate A"],
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
                        style={[
                          s.infoLabel,
                          { color: colors.mutedForeground },
                        ]}
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
                  { backgroundColor: colors.input, borderColor: colors.border },
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
                <Text style={s.manualBtnText}>Validate Ticket</Text>
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
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" },
  onlineText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#15803D",
  },
  content: { flex: 1, padding: 16, gap: 12 },
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
  scanCardTitleText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cameraWrap: {
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  placeholder: { alignItems: "center", gap: 8 },
  placeholderText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  placeholderSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  processingText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  btnRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  scanBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    paddingVertical: 13,
  },
  btnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
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
  altBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusItemText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  infoCard: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "flex-end",
  },
  resultSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  swipeHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 8,
  },
  swipeHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  approveRejectRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  swipeActionHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  swipeActionText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginTop: 10,
    marginBottom: 4,
  },
  resultId: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 16,
  },
  infoBox: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  infoLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  doneBtn: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  manualSheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  manualTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 14 },
  inputWrap: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: { height: 46, fontSize: 16, fontFamily: "Inter_500Medium" },
  manualBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  manualBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
