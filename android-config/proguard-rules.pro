# Partlyra ProGuard / R8 rules.
#
# After running `npx expo prebuild -p android`, copy this file to
# android/app/proguard-rules.pro (it is referenced by the release build
# type via proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'),
# 'proguard-rules.pro').
#
# These rules keep React Native + Hermes + AsyncStorage working under
# minify/shrink. They use ONLY standard Android R8/ProGuard — no third-party
# obfuscation libraries.

# --- React Native core ---
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**

# --- Hermes ---
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# --- Expo modules ---
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# --- AsyncStorage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# --- Keep annotations and native methods ---
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.proguard.annotations.KeepGettersAndSetters *;
    native <methods>;
}

# --- Keep JS-callable React methods ---
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod <methods>; }

# Reduce noise from optional libraries.
-dontwarn okio.**
-dontwarn javax.annotation.**
