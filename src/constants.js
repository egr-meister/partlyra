// Static app constants: categories, reminder intervals, storage keys.

export const STORAGE_KEY = "@partlyra/appdata/v1";

export const CATEGORIES = [
  "Light Bulbs",
  "Vacuum Bags",
  "Printer Cartridges",
  "Razor Blades",
  "Brush Heads",
  "Filters",
  "Batteries",
  "Small Parts",
  "Other",
];

export const DEFAULT_CATEGORY = "Other";

export const REMINDER_INTERVALS = [7, 14, 30, 60, 90];

export const STOCK_STATUS = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export const DEFAULT_SETTINGS = {
  onboardingCompleted: false,
  compactMode: false,
  defaultReminderIntervalDays: 30,
};

export const DEFAULT_APP_DATA = {
  items: [],
  settings: { ...DEFAULT_SETTINGS },
};

// A small example part used only the very first time so the empty
// shelf is not completely bare is intentionally NOT added, per the
// requirement that the app opens with a clean empty state.
