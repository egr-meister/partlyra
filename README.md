# Partlyra

**Spare parts organizer** — an offline spare parts and household consumables register for Android.

Partlyra is a calm, practical home parts cabinet. It helps you remember which spare parts, replacement items, and consumables you keep at home — light bulbs, vacuum bags, printer cartridges, razor blades, brush heads, filters, batteries, small replacement parts, and other consumables — including their model, the device they fit, how many you have, and where you put them.

Built with React Native + Expo. Android-focused. Portrait only. 100% offline.

---

## 1. Features

- Add spare parts and consumables (only name + category required).
- Link each item to a compatible device (e.g. "Kitchen lamp", "HP printer").
- Store model / size / specification (e.g. "E27 9W warm white", "HP 305 black").
- Track quantity at home with In Stock / Low Stock / Out of Stock status.
- Record where each item is stored (e.g. "Kitchen drawer", "Garage box").
- Maintain a separate **Buy List**, mark items bought, and add them back to stock.
- In-app **stock check reminders** (no notifications) with 7 / 14 / 30 / 60 / 90 day intervals.
- Fast local search by item name, model, compatible device, storage location, and category.
- Per-item notes.
- Inventory statistics: cabinet counter, stock strips, and category drawer counts.
- Everything stored locally; works fully in airplane mode.

## 2. Offline-first

Partlyra has **no backend, no cloud sync, and no account**. All data lives in the device's local storage (AsyncStorage). The app starts, runs, and saves entirely on-device. There is nothing to sign up for and nothing leaves your phone.

## 3. No internet / no permissions

The app requests **no runtime permissions** and declares no sensitive permissions. The Android manifest does **not** include the `INTERNET` permission (it is explicitly blocked in `app.json`). Partlyra does not use location, microphone, contacts, calendar, or alarm permissions.

## 4. No camera / no barcode scanner

There is no camera usage, no photo/gallery access, and no barcode scanner. Items are entered as plain text. No camera SDKs or scanner SDKs are bundled.

## 5. No notification permission

Partlyra does **not** request notification permission and does **not** use `expo-notifications`, background tasks, alarm manager, or calendar integration.

## 6. In-app stock reminders

Reminders are **in-app only**. When the app opens it checks which items are due for a stock review and surfaces them:

- the home screen shows a **Needs Attention** shelf and a **Check Stock** shortcut;
- the **Check Stock** screen lists every item whose review is due;
- each item's detail screen shows its next stock check date.

When you tap **Checked stock**, Partlyra records the date and schedules the next check using the item's interval. No system notification is ever shown.

## 7. Airplane mode support

Because there is no network code at all, Partlyra behaves identically online or in airplane mode. You can install it, add parts, search, and manage stock with the device fully offline.

## 8. Local storage

All app state is persisted to AsyncStorage under a single namespaced key. On load, stored data is merged with safe defaults, every field is normalized, missing fields are filled in, and corrupted JSON falls back to an empty, valid state. Data survives app restarts.

## 9. Spare part categories

Default categories: Light Bulbs, Vacuum Bags, Printer Cartridges, Razor Blades, Brush Heads, Filters, Batteries, Small Parts, Other. The Categories screen shows total / low / out / buy / check counts per drawer and lets you filter the shelf by tapping a drawer.

## 10. Compatible device

Each item can be linked to a compatible device as free text, so you can answer "what fits the hallway lamp?" or "which cartridge does my printer take?". The device field is searchable.

## 11. Model / specification

Each item carries a model / size / specification field, shown prominently on cards and detail screens. Examples: "E27 9W warm white", "Type G vacuum bag", "Braun Series 5", "AA battery".

## 12. Quantity tracking

Each item has `quantityAtHome` and `minimumQuantity` (defaults to 1). Status logic:

- **Out of Stock**: quantity ≤ 0
- **Low Stock**: 0 < quantity ≤ minimum
- **In Stock**: quantity > minimum

Quantity can be increased, decreased, set, or zeroed ("Mark as out of stock"). It never goes negative.

## 13. Storage location

Each item can record where it is kept. Storage location is searchable, making it easy to answer "where did I put that replacement part?".

## 14. Buy List

A separate Buy List collects items you intend to buy. Add items manually from the detail screen, or when stock is low/out. Mark an item as bought to optionally add the purchased quantity back to your home stock and remove it from the list.

## 15. Search

Local, case-insensitive, partial-match search across item name, model/specification, compatible device, storage location, and category. Searching "E27" finds "E27 9W warm white"; "printer" finds an HP printer cartridge; "drawer" finds items stored in a "Kitchen drawer". When nothing matches: **"No matching parts."**

