// Settings — compact mode, default reminder interval, replay onboarding,
// reset local data, app info, and the privacy note.

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import { REMINDER_INTERVALS } from "../constants";
import { ShelfLabel, GhostButton } from "../components/UI";

export default function SettingsScreen({ navigation }) {
  const {
    settings,
    items,
    updateSettings,
    showOnboardingAgain,
    resetAllData,
  } = useData();

  const compact = settings && settings.compactMode === true;
  const interval = (settings && settings.defaultReminderIntervalDays) || 30;

  const replayOnboarding = () => {
    showOnboardingAgain();
    navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
  };

  const confirmReset = () => {
    Alert.alert(
      "Reset all data",
      `This permanently deletes all ${items.length} part${
        items.length === 1 ? "" : "s"
      } and settings stored on this device. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset everything",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            Alert.alert("Done", "All local data has been cleared.");
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      {/* Display */}
      <ShelfLabel title="Display" />
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: SPACING.md }}>
            <Text style={styles.rowTitle}>Compact mode</Text>
            <Text style={styles.rowSub}>
              Hide the device and location lines on part cards for a denser
              shelf.
            </Text>
          </View>
          <Switch
            value={compact}
            onValueChange={(v) => updateSettings({ compactMode: v })}
            trackColor={{ true: COLORS.teal, false: COLORS.divider }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      {/* Reminders */}
      <ShelfLabel title="Stock Reminders" />
      <View style={styles.card}>
        <Text style={styles.rowTitle}>Default stock check interval</Text>
        <Text style={styles.rowSub}>
          Used as the starting interval when you enable a reminder on a new
          part.
        </Text>
        <View style={styles.intRow}>
          {REMINDER_INTERVALS.map((d) => {
            const active = interval === d;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => updateSettings({ defaultReminderIntervalDays: d })}
                style={[styles.intChip, active && styles.intChipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.intText, active && styles.intTextActive]}>
                  {d}d
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* App */}
      <ShelfLabel title="App" />
      <View style={styles.card}>
        <TouchableOpacity style={styles.linkRow} onPress={replayOnboarding}>
          <Text style={styles.linkText}>Show onboarding again</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.sep} />
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate("Statistics")}
        >
          <Text style={styles.linkText}>View statistics</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <GhostButton
        label="Reset all local data"
        tone="red"
        onPress={confirmReset}
        style={{ marginTop: SPACING.sm }}
      />

      {/* Info */}
      <ShelfLabel title="About" />
      <View style={styles.card}>
        <Text style={styles.aboutTitle}>Partlyra</Text>
        <Text style={styles.aboutSub}>Spare parts organizer · v1.0.0</Text>
        <Text style={styles.aboutBody}>
          A calm home parts cabinet and spare parts register. Track spare parts,
          consumables, compatible devices, quantities, storage places, and stock
          reviews.
        </Text>
      </View>

      <View style={styles.privacy}>
        <Text style={styles.privacyTitle}>Privacy</Text>
        <Text style={styles.privacyBody}>
          Partlyra stores spare parts, quantities, storage places, notes, and
          stock reminders only on this device. No account, no ads, no analytics,
          no internet connection, no camera, and no notification permission.
        </Text>
      </View>
      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  switchRow: { flexDirection: "row", alignItems: "center" },
  rowTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  rowSub: { fontSize: 12.5, color: COLORS.textSoft, marginTop: 3, lineHeight: 18 },
  intRow: { flexDirection: "row", flexWrap: "wrap", marginTop: SPACING.md },
  intChip: {
    backgroundColor: COLORS.chip,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  intChipActive: { backgroundColor: COLORS.teal },
  intText: { fontSize: 13, color: COLORS.textSoft, fontWeight: "700" },
  intTextActive: { color: COLORS.white },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  linkText: { fontSize: 15, color: COLORS.text, fontWeight: "600" },
  chevron: { fontSize: 22, color: COLORS.textFaint },
  sep: { height: 1, backgroundColor: COLORS.background, marginVertical: 4 },
  aboutTitle: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  aboutSub: { fontSize: 13, color: COLORS.textSoft, marginTop: 2, fontWeight: "600" },
  aboutBody: { fontSize: 13.5, color: COLORS.textSoft, marginTop: SPACING.md, lineHeight: 20 },
  privacy: {
    backgroundColor: COLORS.tealSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: "#BFE0DA",
  },
  privacyTitle: { fontSize: 14, fontWeight: "800", color: "#2E6E66" },
  privacyBody: { fontSize: 13, color: "#2E6E66", marginTop: 6, lineHeight: 19 },
});
