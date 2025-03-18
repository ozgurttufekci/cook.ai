import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Welcome" }} />
        <Stack.Screen
          name="dietary"
          options={{ title: "Dietary Preferences" }}
        />
        <Stack.Screen name="kitchen" options={{ title: "Kitchen Inventory" }} />
        <Stack.Screen name="schedule" options={{ title: "Schedule" }} />
        <Stack.Screen name="preferences" options={{ title: "Preferences" }} />
        <Stack.Screen name="integrations" options={{ title: "Integrations" }} />
        <Stack.Screen name="permissions" options={{ title: "Permissions" }} />
        <Stack.Screen name="tutorial" options={{ title: "Tutorial" }} />
      </Stack>
    </>
  );
}
