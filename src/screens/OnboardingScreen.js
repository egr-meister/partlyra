// First-launch welcome. Explains the app, local-only storage, and in-app
// reminders. Offers "Add First Part" and "Skip".

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SPACING } from "../theme";
import { PrimaryButton, GhostButton } from "../components/UI";
import { useData } from "../DataContext";

const POINTS = [
  {
    icon: "▤",
    title: "Keep spare parts easy to find",
    body: "A calm register for bulbs, filters, cartridges, batteries and every other household consumable.",
  },
  {
    icon: "⛯",
    title: "Track what matters",
    body: "Store models, compatible devices, quantities and the exact place you keep each part.",
  },
  {
    icon: "⏱",
    title: "In-app stock reminders",
    body: "Partlyra reminds you to review stock inside the app. No notifications, no permissions.",
  },
  {
    icon: "✦",
    title: "Works fully offline",
    body: "Everything stays on this device. No account, no internet, no ads.",
  },
];

export default function OnboardingScreen({ navigation }) {
  const { completeOnboarding } = useData();

  const finish = (goAdd) => {
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: goAdd
        ? [{ name: "Home" }, { name: "AddPart" }]
        : [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandBox}>
          <View style={styles.logoSquare}>
            <View style={styles.logoDrawer}>
              <View style={styles.logoLine} />
              <View style={styles.logoHandle} />
            </View>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.title}>Partlyra</Text>
          <Text style={styles.subtitle}>Spare parts organizer</Text>
        </View>

        {POINTS.map((p) => (
          <View key={p.title} style={styles.point}>
            <View style={styles.pointIcon}>
              <Text style={styles.pointIconText}>{p.icon}</Text>
            </View>
            <View style={styles.pointTextCol}>
              <Text style={styles.pointTitle}>{p.title}</Text>
              <Text style={styles.pointBody}>{p.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Add First Part" onPress={() => finish(true)} />
        <GhostButton
          label="Skip"
          onPress={() => finish(false)}
          style={{ marginTop: SPACING.sm }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, paddingBottom: SPACING.lg },
  brandBox: { alignItems: "center", marginBottom: SPACING.xl },
  logoSquare: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: COLORS.header,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  logoDrawer: {
    width: 48,
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.drawer,
    justifyContent: "center",
    alignItems: "center",
  },
  logoLine: {
    position: "absolute",
    top: 18,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: COLORS.headerDark,
  },
  logoHandle: {
    position: "absolute",
    bottom: 7,
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.headerDark,
  },
  logoDot: {
    position: "absolute",
    top: 26,
    left: 28,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.teal,
  },
  title: { fontSize: 30, fontWeight: "900", color: COLORS.text, letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: COLORS.textSoft, marginTop: 2, fontWeight: "600" },
  point: {
    flexDirection: "row",
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#DED7C8",
  },
  pointIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.tealSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  pointIconText: { fontSize: 20, color: COLORS.teal },
  pointTextCol: { flex: 1 },
  pointTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  pointBody: { fontSize: 13.5, color: COLORS.textSoft, marginTop: 3, lineHeight: 19 },
  footer: {
    padding: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
