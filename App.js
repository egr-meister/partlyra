// Partlyra — offline spare parts & household consumables organizer.
// Root component: providers, navigation, and first-launch gating.

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DataProvider, useData } from "./src/DataContext";
import { NavTheme, COLORS } from "./src/theme";

import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddPartScreen from "./src/screens/AddPartScreen";
import PartDetailScreen from "./src/screens/PartDetailScreen";
import EditPartScreen from "./src/screens/EditPartScreen";
import BuyListScreen from "./src/screens/BuyListScreen";
import CheckStockScreen from "./src/screens/CheckStockScreen";
import CategoriesScreen from "./src/screens/CategoriesScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.header },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: "800" },
  contentStyle: { backgroundColor: COLORS.background },
  headerShadowVisible: false,
};

function RootNavigator() {
  const { loading, settings } = useData();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.header} />
      </View>
    );
  }

  const showOnboarding = !(settings && settings.onboardingCompleted === true);

  return (
    <Stack.Navigator
      initialRouteName={showOnboarding ? "Onboarding" : "Home"}
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPart"
        component={AddPartScreen}
        options={{ title: "Add Part" }}
      />
      <Stack.Screen
        name="PartDetail"
        component={PartDetailScreen}
        options={{ title: "Part Drawer" }}
      />
      <Stack.Screen
        name="EditPart"
        component={EditPartScreen}
        options={{ title: "Edit Part" }}
      />
      <Stack.Screen
        name="BuyList"
        component={BuyListScreen}
        options={{ title: "Buy List" }}
      />
      <Stack.Screen
        name="CheckStock"
        component={CheckStockScreen}
        options={{ title: "Check Stock" }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Categories" }}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: "Statistics" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <NavigationContainer theme={NavTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </DataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
});
