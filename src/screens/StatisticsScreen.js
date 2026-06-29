// Statistics — inventory-specific layout: a cabinet counter, stock strips,
// and small category drawer counters. No generic dashboard card.

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import { CATEGORIES } from "../constants";
import { computeStats } from "../helpers";
import { ShelfLabel } from "../components/UI";

function StockStrip({ label, value, total, color }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  return (
    <View style={styles.strip}>
      <View style={styles.stripHead}>
        <Text style={styles.stripLabel}>{label}</Text>
        <Text style={[styles.stripValue, { color }]}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

export default function StatisticsScreen() {
  const { items } = useData();
  const stats = useMemo(() => computeStats(items), [items]);

  const maxCat = useMemo(() => {
    let m = 0;
    CATEGORIES.forEach((c) => {
      const v = stats.byCategory[c] || 0;
      if (v > m) m = v;
    });
    return m;
  }, [stats]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      {/* Cabinet counter */}
      <View style={styles.cabinet}>
        <Text style={styles.cabinetLabel}>PARTS IN CABINET</Text>
        <Text style={styles.cabinetTotal}>{stats.total}</Text>
        <View style={styles.cabinetMetaRow}>
          <View style={styles.cabinetMeta}>
            <Text style={styles.cabinetMetaValue}>{stats.categoriesUsed}</Text>
            <Text style={styles.cabinetMetaLabel}>drawers used</Text>
          </View>
          <View style={styles.cabinetDivider} />
          <View style={styles.cabinetMeta}>
            <Text style={styles.cabinetMetaValue}>{stats.buyList}</Text>
            <Text style={styles.cabinetMetaLabel}>on buy list</Text>
          </View>
          <View style={styles.cabinetDivider} />
          <View style={styles.cabinetMeta}>
            <Text style={styles.cabinetMetaValue}>{stats.checkDue}</Text>
            <Text style={styles.cabinetMetaLabel}>checks due</Text>
          </View>
        </View>
      </View>

      {/* Stock strips */}
      <ShelfLabel title="Stock Levels" />
      <View style={styles.stripCard}>
        <StockStrip
          label="In stock"
          value={stats.inStock}
          total={stats.total}
          color={COLORS.teal}
        />
        <StockStrip
          label="Low stock"
          value={stats.lowStock}
          total={stats.total}
          color={COLORS.amber}
        />
        <StockStrip
          label="Out of stock"
          value={stats.outOfStock}
          total={stats.total}
          color={COLORS.red}
        />
      </View>

      {/* Category drawer counters */}
      <ShelfLabel title="Category Drawers" />
      <View style={styles.drawerGrid}>
        {CATEGORIES.map((cat) => {
          const v = stats.byCategory[cat] || 0;
          const pct = maxCat > 0 ? v / maxCat : 0;
          return (
            <View key={cat} style={styles.miniDrawer}>
              <View style={styles.miniCard}>
                <View style={styles.miniTop}>
                  <Text style={styles.miniValue}>{v}</Text>
                  <View style={styles.miniHandle} />
                </View>
                <Text style={styles.miniName} numberOfLines={2}>
                  {cat}
                </Text>
                <View style={styles.miniTrack}>
                  <View
                    style={[styles.miniFill, { width: `${Math.max(6, pct * 100)}%` }]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {stats.total === 0 ? (
        <Text style={styles.emptyNote}>
          Add parts to see your inventory statistics here.
        </Text>
      ) : null}
      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  cabinet: {
    backgroundColor: COLORS.header,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
  },
  cabinetLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#C6D0D7",
    letterSpacing: 1.5,
  },
  cabinetTotal: { fontSize: 52, fontWeight: "900", color: COLORS.white, marginVertical: 4 },
  cabinetMetaRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.sm },
  cabinetMeta: { alignItems: "center", paddingHorizontal: SPACING.md },
  cabinetMetaValue: { fontSize: 20, fontWeight: "800", color: COLORS.white },
  cabinetMetaLabel: { fontSize: 11, color: "#C6D0D7", marginTop: 2, fontWeight: "600" },
  cabinetDivider: { width: 1, height: 30, backgroundColor: "#5C6E7B" },
  stripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  strip: { marginBottom: SPACING.md },
  stripHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  stripLabel: { fontSize: 13.5, color: COLORS.textSoft, fontWeight: "700" },
  stripValue: { fontSize: 15, fontWeight: "900" },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  fill: { height: 10, borderRadius: 5 },
  drawerGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  miniDrawer: {
    width: "33.333%",
    padding: 4,
  },
  miniCard: {
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: "#DED7C8",
  },
  miniTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  miniValue: { fontSize: 22, fontWeight: "900", color: COLORS.header },
  miniHandle: { width: 16, height: 4, borderRadius: 2, backgroundColor: COLORS.divider },
  miniName: { fontSize: 11.5, color: COLORS.textSoft, fontWeight: "700", marginTop: 2, minHeight: 30 },
  miniTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    marginTop: 4,
    overflow: "hidden",
  },
  miniFill: { height: 5, borderRadius: 3, backgroundColor: COLORS.teal },
  // each mini drawer also needs a card-like bg via wrapper
  emptyNote: {
    fontSize: 13.5,
    color: COLORS.textFaint,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: SPACING.lg,
  },
});
