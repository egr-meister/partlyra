// Edit an existing part. Recalculates stock status implicitly (via helpers)
// and preserves reminder schedule unless the interval/enabled changes.

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { COLORS, SPACING } from "../theme";
import { useData } from "../DataContext";
import PartForm, { formToDraft, itemToForm } from "../components/PartForm";
import { PrimaryButton } from "../components/UI";
import { computeNextCheckDate, todayISO } from "../helpers";

export default function EditPartScreen({ navigation, route }) {
  const id = route && route.params ? route.params.id : null;
  const { getItem, updateItem, settings } = useData();
  const item = id ? getItem(id) : null;
  const defaultInterval =
    (settings && settings.defaultReminderIntervalDays) || 30;

  const initial = useMemo(() => itemToForm(item), [item]);
  const [value, setValue] = useState(initial);

  if (!item) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Part not found</Text>
        <Text style={styles.missingBody}>
          This part may have been deleted.
        </Text>
        <PrimaryButton
          label="Go Back"
          onPress={() => navigation.goBack()}
          style={{ marginTop: SPACING.lg, alignSelf: "stretch" }}
        />
      </View>
    );
  }

  const save = () => {
    const name = (value.name || "").trim();
    if (!name) {
      Alert.alert("Item name required", "Please enter an item name to save.");
      return;
    }
    const draft = formToDraft(value, defaultInterval);

    // Preserve existing schedule unless reminder settings changed.
    const prev = item.stockReminder || {};
    const enabledChanged = draft.stockReminder.enabled !== (prev.enabled === true);
    const intervalChanged =
      draft.stockReminder.intervalDays !== (prev.intervalDays || 30);

    if (draft.stockReminder.enabled) {
      draft.stockReminder.lastCheckedAt = prev.lastCheckedAt || null;
      if (enabledChanged || intervalChanged || !prev.nextCheckDate) {
        draft.stockReminder.nextCheckDate = computeNextCheckDate(
          {
            ...item,
            stockReminder: {
              ...draft.stockReminder,
              lastCheckedAt: prev.lastCheckedAt || item.createdAt || todayISO(),
            },
          },
          prev.lastCheckedAt || item.createdAt || todayISO()
        );
      } else {
        draft.stockReminder.nextCheckDate = prev.nextCheckDate;
      }
    } else {
      draft.stockReminder.lastCheckedAt = prev.lastCheckedAt || null;
      draft.stockReminder.nextCheckDate = prev.nextCheckDate || null;
    }

    updateItem(id, draft);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <PartForm value={value} onChange={setValue} />
        <PrimaryButton label="Save Changes" onPress={save} />
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  missing: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  missingTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  missingBody: { fontSize: 14, color: COLORS.textSoft, marginTop: 6 },
});
