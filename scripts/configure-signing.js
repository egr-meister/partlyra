/**
 * configure-signing.js
 *
 * Run AFTER `npx expo prebuild -p android`. It patches the generated
 * android/app/build.gradle so the release build type is signed using
 * Gradle project properties (passed on the command line in CI):
 *
 *   MYAPP_UPLOAD_STORE_FILE      (relative to android/app, e.g. release.p12)
 *   MYAPP_UPLOAD_STORE_PASSWORD
 *   MYAPP_UPLOAD_KEY_ALIAS
 *   MYAPP_UPLOAD_KEY_PASSWORD
 *
 * The script is idempotent: running it twice does not duplicate blocks.
 * If the signing properties are absent at build time, the release falls
 * back to debug signing so the build still succeeds locally.
 */

const fs = require("fs");
const path = require("path");

const gradlePath = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "build.gradle"
);

if (!fs.existsSync(gradlePath)) {
  console.error(
    "[configure-signing] android/app/build.gradle not found. Run `npx expo prebuild -p android` first."
  );
  process.exit(1);
}

let gradle = fs.readFileSync(gradlePath, "utf8");

const RELEASE_SIGNING_CONFIG = `
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
                storeType "pkcs12"
            }
        }
`;

if (gradle.indexOf("MYAPP_UPLOAD_STORE_FILE") === -1) {
  // Insert a release signingConfig right after the existing debug one.
  const signingConfigsRegex = /signingConfigs\s*\{/;
  if (signingConfigsRegex.test(gradle)) {
    gradle = gradle.replace(
      signingConfigsRegex,
      (match) => `${match}${RELEASE_SIGNING_CONFIG}`
    );
  } else {
    console.error("[configure-signing] No signingConfigs block found.");
    process.exit(1);
  }
}

// Point the release buildType at the release signing config when available,
// otherwise keep debug signing as a safe fallback.
const releaseBuildTypeRegex =
  /(buildTypes\s*\{[\s\S]*?release\s*\{)([\s\S]*?)(signingConfig\s+signingConfigs\.\w+)/;

if (releaseBuildTypeRegex.test(gradle)) {
  gradle = gradle.replace(
    releaseBuildTypeRegex,
    (full, head, middle) =>
      `${head}${middle}signingConfig project.hasProperty('MYAPP_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`
  );
} else {
  console.warn(
    "[configure-signing] Could not locate release buildType signingConfig; leaving as-is."
  );
}

fs.writeFileSync(gradlePath, gradle, "utf8");
console.log("[configure-signing] build.gradle patched for release signing.");
