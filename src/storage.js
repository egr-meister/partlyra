// AsyncStorage layer. Loads, merges with defaults, normalizes every item,
// and never throws. Corrupted JSON falls back to defaults.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY, DEFAULT_APP_DATA, DEFAULT_SETTINGS } from "./constants";
import {
  makeId,
  safeName,
  safeCategory,
  safeText,
  safeQuantity,
  safeMinQuantity,
  safeBool,
  safeReminder,
  todayISO,
} from "./helpers";

// Normalize one item into the canonical PartItem shape with safe defaults.
export function normalizeItem(raw) {
  const item = raw && typeof raw === "object" ? raw : {};
  const now = todayISO();
  return {
    id: typeof item.id === "string" && item.id ? item.id : makeId(),
    name: safeName(item),
    category: safeCategory(item),
    compatibleDevice: safeText(item.compatibleDevice),
    modelSpec: safeText(item.modelSpec),
    quantityAtHome: safeQuantity(item.quantityAtHome),
    minimumQuantity: safeMinQuantity(item.minimumQuantity),
    storageLocation: safeText(item.storageLocation),
    notes: safeText(item.notes),
    inBuyList: safeBool(item.inBuyList),
    stockReminder: safeReminder(item),
    createdAt: typeof item.createdAt === "string" ? item.createdAt : now,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : now,
  };
}

function normalizeSettings(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const interval = Number(s.defaultReminderIntervalDays);
  return {
    onboardingCompleted: s.onboardingCompleted === true,
    compactMode: s.compactMode === true,
    defaultReminderIntervalDays:
      [7, 14, 30, 60, 90].indexOf(interval) >= 0 ? interval : 30,
  };
}

export function normalizeAppData(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const items = Array.isArray(data.items) ? data.items.map(normalizeItem) : [];
  return {
    items,
    settings: normalizeSettings(data.settings),
  };
}

// Returns a fully normalized app-data object. Always succeeds.
export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        items: [],
        settings: { ...DEFAULT_SETTINGS },
      };
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      // Corrupted JSON -> safe fallback to defaults.
      return {
        items: [],
        settings: { ...DEFAULT_SETTINGS },
      };
    }
    return normalizeAppData(parsed);
  } catch (e) {
    return {
      items: [],
      settings: { ...DEFAULT_SETTINGS },
    };
  }
}

// Persists app data. Returns true on success, false on failure (never throws).
export async function saveAppData(appData) {
  try {
    const safe = normalizeAppData(appData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return true;
  } catch (e) {
    return false;
  }
}

export async function clearAppData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}
