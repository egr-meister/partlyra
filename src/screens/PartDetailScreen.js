// Part Detail — opening a labeled storage drawer. Shows every field, with
// quantity stepper, stock status, storage label, notes memo, reminder strip,
// buy-list control, and edit / delete.

import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";
import { useData } from "../DataContext";
import {
  safeName,
  safeCategory,
  safeText,
  safeQuantity,
  safeMinQuantity,
  getStockStatus,
  safeReminder,
  isCheckDue,
  formatDate,
  daysUntil,
} from "../helpers";
import {
  StatusPill,
  Stepper,
  PrimaryButton,
  GhostButton,
  Tag,
  statusColors,
} from "../components/UI";

function Row({ label, value, placeholder }) {
  const has = value && String(value).trim().length > 0;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, !has && styles.rowValueMuted]}>
        {has ? value : placeholder || "Not set"}
      </Text>
    </View>
  );
}

export default function PartDetailScreen({ navigation, route }) {
  const id = route && route.params ? route.params.id : null;
  const {
    getItem,
    adjustQuantity,
    setInBuyList,
    markStockChecked,
    deleteItem,
  } = useData();
  const item = id ? getItem(id) : null;

  useLayoutEffect(() => {
    if (item) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditPart", { id })}
            style={styles.headerEdit}
          >
            <Text style={styles.headerEditText}>Edit</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, item, id]);

  if (!item) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Part not found</Text>
        <Text style={styles.missingBody}>
          This part may have been deleted.
        </Text>
        <PrimaryButton
          label="Back to Shelf"
          onPress={() => navigation.navigate("Home")}
          style={{ marginTop: SPACING.lg, alignSelf: "stretch" }}
        />
      </View>
    );
  }

  const name = safeName(item);
  const category = safeCategory(item);
  const model = safeText(item.modelSpec);
  const device = safeText(item.compatibleDevice);
  const location = safeText(item.storageLocation);
  const notes = safeText(item.notes);
  const qty = safeQuantity(item.quantityAtHome);
  const min = safeMinQuantity(item.minimumQuantity);
  const status = getStockStatus(item);
  const sc = statusColors(status);
  const reminder = safeReminder(item);
  const due = isCheckDue(item);
  const inBuy = item.inBuyList === true;

  const confirmDelete = () => {
    Alert.alert("Delete part", `Remove "${name}" from your shelf?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteItem(id);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
    >
      {/* Drawer label header */}
      <View style={[styles.drawerHead, { borderLeftColor: sc.fg }]}>
        <Text style={styles.name}>{name}</Text>
        {model ? (
          <Tag text={model} icon="⚙" />
        ) : (
          <Text style={styles.noModel}>No model / specification</Text>
        )}
        <View style={styles.headPills}>
          <StatusPill status={status} />
          <View style={styles.catChip}>
            <Text style={styles.catChipText}>{category}</Text>
          </View>
        </View>
      </View>

      {/* Shelf counter / quantity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stock counter</Text>
        <View style={styles.counterRow}>
          <View style={[styles.counterBox, { backgroundColor: sc.bg }]}>
            <Text style={[styles.counterValue, { color: sc.fg }]}>{qty}</Text>
            <Text style={[styles.counterLabel, { color: sc.fg }]}>at home</Text>
          </View>
          <View style={styles.counterControls}>
            <Stepper
              value={qty}
              onDecrease={() => adjustQuantity(id, -1)}
              onIncrease={() => adjustQuantity(id, 1)}
            />
            <Text style={styles.minText}>Minimum desired: {min}</Text>
            <TouchableOpacity onPress={() => adjustQuantity(id, -qty)}>
              <Text style={styles.markOut}>Mark as out of stock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Drawer details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Drawer details</Text>
        <Row label="Compatible device" value={device} placeholder="No device linked" />
        <Row label="Storage location" value={location} placeholder="No location set" />
        <Row label="Category" value={category} />
        <Row label="Minimum desired" value={String(min)} />
        <Row label="Added" value={formatDate(item.createdAt)} />
        <Row label="Updated" value={formatDate(item.updatedAt)} />
      </View>

      {/* Notes memo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notes</Text>
        {notes ? (
          <View style={styles.memo}>
            <Text style={styles.memoText}>{notes}</Text>
          </View>
        ) : (
          <Text style={styles.emptyNote}>No notes added.</Text>
        )}
      </View>

      {/* Reminder strip */}
      <View
        style={[
          styles.card,
          styles.reminderStrip,
          due && reminder.enabled
            ? { backgroundColor: COLORS.amberSoft, borderColor: "#E8D49B" }
            : null,
        ]}
      >
        <Text style={styles.cardTitle}>Stock check reminder</Text>
        {reminder.enabled ? (
          <>
            <Text style={styles.reminderInfo}>
              Every {reminder.intervalDays} days · Next check:{" "}
              {formatDate(reminder.nextCheckDate)}
            </Text>
            {reminder.lastCheckedAt ? (
              <Text style={styles.reminderSub}>
                Last checked {formatDate(reminder.lastCheckedAt)}
              </Text>
            ) : (
              <Text style={styles.reminderSub}>Not checked yet</Text>
            )}
            {due ? (
              <Text style={styles.dueBadge}>● Stock review is due</Text>
            ) : (
              <Text style={styles.reminderSub}>
                {(() => {
                  const d = daysUntil(reminder.nextCheckDate);
                  return d == null
                    ? ""
                    : d <= 0
                    ? "Due now"
                    : `Due in ${d} day${d === 1 ? "" : "s"}`;
                })()}
              </Text>
            )}
            <PrimaryButton
              label="Mark stock checked"
              tone="teal"
              onPress={() => markStockChecked(id)}
              style={{ marginTop: SPACING.md }}
            />
          </>
        ) : (
          <Text style={styles.emptyNote}>
            Reminder is off. Enable it in Edit to get in-app stock reviews.
          </Text>
        )}
      </View>

      {/* Buy list control */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Buy list</Text>
        <Text style={styles.reminderSub}>
          {inBuy ? "This part is on your Buy List." : "Not on the Buy List."}
        </Text>
        {inBuy ? (
          <GhostButton
            label="Remove from Buy List"
            onPress={() => setInBuyList(id, false)}
            style={{ marginTop: SPACING.md }}
          />
        ) : (
          <PrimaryButton
            label="Add to Buy List"
            onPress={() => setInBuyList(id, true)}
            style={{ marginTop: SPACING.md }}
          />
        )}
      </View>

      {/* Actions */}
      <GhostButton
        label="Delete Part"
        tone="red"
        onPress={confirmDelete}
        style={{ marginTop: SPACING.sm }}
      />
      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  headerEdit: { paddingHorizontal: 6, paddingVertical: 4 },
  headerEditText: { color: COLORS.white, fontWeight: "800", fontSize: 15 },
  drawerHead: {
    backgroundColor: COLORS.drawer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#DED7C8",
    borderLeftWidth: 6,
    marginBottom: SPACING.md,
  },
  name: { fontSize: 22, fontWeight: "900", color: COLORS.text, marginBottom: 8 },
  noModel: { fontSize: 13, color: COLORS.textFaint, fontStyle: "italic" },
  headPills: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  catChip: {
    marginLeft: 8,
    backgroundColor: COLORS.chip,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  catChipText: { fontSize: 12, color: COLORS.textSoft, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textFaint,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  counterRow: { flexDirection: "row", alignItems: "center" },
  counterBox: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.lg,
  },
  counterValue: { fontSize: 36, fontWeight: "900" },
  counterLabel: { fontSize: 12, fontWeight: "700", marginTop: -2 },
  counterControls: { flex: 1 },
  minText: { fontSize: 13, color: COLORS.textSoft, marginTop: SPACING.sm },
  markOut: { fontSize: 13, color: COLORS.red, fontWeight: "700", marginTop: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  rowLabel: { fontSize: 13.5, color: COLORS.textSoft, fontWeight: "600" },
  rowValue: {
    fontSize: 13.5,
    color: COLORS.text,
    fontWeight: "700",
    maxWidth: "60%",
    textAlign: "right",
  },
  rowValueMuted: { color: COLORS.textFaint, fontStyle: "italic", fontWeight: "500" },
  memo: {
    backgroundColor: COLORS.drawerAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.amber,
  },
  memoText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  emptyNote: { fontSize: 13.5, color: COLORS.textFaint, fontStyle: "italic" },
  reminderStrip: {},
  reminderInfo: { fontSize: 14, color: COLORS.text, fontWeight: "700" },
  reminderSub: { fontSize: 13, color: COLORS.textSoft, marginTop: 4 },
  dueBadge: {
    fontSize: 13,
    color: COLORS.amber,
    fontWeight: "800",
    marginTop: 6,
  },
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