## 16. App icon concept

A rounded-square, muted steel-blue tile containing a pale beige storage drawer with a handle, a small teal part dot, and an amber label tag with a check mark — a clean, serious utility mark that stays readable at small sizes. Generated as `assets/icon.png` and `assets/adaptive-icon.png` (no default Expo icon).

## 17. Splash screen concept

A centered storage-drawer/parts-box symbol over a warm light-gray background, with the name **Partlyra** and the subtitle **Spare parts organizer**. No heavy image assets. Generated as `assets/splash.png` (no default Expo splash).

## 18. Visual style

"Partlyra Utility Shelf" — organized, practical, serious, calm. Warm light-gray background, deep charcoal text, muted steel-blue header, soft teal in-stock accents, amber low-stock accents, muted red out-of-stock accents, pale beige drawer cards, and light slate dividers. Decoration is limited to shelf lines, drawer labels, box cards, model tags, quantity pills, and small part dots.

## 19. Parts shelf layout uniqueness

The home screen is intentionally **not** a generic dashboard. There is no mascot, no centered hero, no stats card, and no large vertical button menu. Instead it is a compact parts-shelf cabinet: header with title and icons, a search-first lookup, horizontal category drawer chips, a Needs Attention shelf, and part cards rendered as labeled drawer boxes with quantity pills and storage labels. The detail screen reads like opening a labeled drawer.

---

## 20. Project structure

```
partlyra/
├── App.js                      # Providers + navigation
├── index.js                    # Entry point
├── app.json                    # Expo config (Android API 35, no INTERNET, icon/splash)
├── babel.config.js
├── package.json
├── assets/                     # Custom icon, adaptive icon, splash
├── scripts/
│   └── configure-signing.js    # Patches gradle for release signing after prebuild
├── android-config/
│   └── proguard-rules.pro      # Copy into android/app/ after prebuild
├── .github/workflows/
│   └── android-build.yml       # CI: signed APK + AAB
└── src/
    ├── constants.js            # Categories, intervals, storage key, defaults
    ├── theme.js                # Colors, spacing, navigation theme (extends DefaultTheme)
    ├── helpers.js              # Stock logic, dates, search, stats (pure, defensive)
    ├── storage.js              # AsyncStorage load/save/normalize
    ├── DataContext.js          # Central store + all mutations
    ├── components/
    │   ├── UI.js               # Pills, chips, buttons, search bar, stepper
    │   ├── PartCard.js         # Drawer-box part card
    │   └── PartForm.js         # Shared add/edit form
    └── screens/                # 10 screens
        ├── OnboardingScreen.js
        ├── HomeScreen.js
        ├── AddPartScreen.js
        ├── PartDetailScreen.js
        ├── EditPartScreen.js
        ├── BuyListScreen.js
        ├── CheckStockScreen.js
        ├── CategoriesScreen.js
        ├── StatisticsScreen.js
        └── SettingsScreen.js
```

## 21. Data model

```js
PartItem = {
  id, name, category,
  compatibleDevice, modelSpec,
  quantityAtHome, minimumQuantity,
  storageLocation, notes,
  inBuyList,
  stockReminder: { enabled, intervalDays, lastCheckedAt, nextCheckDate },
  createdAt, updatedAt
}

Settings = { onboardingCompleted, compactMode, defaultReminderIntervalDays }
```

## 22. Scaffold with the Expo template

This repository already contains the full source. To recreate the project shell from scratch:

```bash
npx create-expo-app partlyra
```

Then copy the `App.js`, `index.js`, `app.json`, `src/`, `assets/`, `scripts/`, and `.github/` contents from this repo over the generated files.

## 23. Install dependencies with `npx expo install`

Always install through Expo so versions match the SDK. Every imported package is a direct dependency:

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-asset expo-constants expo-font expo-modules-core expo-status-bar
npx expo install expo-build-properties
```

Then align everything:

```bash
npx expo install --fix
```

## 24. Run locally

```bash
npm install
npx expo install --fix
npx expo start
```

Press **a** to open on an Android emulator or scan the QR code with a development build. The app works with empty/default storage on first launch.

## 25. Build Android (release)

```bash
# Generate the native Android project
npx expo prebuild --platform android --no-install

# Patch gradle for release signing
node scripts/configure-signing.js

# Copy the ProGuard rules
cp android-config/proguard-rules.pro android/app/proguard-rules.pro

