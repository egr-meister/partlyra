// Check Stock — items whose in-app stock review is due. Mark checked,
// adjust quantity, add to buy list, or open detail.

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import {
  safeName,
  safeText,
  safeQuantity,
  getStockStatus,
  isCheckDue,
  safeReminder,
  formatDate,
} from "../helpers";
import { StatusPill, Stepper, PrimaryButton, GhostButton } from "../components/UI";

export default function CheckStockScreen({ navigation }) {
  const { items, adjustQuantity, markStockChecked, setInBuyList } = useData();

  const dueItems = useMemo(
    () => (Array.isArray(items) ? items.filter((it) => isCheckDue(it)) : []),
    [items]
  );

  const renderItem = ({ item }) => {
    const name = safeName(item);
    const model = safeText(item.modelSpec);
    const qty = safeQuantity(item.quantityAtHome);
    const status = getStockStatus(item);
    const reminder = safeReminder(item);
    const inBuy = item.inBuyList === true;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("PartDetail", { id: item.id })}
        >
          <View style={styles.topRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {model ? (
                <Text style={styles.model} numberOfLines={1}>
                  {model}
                </Text>
              ) : null}
            </View>
            <StatusPill status={status} />
          </View>
          <Text style={styles.reminderMsg}>
            Stock review due · was set for {formatDate(reminder.nextCheckDate)}
          </Text>
        </TouchableOpacity>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>At home</Text>
          <Stepper
            value={qty}
            onDecrease={() => adjustQuantity(item.id, -1)}
            onIncrease={() => adjustQuantity(item.id, 1)}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="Checked stock"
            tone="teal"
            onPress={() => markStockChecked(item.id)}
            style={styles.actionBtn}
          />
          {inBuy ? (
            <GhostButton
              label="On Buy List"
              onPress={() => setInBuyList(item.id, false)}
              style={styles.actionBtn}
            />
          ) : (
            <GhostButton
              label="Add to Buy List"
              onPress={() => setInBuyList(item.id, true)}
              style={styles.actionBtn}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flex}
      data={dueItems}
      keyExtractor={(it) => (it && it.id ? it.id : Math.random().toString())}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        dueItems.length > 0 ? (
          <Text style={styles.lead}>
            {dueItems.length} part{dueItems.length === 1 ? "" : "s"} due for a
            stock review. Marking "Checked stock" reschedules the next reminder.
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⏱</Text>
          <Text style={styles.emptyTitle}>No stock checks due.</Text>
          <Text style={styles.emptyBody}>
            Enable a stock check reminder on a part to see it here when a review
            is due.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, flexGrow: 1 },
  lead: { fontSize: 13.5, color: COLORS.textSoft, marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#E8D49B",
    borderLeftWidth: 5,
    borderLeftColor: COLORS.amber,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  model: { fontSize: 13, color: COLORS.textSoft, marginTop: 2, fontWeight: "600" },
  reminderMsg: { fontSize: 12.5, color: "#8A6A1A", marginTop: 8, fontWeight: "600" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  qtyLabel: { fontSize: 13, color: COLORS.textSoft, fontWeight: "700" },
  actions: { flexDirection: "row", marginTop: SPACING.md },
  actionBtn: { flex: 1, marginHorizontal: 4 },
  empty: { alignItems: "center", paddingVertical: 60, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  emptyBody: { fontSize: 14, color: COLORS.textSoft, marginTop: 6, textAlign: "center" },
});
