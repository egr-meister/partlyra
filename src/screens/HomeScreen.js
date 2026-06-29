// Parts Shelf Home — the cabinet view. Header, search, needs-attention shelf,
// category drawer chips, quick filters, and the parts shelf list.

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import { CATEGORIES, STOCK_STATUS } from "../constants";
import {
  matchesSearch,
  getStockStatus,
  isCheckDue,
  computeStats,
  safeBool,
} from "../helpers";
import { SearchBar, Chip, ShelfLabel } from "../components/UI";
import PartCard from "../components/PartCard";

const FILTERS = ["All", "In Stock", "Low Stock", "Out of Stock", "Buy List", "Check Stock"];

export default function HomeScreen({ navigation, route }) {
  const { items, settings } = useData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState(null);

  // Accept an incoming category filter from the Categories screen.
  useEffect(() => {
    const incoming = route && route.params && route.params.category;
    if (incoming) {
      setActiveCategory(incoming);
      setFilter("All");
      navigation.setParams({ category: undefined });
    }
  }, [route, navigation]);

  const stats = useMemo(() => computeStats(items), [items]);

  const attention = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((it) => {
      const s = getStockStatus(it);
      return (
        s === STOCK_STATUS.LOW_STOCK ||
        s === STOCK_STATUS.OUT_OF_STOCK ||
        isCheckDue(it)
      );
    });
  }, [items]);

  const filtered = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((it) => {
      if (!matchesSearch(it, query)) return false;
      if (activeCategory && (it.category || "Other") !== activeCategory) return false;
      const s = getStockStatus(it);
      switch (filter) {
        case "In Stock":
          return s === STOCK_STATUS.IN_STOCK;
        case "Low Stock":
          return s === STOCK_STATUS.LOW_STOCK;
        case "Out of Stock":
          return s === STOCK_STATUS.OUT_OF_STOCK;
        case "Buy List":
          return safeBool(it.inBuyList);
        case "Check Stock":
          return isCheckDue(it);
        default:
          return true;
      }
    });
  }, [items, query, filter, activeCategory]);

  const openDetail = useCallback(
    (id) => navigation.navigate("PartDetail", { id }),
    [navigation]
  );

  const compact = settings && settings.compactMode === true;

  const ListHeader = (
    <View>
      {/* Quick filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            active={filter === f && !activeCategory}
            onPress={() => {
              setFilter(f);
              setActiveCategory(null);
            }}
          />
        ))}
      </ScrollView>

      {/* Category drawer chips */}
      <ShelfLabel title="Category Drawers" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <Chip
          label="All Drawers"
          active={!activeCategory}
          onPress={() => setActiveCategory(null)}
          count={stats.total}
        />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            count={stats.byCategory[cat] || 0}
            onPress={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
          />
        ))}
      </ScrollView>

      {/* Needs attention shelf (only when not filtering) */}
      {attention.length > 0 && !query && filter === "All" && !activeCategory ? (
        <View style={styles.attentionBox}>
          <View style={styles.attentionHead}>
            <Text style={styles.attentionTitle}>⚑ Needs Attention</Text>
            <Text style={styles.attentionCount}>{attention.length}</Text>
          </View>
          <Text style={styles.attentionSub}>
            {stats.outOfStock} out · {stats.lowStock} low · {stats.checkDue} to check
          </Text>
          <View style={styles.attentionBtnRow}>
            <TouchableOpacity
              style={styles.attentionBtn}
              onPress={() => navigation.navigate("CheckStock")}
            >
              <Text style={styles.attentionBtnText}>Review stock checks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.attentionBtn, styles.attentionBtnAlt]}
              onPress={() => setFilter("Low Stock")}
            >
              <Text style={styles.attentionBtnTextAlt}>Show low stock</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ShelfLabel
        title={activeCategory ? activeCategory : "Parts Shelf"}
        right={<Text style={styles.shelfCount}>{filtered.length}</Text>}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>Partlyra</Text>
          <Text style={styles.appSub}>Spare parts organizer</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate("Statistics")}
        >
          <Text style={styles.iconBtnText}>▥</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.iconBtnText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Search + shelf shortcuts */}
      <View style={styles.searchZone}>
        <SearchBar value={query} onChangeText={setQuery} />
        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={styles.shortcut}
            onPress={() => navigation.navigate("BuyList")}
          >
            <Text style={styles.shortcutIcon}>🧺</Text>
            <Text style={styles.shortcutText}>Buy List</Text>
            {stats.buyList > 0 ? (
              <View style={styles.shortcutBadge}>
                <Text style={styles.shortcutBadgeText}>{stats.buyList}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcut}
            onPress={() => navigation.navigate("CheckStock")}
          >
            <Text style={styles.shortcutIcon}>⏱</Text>
            <Text style={styles.shortcutText}>Check Stock</Text>
            {stats.checkDue > 0 ? (
              <View style={[styles.shortcutBadge, styles.shortcutBadgeAmber]}>
                <Text style={styles.shortcutBadgeText}>{stats.checkDue}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcut}
            onPress={() => navigation.navigate("Categories")}
          >
            <Text style={styles.shortcutIcon}>▦</Text>
            <Text style={styles.shortcutText}>Categories</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => (it && it.id ? it.id : Math.random().toString())}
        renderItem={({ item }) => (
          <PartCard
            item={item}
            compact={compact}
            onPress={() => openDetail(item.id)}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            {items.length === 0 ? (
              <>
                <Text style={styles.emptyTitle}>No parts yet</Text>
                <Text style={styles.emptyBody}>
                  Add your first spare part or household consumable.
                </Text>
              </>
            ) : (
              <Text style={styles.emptyTitle}>No matching parts.</Text>
            )}
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />

      {/* Add part action */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("AddPart")}
      >
        <Text style={styles.fabPlus}>＋</Text>
        <Text style={styles.fabText}>Add Part</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.header,
  },
  appTitle: { fontSize: 24, fontWeight: "900", color: COLORS.white },
  appSub: { fontSize: 13, color: "#D7DEE3", marginTop: 1, fontWeight: "600" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.headerDark,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },
  iconBtnText: { fontSize: 18, color: COLORS.white },
  searchZone: {
    backgroundColor: COLORS.header,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  shortcutRow: { flexDirection: "row", marginTop: SPACING.md },
  shortcut: {
    flex: 1,
    backgroundColor: COLORS.headerDark,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginHorizontal: 4,
  },
  shortcutIcon: { fontSize: 18 },
  shortcutText: { fontSize: 12, color: COLORS.white, fontWeight: "700", marginTop: 4 },
  shortcutBadge: {
    position: "absolute",
    top: 6,
    right: 12,
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: "center",
  },
  shortcutBadgeAmber: { backgroundColor: COLORS.amber },
  shortcutBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: "800" },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 110,
  },
  filterRow: { paddingVertical: SPACING.sm, paddingRight: SPACING.lg },
  shelfCount: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textSoft,
    backgroundColor: COLORS.chip,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 2,
    overflow: "hidden",
  },
  attentionBox: {
    backgroundColor: COLORS.amberSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: "#E8D49B",
  },
  attentionHead: { flexDirection: "row", alignItems: "center" },
  attentionTitle: { fontSize: 15, fontWeight: "800", color: "#8A6A1A", flex: 1 },
  attentionCount: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.white,
    backgroundColor: COLORS.amber,
    borderRadius: RADIUS.pill,
    minWidth: 26,
    textAlign: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: "hidden",
  },
  attentionSub: { fontSize: 13, color: "#8A6A1A", marginTop: 4, fontWeight: "600" },
  attentionBtnRow: { flexDirection: "row", marginTop: SPACING.md },
  attentionBtn: {
    flex: 1,
    backgroundColor: COLORS.amber,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  attentionBtnAlt: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.amber,
    marginRight: 0,
  },
  attentionBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 13 },
  attentionBtnTextAlt: { color: "#8A6A1A", fontWeight: "700", fontSize: 13 },
  empty: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  emptyBody: {
    fontSize: 14,
    color: COLORS.textSoft,
    marginTop: 6,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.teal,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 20,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabPlus: { fontSize: 20, color: COLORS.white, fontWeight: "800", marginRight: 6 },
  fabText: { fontSize: 15, color: COLORS.white, fontWeight: "800" },
});
