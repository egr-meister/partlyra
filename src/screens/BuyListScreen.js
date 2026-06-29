// Buy List — items flagged to buy. Mark bought (optionally add to stock),
// remove from list, and clear all bought items.

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import {
  safeName,
  safeText,
  safeCategory,
  safeQuantity,
  getStockStatus,
} from "../helpers";
import { StatusPill, PrimaryButton, GhostButton, Stepper } from "../components/UI";

export default function BuyListScreen({ navigation }) {
  const { items, setInBuyList, markBought } = useData();
  const [modalId, setModalId] = useState(null);
  const [addQty, setAddQty] = useState(1);

  const buyItems = useMemo(
    () => (Array.isArray(items) ? items.filter((it) => it && it.inBuyList === true) : []),
    [items]
  );

  const activeItem = modalId ? items.find((it) => it && it.id === modalId) : null;

  const openBought = (id) => {
    setModalId(id);
    setAddQty(1);
  };

  const confirmBought = () => {
    if (modalId) markBought(modalId, addQty);
    setModalId(null);
  };

  const renderItem = ({ item }) => {
    const name = safeName(item);
    const model = safeText(item.modelSpec);
    const device = safeText(item.compatibleDevice);
    const location = safeText(item.storageLocation);
    const cat = safeCategory(item);
    const qty = safeQuantity(item.quantityAtHome);
    const status = getStockStatus(item);

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
          <Text style={styles.meta}>
            {cat}
            {device ? ` · ${device}` : ""}
            {location ? ` · ${location}` : ""}
          </Text>
          <Text style={styles.need}>Currently at home: {qty}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <PrimaryButton
            label="Mark as Bought"
            tone="teal"
            onPress={() => openBought(item.id)}
            style={styles.actionBtn}
          />
          <GhostButton
            label="Remove"
            tone="red"
            onPress={() => setInBuyList(item.id, false)}
            style={styles.actionBtn}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <FlatList
        data={buyItems}
        keyExtractor={(it) => (it && it.id ? it.id : Math.random().toString())}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          buyItems.length > 0 ? (
            <Text style={styles.lead}>
              {buyItems.length} item{buyItems.length === 1 ? "" : "s"} to buy. Mark
              an item as bought to add it back to your stock.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🧺</Text>
            <Text style={styles.emptyTitle}>Buy List is empty.</Text>
            <Text style={styles.emptyBody}>
              Add parts to the Buy List from any part's detail screen, or when
              stock runs low.
            </Text>
          </View>
        }
      />

      <Modal
        visible={!!activeItem}
        transparent
        animationType="fade"
        onRequestClose={() => setModalId(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mark as bought</Text>
            <Text style={styles.modalSub}>
              {activeItem ? safeName(activeItem) : ""}
            </Text>
            <Text style={styles.modalLabel}>How many did you buy?</Text>
            <View style={styles.modalStepper}>
              <Stepper
                value={addQty}
                onDecrease={() => setAddQty((q) => Math.max(0, q - 1))}
                onIncrease={() => setAddQty((q) => q + 1)}
              />
            </View>
            <Text style={styles.modalHint}>
              This amount will be added to the stock at home, and the item is
              removed from the Buy List.
            </Text>
            <PrimaryButton
              label={`Add ${addQty} & remove from list`}
              tone="teal"
              onPress={confirmBought}
              style={{ marginTop: SPACING.md }}
            />
            <GhostButton
              label="Cancel"
              onPress={() => setModalId(null)}
              style={{ marginTop: SPACING.sm }}
            />
          </View>
        </View>
      </Modal>
    </View>
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
    borderColor: "#DED7C8",
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  model: { fontSize: 13, color: COLORS.textSoft, marginTop: 2, fontWeight: "600" },
  meta: { fontSize: 12.5, color: COLORS.textSoft, marginTop: 8 },
  need: { fontSize: 12.5, color: COLORS.textFaint, marginTop: 4 },
  actions: { flexDirection: "row", marginTop: SPACING.md },
  actionBtn: { flex: 1, marginHorizontal: 4 },
  empty: { alignItems: "center", paddingVertical: 60, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  emptyBody: { fontSize: 14, color: COLORS.textSoft, marginTop: 6, textAlign: "center" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  modalSub: { fontSize: 14, color: COLORS.textSoft, marginTop: 2, fontWeight: "600" },
  modalLabel: { fontSize: 13, color: COLORS.text, fontWeight: "700", marginTop: SPACING.lg },
  modalStepper: { marginTop: SPACING.sm, alignItems: "flex-start" },
  modalHint: { fontSize: 12.5, color: COLORS.textFaint, marginTop: SPACING.md, lineHeight: 18 },
});
