// Reusable controlled form for creating and editing a part.
// Returns a normalized draft object via onValuesChange / getValues pattern
// using internal state and exposing values through props callbacks.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { CATEGORIES, REMINDER_INTERVALS } from "../constants";

function Field({ label, children, hint }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export default function PartForm({ value, onChange }) {
  // value is a controlled object held by the parent screen.
  const v = value || {};

  const set = (key, val) => {
    onChange({ ...v, [key]: val });
  };

  // Numeric text fields kept as strings while typing; parsed on save.
  return (
    <View>
      <Field label="Item name *">
        <TextInput
          style={styles.input}
          value={v.name || ""}
          onChangeText={(t) => set("name", t)}
          placeholder="e.g. E27 LED bulb"
          placeholderTextColor={COLORS.textFaint}
        />
      </Field>

      <Field label="Category *">
        <View style={styles.catWrap}>
          {CATEGORIES.map((cat) => {
            const active = (v.category || "Other") === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => set("category", cat)}
                style={[styles.catChip, active && styles.catChipActive]}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.catText, active && styles.catTextActive]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Field>

      <Field label="Compatible device">
        <TextInput
          style={styles.input}
          value={v.compatibleDevice || ""}
          onChangeText={(t) => set("compatibleDevice", t)}
          placeholder="e.g. Kitchen lamp, HP printer"
          placeholderTextColor={COLORS.textFaint}
        />
      </Field>

      <Field label="Model / size / specification">
        <TextInput
          style={styles.input}
          value={v.modelSpec || ""}
          onChangeText={(t) => set("modelSpec", t)}
          placeholder="e.g. E27 9W warm white"
          placeholderTextColor={COLORS.textFaint}
        />
      </Field>

      <View style={styles.row2}>
        <View style={styles.col}>
          <Field label="Quantity at home">
            <TextInput
              style={styles.input}
              value={v.quantityAtHome != null ? String(v.quantityAtHome) : ""}
              onChangeText={(t) => set("quantityAtHome", t.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={COLORS.textFaint}
            />
          </Field>
        </View>
        <View style={styles.col}>
          <Field label="Minimum desired">
            <TextInput
              style={styles.input}
              value={v.minimumQuantity != null ? String(v.minimumQuantity) : ""}
              onChangeText={(t) => set("minimumQuantity", t.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              placeholder="1"
              placeholderTextColor={COLORS.textFaint}
            />
          </Field>
        </View>
      </View>

      <Field label="Storage location">
        <TextInput
          style={styles.input}
          value={v.storageLocation || ""}
          onChangeText={(t) => set("storageLocation", t)}
          placeholder="e.g. Kitchen drawer, Garage box"
          placeholderTextColor={COLORS.textFaint}
        />
      </Field>

      <Field label="Notes">
        <TextInput
          style={[styles.input, styles.textArea]}
          value={v.notes || ""}
          onChangeText={(t) => set("notes", t)}
          placeholder="e.g. Buy only warm white"
          placeholderTextColor={COLORS.textFaint}
          multiline
        />
      </Field>

      <View style={styles.reminderBox}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock check reminder</Text>
            <Text style={styles.hint}>
              In-app only. Shows on the home shelf when due.
            </Text>
          </View>
          <Switch
            value={v.reminderEnabled === true}
            onValueChange={(val) => set("reminderEnabled", val)}
            trackColor={{ true: COLORS.teal, false: COLORS.divider }}
            thumbColor={COLORS.white}
          />
        </View>

        {v.reminderEnabled === true ? (
          <View style={styles.intervalWrap}>
            <Text style={styles.intervalLabel}>Check every</Text>
            <View style={styles.intervalChips}>
              {REMINDER_INTERVALS.map((d) => {
                const active = Number(v.intervalDays || 30) === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => set("intervalDays", d)}
                    style={[styles.intChip, active && styles.intChipActive]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.intText,
                        active && styles.intTextActive,
                      ]}
                    >
                      {d} days
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: SPACING.lg },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  hint: { fontSize: 12, color: COLORS.textFaint, marginTop: 4 },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  row2: { flexDirection: "row", marginHorizontal: -SPACING.sm / 2 },
  col: { flex: 1, marginHorizontal: SPACING.sm / 2 },
  catWrap: { flexDirection: "row", flexWrap: "wrap" },
  catChip: {
    backgroundColor: COLORS.chip,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  catChipActive: { backgroundColor: COLORS.header },
  catText: { fontSize: 13, color: COLORS.textSoft, fontWeight: "600" },
  catTextActive: { color: COLORS.white },
  reminderBox: {
    backgroundColor: COLORS.drawerAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#DED7C8",
    marginBottom: SPACING.lg,
  },
  switchRow: { flexDirection: "row", alignItems: "center" },
  intervalWrap: { marginTop: SPACING.md },
  intervalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSoft,
    marginBottom: 8,
  },
  intervalChips: { flexDirection: "row", flexWrap: "wrap" },
  intChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  intChipActive: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  intText: { fontSize: 13, color: COLORS.textSoft, fontWeight: "600" },
  intTextActive: { color: COLORS.white },
});

// Convert a form value object into a normalized item draft for storage.
export function formToDraft(v, fallbackInterval) {
  const value = v || {};
  return {
    name: (value.name || "").trim(),
    category: value.category || "Other",
    compatibleDevice: (value.compatibleDevice || "").trim(),
    modelSpec: (value.modelSpec || "").trim(),
    quantityAtHome: Math.max(0, parseInt(value.quantityAtHome, 10) || 0),
    minimumQuantity: Math.max(1, parseInt(value.minimumQuantity, 10) || 1),
    storageLocation: (value.storageLocation || "").trim(),
    notes: (value.notes || "").trim(),
    inBuyList: value.inBuyList === true,
    stockReminder: {
      enabled: value.reminderEnabled === true,
      intervalDays: Number(value.intervalDays) || fallbackInterval || 30,
      lastCheckedAt: value.lastCheckedAt || null,
      nextCheckDate: value.nextCheckDate || null,
    },
  };
}

// Convert a stored item into form value object.
export function itemToForm(item) {
  const it = item || {};
  const r = it.stockReminder || {};
  return {
    name: it.name || "",
    category: it.category || "Other",
    compatibleDevice: it.compatibleDevice || "",
    modelSpec: it.modelSpec || "",
    quantityAtHome: it.quantityAtHome != null ? String(it.quantityAtHome) : "",
    minimumQuantity: it.minimumQuantity != null ? String(it.minimumQuantity) : "",
    storageLocation: it.storageLocation || "",
    notes: it.notes || "",
    inBuyList: it.inBuyList === true,
    reminderEnabled: r.enabled === true,
    intervalDays: r.intervalDays || 30,
    lastCheckedAt: r.lastCheckedAt || null,
    nextCheckDate: r.nextCheckDate || null,
  };
}
