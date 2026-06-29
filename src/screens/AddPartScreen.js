// Add a new part. Only name + category are required; everything else optional.

import React, { useState } from "react";
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
import PartForm, { formToDraft } from "../components/PartForm";
import { PrimaryButton, GhostButton } from "../components/UI";

export default function AddPartScreen({ navigation }) {
  const { addItem, settings } = useData();
  const defaultInterval =
    (settings && settings.defaultReminderIntervalDays) || 30;

  const [value, setValue] = useState({
    name: "",
    category: "Other",
    intervalDays: defaultInterval,
    reminderEnabled: false,
  });

  const save = (addToBuyList) => {
    const name = (value.name || "").trim();
    if (!name) {
      Alert.alert("Item name required", "Please enter an item name to save.");
      return;
    }
    const draft = formToDraft(value, defaultInterval);
    draft.inBuyList = addToBuyList === true;
    addItem(draft);
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
        <Text style={styles.lead}>
          Add a spare part or consumable. Only the name and category are
          required.
        </Text>
        <PartForm value={value} onChange={setValue} />

        <PrimaryButton label="Save Part" onPress={() => save(false)} />
        <GhostButton
          label="Save and Add to Buy List"
          tone="default"
          onPress={() => save(true)}
          style={{ marginTop: SPACING.sm }}
        />
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  lead: {
    fontSize: 13.5,
    color: COLORS.textSoft,
    marginBottom: SPACING.lg,
    lineHeight: 19,
  },
});
