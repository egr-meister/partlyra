// A single part rendered as a labeled drawer box. Shows name, model tag,
// compatible device, storage location, stock pill and status.

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { StatusPill } from "./UI";
import {
  safeName,
  safeCategory,
  safeText,
  safeQuantity,
  getStockStatus,
  isCheckDue,
} from "../helpers";
import { statusColors } from "./UI";

export default function PartCard({ item, onPress, compact }) {
  if (!item) return null;
  const name = safeName(item);
  const category = safeCategory(item);
  const model = safeText(item.modelSpec);
  const device = safeText(item.compatibleDevice);
  const location = safeText(item.storageLocation);
  const qty = safeQuantity(item.quantityAtHome);
  const status = getStockStatus(item);
  const c = statusColors(status);
  const due = isCheckDue(item);
  const inBuy = item.inBuyList === true;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: c.fg }]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {model ? (
            <Text style={styles.model} numberOfLines={1}>
              {model}
            </Text>
          ) : (
            <Text style={styles.modelMuted}>No model / spec</Text>
          )}
        </View>
        <View style={[styles.qtyPill, { backgroundColor: c.bg }]}>
          <Text style={[styles.qtyValue, { color: c.fg }]}>{qty}</Text>
          <Text style={[styles.qtyUnit, { color: c.fg }]}>in stock</Text>
        </View>
      </View>

      {!compact ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaText} numberOfLines={1}>
            {device ? `⛯ ${device}` : "⛯ No device linked"}
          </Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {location ? `▤ ${location}` : "▤ No location"}
          </Text>
        </View>
      ) : null}

      <View style={styles.bottomRow}>
        <StatusPill status={status} />
        <View style={styles.flagRow}>
          <Text style={styles.catText}>{category}</Text>
          {inBuy ? (
            <View style={[styles.flag, { backgroundColor: COLORS.tealSoft }]}>
              <Text style={[styles.flagText, { color: COLORS.teal }]}>
                Buy List
              </Text>
            </View>
          ) : null}
          {due ? (
            <View style={[styles.flag, { backgroundColor: COLORS.amberSoft }]}>
              <Text style={[styles.flagText, { color: COLORS.amber }]}>
                Check
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#DED7C8",
    borderLeftWidth: 5,
  },
  topRow: { flexDirection: "row", alignItems: "flex-start" },
  titleCol: { flex: 1, paddingRight: SPACING.sm },
  name: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  model: { fontSize: 13, color: COLORS.textSoft, marginTop: 2, fontWeight: "600" },
  modelMuted: {
    fontSize: 13,
    color: COLORS.textFaint,
    marginTop: 2,
    fontStyle: "italic",
  },
  qtyPill: {
    minWidth: 64,
    alignItems: "center",
    borderRadius: RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  qtyValue: { fontSize: 20, fontWeight: "900" },
  qtyUnit: { fontSize: 10, fontWeight: "700", marginTop: -2 },
  metaRow: { marginTop: SPACING.md },
  metaText: { fontSize: 12.5, color: COLORS.textSoft, marginTop: 3 },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  flagRow: { flexDirection: "row", alignItems: "center" },
  catText: { fontSize: 11, color: COLORS.textFaint, fontWeight: "700", marginRight: 8 },
  flag: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 6,
  },
  flagText: { fontSize: 11, fontWeight: "700" },
});
