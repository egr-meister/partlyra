// Categories — each category drawer with total / low / out / buy / due counts.
// Tapping a drawer filters the home shelf.

import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import { CATEGORIES } from "../constants";
import { categorySummary } from "../helpers";
import { CountPill } from "../components/UI";

export default function CategoriesScreen({ navigation }) {
  const { items } = useData();

  const data = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        category: cat,
        summary: categorySummary(items, cat),
      })),
    [items]
  );

  const renderItem = ({ item }) => {
    const s = item.summary;
    const empty = s.total === 0;
    return (
      <TouchableOpacity
        activeOpacity={empty ? 1 : 0.85}
        disabled={empty}
        onPress={() => navigation.navigate("Home", { category: item.category })}
        style={[styles.drawer, empty && styles.drawerEmpty]}
      >
        <View style={styles.drawerTop}>
          <View style={styles.handle} />
          <Text style={styles.catName}>{item.category}</Text>
          <Text style={styles.totalText}>{s.total}</Text>
        </View>
        {empty ? (
          <Text style={styles.emptyLabel}>Empty drawer</Text>
        ) : (
          <View style={styles.pillRow}>
            {s.low > 0 ? <CountPill value={s.low} label="low" tone="amber" /> : null}
            {s.out > 0 ? <CountPill value={s.out} label="out" tone="red" /> : null}
            {s.buy > 0 ? <CountPill value={s.buy} label="buy" tone="teal" /> : null}
            {s.due > 0 ? <CountPill value={s.due} label="check" tone="amber" /> : null}
            {s.low === 0 && s.out === 0 && s.buy === 0 && s.due === 0 ? (
              <Text style={styles.allGood}>All stocked</Text>
            ) : null}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={styles.flex}
      data={data}
      keyExtractor={(it) => it.category}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <Text style={styles.lead}>
          Tap a drawer to open it on the parts shelf.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  lead: { fontSize: 13.5, color: COLORS.textSoft, marginBottom: SPACING.md },
  drawer: {
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#DED7C8",
  },
  drawerEmpty: { backgroundColor: COLORS.drawerAlt, opacity: 0.7 },
  drawerTop: { flexDirection: "row", alignItems: "center" },
  handle: {
    width: 26,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.header,
    marginRight: SPACING.md,
  },
  catName: { flex: 1, fontSize: 16, fontWeight: "800", color: COLORS.text },
  totalText: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.header,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    minWidth: 34,
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: "hidden",
  },
  pillRow: { flexDirection: "row", flexWrap: "wrap", marginTop: SPACING.md, gap: 8 },
  emptyLabel: { fontSize: 13, color: COLORS.textFaint, marginTop: SPACING.sm, fontStyle: "italic" },
  allGood: { fontSize: 13, color: COLORS.teal, fontWeight: "700", marginTop: 4 },
});
