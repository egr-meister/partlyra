// Pure, defensive helper functions. Every function tolerates missing,
// null, or malformed input and returns safe defaults. No throws.

import { CATEGORIES, DEFAULT_CATEGORY, STOCK_STATUS } from "./constants";

// ---------- ID ----------
export function makeId() {
  return (
    "p_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

// ---------- Safe field getters ----------
export function safeName(item) {
  const n = item && typeof item.name === "string" ? item.name.trim() : "";
  return n.length > 0 ? n : "Untitled part";
}

export function safeCategory(item) {
  const c = item && typeof item.category === "string" ? item.category : "";
  return CATEGORIES.indexOf(c) >= 0 ? c : DEFAULT_CATEGORY;
}

export function safeText(value) {
  return typeof value === "string" ? value : "";
}

export function safeQuantity(value) {
  const n = Number(value);
  if (!isFinite(n) || isNaN(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export function safeMinQuantity(value) {
  const n = Number(value);
  if (!isFinite(n) || isNaN(n)) return 1;
  return Math.max(1, Math.floor(n));
}

export function safeBool(value) {
  return value === true;
}

export function safeReminder(item) {
  const r = (item && item.stockReminder) || {};
  const interval = Number(r.intervalDays);
  return {
    enabled: r.enabled === true,
    intervalDays: [7, 14, 30, 60, 90].indexOf(interval) >= 0 ? interval : 30,
    lastCheckedAt: typeof r.lastCheckedAt === "string" ? r.lastCheckedAt : null,
    nextCheckDate: typeof r.nextCheckDate === "string" ? r.nextCheckDate : null,
  };
}

// ---------- Stock status ----------
export function getStockStatus(item) {
  const qty = safeQuantity(item && item.quantityAtHome);
  const min = safeMinQuantity(item && item.minimumQuantity);
  if (qty <= 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (qty <= min) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
}

export function isLowOrOut(item) {
  const s = getStockStatus(item);
  return s === STOCK_STATUS.LOW_STOCK || s === STOCK_STATUS.OUT_OF_STOCK;
}

// ---------- Dates (YYYY-MM-DD strings) ----------
export function todayISO() {
  return toISODate(new Date());
}

export function toISODate(d) {
  try {
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return toISODate(new Date());
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch (e) {
    const n = new Date();
    return `${n.getFullYear()}-01-01`;
  }
}

export function addDaysISO(isoDate, days) {
  try {
    const base = isoDate ? new Date(isoDate) : new Date();
    const d = isNaN(base.getTime()) ? new Date() : base;
    d.setDate(d.getDate() + (Number(days) || 0));
    return toISODate(d);
  } catch (e) {
    return todayISO();
  }
}

// nextCheckDate = lastCheckedAt (or fallback) + intervalDays
export function computeNextCheckDate(item, fromDate) {
  const reminder = safeReminder(item);
  const base =
    fromDate ||
    reminder.lastCheckedAt ||
    (item && item.createdAt) ||
    todayISO();
  return addDaysISO(base, reminder.intervalDays);
}

// Returns true when a reminder is enabled and its next check date is today or past.
export function isCheckDue(item) {
  const reminder = safeReminder(item);
  if (!reminder.enabled) return false;
  const next = reminder.nextCheckDate;
  if (!next) return true; // enabled but never scheduled -> treat as due
  try {
    const nd = new Date(next);
    if (isNaN(nd.getTime())) return true;
    const today = new Date(todayISO());
    return nd.getTime() <= today.getTime();
  } catch (e) {
    return true;
  }
}

export function daysUntil(isoDate) {
  try {
    if (!isoDate) return null;
    const nd = new Date(isoDate);
    if (isNaN(nd.getTime())) return null;
    const today = new Date(todayISO());
    const diff = Math.round((nd.getTime() - today.getTime()) / 86400000);
    return diff;
  } catch (e) {
    return null;
  }
}

export function formatDate(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "Not set";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "Not set";
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch (e) {
    return "Not set";
  }
}

// ---------- Search ----------
export function matchesSearch(item, query) {
  const q = (typeof query === "string" ? query : "").trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    safeName(item),
    safeCategory(item),
    safeText(item && item.modelSpec),
    safeText(item && item.compatibleDevice),
    safeText(item && item.storageLocation),
    safeText(item && item.notes),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.indexOf(q) >= 0;
}

// ---------- Statistics ----------
export function computeStats(items) {
  const list = Array.isArray(items) ? items : [];
  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;
  let buyList = 0;
  let checkDue = 0;
  const byCategory = {};
  list.forEach((it) => {
    const status = getStockStatus(it);
    if (status === STOCK_STATUS.IN_STOCK) inStock++;
    else if (status === STOCK_STATUS.LOW_STOCK) lowStock++;
    else outOfStock++;
    if (safeBool(it && it.inBuyList)) buyList++;
    if (isCheckDue(it)) checkDue++;
    const cat = safeCategory(it);
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });
  return {
    total: list.length,
    inStock,
    lowStock,
    outOfStock,
    buyList,
    checkDue,
    categoriesUsed: Object.keys(byCategory).length,
    byCategory,
  };
}

export function categorySummary(items, category) {
  const list = Array.isArray(items) ? items : [];
  const inCat = list.filter((it) => safeCategory(it) === category);
  let low = 0;
  let out = 0;
  let buy = 0;
  let due = 0;
  inCat.forEach((it) => {
    const s = getStockStatus(it);
    if (s === STOCK_STATUS.LOW_STOCK) low++;
    if (s === STOCK_STATUS.OUT_OF_STOCK) out++;
    if (safeBool(it && it.inBuyList)) buy++;
    if (isCheckDue(it)) due++;
  });
  return { total: inCat.length, low, out, buy, due };
}