# Build
cd android
./gradlew assembleRelease   # APK -> app/build/outputs/apk/release/
./gradlew bundleRelease     # AAB -> app/build/outputs/bundle/release/
```

Pass the signing properties on the command line (see section 27) or place them in `~/.gradle/gradle.properties`.

## 26. Generate a PKCS12 keystore

Use a PKCS12 keystore, and use the **same password** for the store and the key:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore partlyra-release-key.p12 -alias partlyra_key -keyalg RSA -keysize 2048 -validity 10000
```

Keep this file and its password **out of the repository** (it is in `.gitignore`).

## 27. Add GitHub Secrets

Base64-encode the keystore and add the following repository secrets (Settings → Secrets and variables → Actions):

```bash
base64 -i partlyra-release-key.p12 | tr -d '\n' > keystore.base64.txt
# paste the contents into ANDROID_KEYSTORE_BASE64
```

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | base64 of `partlyra-release-key.p12` |
| `ANDROID_KEYSTORE_PASSWORD` | keystore password |
| `ANDROID_KEY_ALIAS` | `partlyra_key` |
| `ANDROID_KEY_PASSWORD` | key password (same as keystore password) |

Local builds map these to Gradle properties:

```bash
./gradlew bundleRelease \
  -PMYAPP_UPLOAD_STORE_FILE=release.p12 \
  -PMYAPP_UPLOAD_STORE_PASSWORD=yourpass \
  -PMYAPP_UPLOAD_KEY_ALIAS=partlyra_key \
  -PMYAPP_UPLOAD_KEY_PASSWORD=yourpass
```

## 28. GitHub Actions

`.github/workflows/android-build.yml` runs on push to `main` (and manual dispatch). It:

1. checks out the repo and sets up Node 20 + JDK 17;
2. installs the Android SDK and `platforms;android-35` + `build-tools;35.0.0`;
3. runs `npm install`, `npx expo install --fix`, `npx expo-doctor`, `npx expo install --check`;
4. runs `npx expo prebuild --platform android --no-install`;
5. patches signing via `scripts/configure-signing.js`;
6. decodes the keystore from `ANDROID_KEYSTORE_BASE64`;
7. builds a signed release **APK** and **AAB**;
8. uploads both as workflow artifacts;
9. deletes the keystore.

No emulator smoke-test runs in CI (free runners are slow and flaky for that); see section 33 for local launch verification.

## 29. Google Play compatibility

- Targets **API 35** (`targetSdkVersion 35`) — not 34 — to satisfy current Play requirements.
- No Firebase, ads, analytics, payment, notification, barcode, or camera SDKs.
- No `INTERNET` permission and no runtime permission prompts.

## 30. Android API 35 notes

`app.json` sets `compileSdkVersion`, `targetSdkVersion`, and `buildToolsVersion` to 35 / 35.0.0 via `expo-build-properties`, with `minSdkVersion 24` (compatible with React Native 0.79). Use a current Expo SDK that supports Android API 35.

## 31. 16 KB page size compatibility

The app ships no old prebuilt native libraries; the only native modules are current Expo/React Native and AsyncStorage built with the API 35 toolchain, which produces 16 KB-page-aligned native libraries for Android 15/16. Avoid adding outdated native SDKs that would break 16 KB alignment.

## 32. Release optimization

Verify a **non-minified** release first:

```gradle
minifyEnabled false
shrinkResources false
```

Once that launches cleanly, enable standard R8/ProGuard:

```gradle
minifyEnabled true
shrinkResources true
proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
```

Only standard Android R8/ProGuard is used — no risky third-party obfuscation. Re-test launch after enabling minify/shrink.

## 33. Local launch verification checklist

A CI build is **not** proof the app launches. Before release:

```bash
adb install app-release.apk
adb logcat
```

Confirm there are no errors such as: *Cannot find native module*, *Module has not been registered*, *Invariant Violation*, *theme.fonts.regular is undefined*, AsyncStorage JSON parse crash, missing route-params crash, invalid date crash, invalid quantity crash.

Functional pass:

- first launch with empty storage;
- add a part; add a compatible device, model, quantity;
- decrease quantity to low, then to out of stock;
- add to Buy List; mark bought; increase stock after buying;
- enable a stock check reminder; mark stock checked;
- search by model, by device, by storage location;
- filter by category;
- delete an item and navigate back;
- reset all local data; relaunch; launch in airplane mode.

## 34. Privacy note

Partlyra stores spare parts, quantities, storage places, notes, and stock reminders **only on this device**. No account, no ads, no analytics, no internet connection, no camera, and no notification permission.
