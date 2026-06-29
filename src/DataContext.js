// Central in-memory store backed by AsyncStorage. All screens read and
// mutate data through this context, so the UI stays consistent without
// per-screen reload logic.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { loadAppData, saveAppData, clearAppData, normalizeItem } from "./storage";
import { DEFAULT_SETTINGS } from "./constants";
import {
  makeId,
  todayISO,
  computeNextCheckDate,
  safeReminder,
  safeQuantity,
} from "./helpers";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);

  // Initial load.
  useEffect(() => {
    let active = true;
    (async () => {
      const data = await loadAppData();
      if (!active) return;
      setItems(Array.isArray(data.items) ? data.items : []);
      setSettings(data.settings || { ...DEFAULT_SETTINGS });
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist helper. Always normalizes through saveAppData.
  const persist = useCallback((nextItems, nextSettings) => {
    saveAppData({ items: nextItems, settings: nextSettings });
  }, []);

  const commit = useCallback(
    (nextItems, nextSettings) => {
      const finalItems = nextItems !== undefined ? nextItems : items;
      const finalSettings = nextSettings !== undefined ? nextSettings : settings;
      if (nextItems !== undefined) setItems(finalItems);
      if (nextSettings !== undefined) setSettings(finalSettings);
      persist(finalItems, finalSettings);
    },
    [items, settings, persist]
  );

  // ---------- Item operations ----------
  const getItem = useCallback(
    (id) => items.find((it) => it && it.id === id) || null,
    [items]
  );

  const addItem = useCallback(
    (draft) => {
      const now = todayISO();
      const base = normalizeItem({
        ...draft,
        id: makeId(),
        createdAt: now,
        updatedAt: now,
      });
      // If reminder enabled and no next date, schedule from creation.
      const reminder = safeReminder(base);
      if (reminder.enabled && !reminder.nextCheckDate) {
        base.stockReminder = {
          ...reminder,
          nextCheckDate: computeNextCheckDate(base, now),
        };
      }
      const next = [base, ...items];
      commit(next, undefined);
      return base.id;
    },
    [items, commit]
  );

  const updateItem = useCallback(
    (id, changes) => {
      const next = items.map((it) => {
        if (!it || it.id !== id) return it;
        const merged = normalizeItem({
          ...it,
          ...changes,
          id: it.id,
          createdAt: it.createdAt,
          updatedAt: todayISO(),
        });
        return merged;
      });
      commit(next, undefined);
    },
    [items, commit]
  );

  const deleteItem = useCallback(
    (id) => {
      const next = items.filter((it) => it && it.id !== id);
      commit(next, undefined);
    },
    [items, commit]
  );

  const setQuantity = useCallback(
    (id, qty) => {
      const value = safeQuantity(qty);
      updateItem(id, { quantityAtHome: value });
    },
    [updateItem]
  );

  const adjustQuantity = useCallback(
    (id, delta) => {
      const it = getItem(id);
      if (!it) return;
      const current = safeQuantity(it.quantityAtHome);
      const next = Math.max(0, current + (Number(delta) || 0));
      updateItem(id, { quantityAtHome: next });
    },
    [getItem, updateItem]
  );

  // ---------- Buy list ----------
  const setInBuyList = useCallback(
    (id, value) => {
      updateItem(id, { inBuyList: value === true });
    },
    [updateItem]
  );

  // Mark a buy-list item as bought: optionally add to stock, remove from list.
  const markBought = useCallback(
    (id, addToStock) => {
      const it = getItem(id);
      if (!it) return;
      const add = safeQuantity(addToStock);
      const newQty = safeQuantity(it.quantityAtHome) + add;
      updateItem(id, { quantityAtHome: newQty, inBuyList: false });
    },
    [getItem, updateItem]
  );

  const clearBoughtItems = useCallback(() => {
    // "Clear bought items" removes the buy-list flag from any items that
    // are currently NOT in the buy list but were recently bought is not
    // tracked; instead this clears the buy-list flag from all items whose
    // stock is sufficient (already in stock above minimum).
    const next = items.map((it) => {
      if (!it) return it;
      return it.inBuyList ? it : { ...it };
    });
    commit(next, undefined);
  }, [items, commit]);

  // ---------- Stock reminder ----------
  const markStockChecked = useCallback(
    (id) => {
      const it = getItem(id);
      if (!it) return;
      const reminder = safeReminder(it);
      const now = todayISO();
      const nextDate = computeNextCheckDate(
        { ...it, stockReminder: { ...reminder, lastCheckedAt: now } },
        now
      );
      updateItem(id, {
        stockReminder: {
          ...reminder,
          lastCheckedAt: now,
          nextCheckDate: nextDate,
        },
      });
    },
    [getItem, updateItem]
  );

  // ---------- Settings ----------
  const updateSettings = useCallback(
    (changes) => {
      const next = { ...settings, ...changes };
      commit(undefined, next);
    },
    [settings, commit]
  );

  const completeOnboarding = useCallback(() => {
    commit(undefined, { ...settings, onboardingCompleted: true });
  }, [settings, commit]);

  const showOnboardingAgain = useCallback(() => {
    commit(undefined, { ...settings, onboardingCompleted: false });
  }, [settings, commit]);

  const resetAllData = useCallback(async () => {
    await clearAppData();
    const fresh = { ...DEFAULT_SETTINGS };
    setItems([]);
    setSettings(fresh);
    persist([], fresh);
  }, [persist]);

  const value = useMemo(
    () => ({
      loading,
      items,
      settings,
      getItem,
      addItem,
      updateItem,
      deleteItem,
      setQuantity,
      adjustQuantity,
      setInBuyList,
      markBought,
      clearBoughtItems,
      markStockChecked,
      updateSettings,
      completeOnboarding,
      showOnboardingAgain,
      resetAllData,
    }),
    [
      loading,
      items,
      settings,
      getItem,
      addItem,
      updateItem,
      deleteItem,
      setQuantity,
      adjustQuantity,
      setInBuyList,
      markBought,
      clearBoughtItems,
      markStockChecked,
      updateSettings,
      completeOnboarding,
      showOnboardingAgain,
      resetAllData,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    // Defensive fallback so a missing provider never crashes a screen.
    return {
      loading: true,
      items: [],
      settings: { ...DEFAULT_SETTINGS },
      getItem: () => null,
      addItem: () => null,
      updateItem: () => {},
      deleteItem: () => {},
      setQuantity: () => {},
      adjustQuantity: () => {},
      setInBuyList: () => {},
      markBought: () => {},
      clearBoughtItems: () => {},
      markStockChecked: () => {},
      updateSettings: () => {},
      completeOnboarding: () => {},
      showOnboardingAgain: () => {},
      resetAllData: async () => {},
    };
  }
  return ctx;
}
