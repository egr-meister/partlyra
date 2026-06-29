// Shared visual building blocks for the Partlyra Utility Shelf look:
// status pills, model tags, chips, shelf labels, drawer cards, buttons.

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { STOCK_STATUS } from "../constants";

export function statusColors(status) {
  if (status === STOCK_STATUS.OUT_OF_STOCK) {
    return { bg: COLORS.redSoft, fg: COLORS.red };
  }
  if (status === STOCK_STATUS.LOW_STOCK) {
    return { bg: COLORS.amberSoft, fg: COLORS.amber };
  }
  return { bg: COLORS.tealSoft, fg: COLORS.teal };
}

export function StatusPill({ status }) {
  const c = statusColors(status);
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.fg }]} />
      <Text style={[styles.pillText, { color: c.fg }]}>{status}</Text>
    </View>
  );
}

// Small quantity / count pill (the "stock pill").
export function CountPill({ label, value, tone }) {
  const palette = {
    teal: { bg: COLORS.tealSoft, fg: COLORS.teal },
    amber: { bg: COLORS.amberSoft, fg: COLORS.amber },
    red: { bg: COLORS.redSoft, fg: COLORS.red },
    steel: { bg: COLORS.chip, fg: COLORS.header },
  };
  const c = palette[tone] || palette.steel;
  return (
    <View style={[styles.countPill, { backgroundColor: c.bg }]}>
      <Text style={[styles.countValue, { color: c.fg }]}>{value}</Text>
      {label ? (
        <Text style={[styles.countLabel, { color: c.fg }]}>{label}</Text>
      ) : null}
    </View>
  );
}

// Model / specification tag.
export function Tag({ text, icon }) {
  if (!text) return null;
  return (
    <View style={styles.tag}>
      {icon ? <Text style={styles.tagIcon}>{icon}</Text> : null}
      <Text style={styles.tagText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

// Filter / category chip.
export function Chip({ label, active, onPress, count }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
      {typeof count === "number" ? (
        <View style={[styles.chipBadge, active && styles.chipBadgeActive]}>
          <Text
            style={[styles.chipBadgeText, active && styles.chipBadgeTextActive]}
          >
            {count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

// A shelf section label (looks like an engraved cabinet strip).
export function ShelfLabel({ title, right }) {
  return (
    <View style={styles.shelfLabel}>
      <View style={styles.shelfLine} />
      <Text style={styles.shelfTitle}>{title}</Text>
      <View style={styles.shelfLine} />
      {right ? <View style={styles.shelfRight}>{right}</View> : null}
    </View>
  );
}

// Drawer card container (the pale beige box look).
export function DrawerCard({ children, style, onPress }) {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.drawerCard, style]}
    >
      {children}
    </Wrap>
  );
}

export function PrimaryButton({ label, onPress, tone, style, disabled }) {
  const bg =
    tone === "teal"
      ? COLORS.teal
      : tone === "amber"
      ? COLORS.amber
      : tone === "red"
      ? COLORS.red
      : COLORS.header;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryBtn,
        { backgroundColor: disabled ? COLORS.divider : bg },
        style,
      ]}
    >
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress, tone, style }) {
  const fg = tone === "red" ? COLORS.red : COLORS.header;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.ghostBtn, { borderColor: fg }, style]}
    >
      <Text style={[styles.ghostBtnText, { color: fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.searchWrap}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search parts, models, devices…"}
        placeholderTextColor={COLORS.textFaint}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Text style={styles.searchClear}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// Stepper control (− value +).
export function Stepper({ value, onDecrease, onIncrease }) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity style={styles.stepBtn} onPress={onDecrease}>
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={onIncrease}>
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  pillText: { fontSize: 12, fontWeight: "700" },

  countPill: {
    minWidth: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  countValue: { fontSize: 18, fontWeight: "800" },
  countLabel: { fontSize: 11, fontWeight: "600", marginTop: 2 },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.chip,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  tagIcon: { fontSize: 12, marginRight: 4, color: COLORS.header },
  tagText: { fontSize: 12, color: COLORS.textSoft, fontWeight: "600" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.chip,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.chipActive },
  chipText: { fontSize: 13, color: COLORS.textSoft, fontWeight: "600" },
  chipTextActive: { color: COLORS.white },
  chipBadge: {
    marginLeft: 6,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.pill,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignItems: "center",
  },
  chipBadgeActive: { backgroundColor: COLORS.headerDark },
  chipBadgeText: { fontSize: 11, color: COLORS.textSoft, fontWeight: "700" },
  chipBadgeTextActive: { color: COLORS.white },

  shelfLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  shelfLine: {
    height: 2,
    width: 16,
    backgroundColor: COLORS.divider,
    borderRadius: 2,
  },
  shelfTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textSoft,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginHorizontal: 8,
  },
  shelfRight: { marginLeft: "auto" },

  drawerCard: {
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#DED7C8",
  },

  primaryBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },

  ghostBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  ghostBtnText: { fontSize: 15, fontWeight: "700" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  searchIcon: { fontSize: 18, color: COLORS.textFaint, marginRight: 6 },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  searchClear: { fontSize: 14, color: COLORS.textFaint, paddingHorizontal: 4 },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: "hidden",
  },
  stepBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.chip,
  },
  stepBtnText: { fontSize: 22, fontWeight: "700", color: COLORS.header },
  stepValue: {
    minWidth: 48,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
});

export default styles;
