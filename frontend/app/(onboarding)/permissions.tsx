import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  required: boolean;
}

const PERMISSIONS: Permission[] = [
  {
    id: "notifications",
    name: "Push Notifications",
    description: "Get reminders for meal prep and cooking times",
    icon: "notifications",
    required: false,
  },
  {
    id: "camera",
    name: "Camera",
    description: "Take photos of your dishes and scan ingredients",
    icon: "camera",
    required: false,
  },
  {
    id: "location",
    name: "Location",
    description: "Find nearby grocery stores and delivery options",
    icon: "location",
    required: false,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Sync meal plans with your calendar",
    icon: "calendar",
    required: false,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const [grantedPermissions, setGrantedPermissions] = useState<Set<string>>(
    new Set()
  );

  const togglePermission = (id: string) => {
    setGrantedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    // Here you would typically request the actual permissions
    router.push("/(onboarding)/tutorial");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Permissions</Text>
      <Text style={styles.subtitle}>
        Enable permissions to get the most out of Cook.ai
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {PERMISSIONS.map((permission, index) => (
          <Animated.View
            key={permission.id}
            entering={FadeIn.delay(index * 100)}
            style={styles.permissionCard}
          >
            <View style={styles.permissionContent}>
              <Ionicons
                name={permission.icon}
                size={32}
                color="#007AFF"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.permissionName}>
                  {permission.name}
                  {permission.required && (
                    <Text style={styles.required}> (Required)</Text>
                  )}
                </Text>
                <Text style={styles.permissionDescription}>
                  {permission.description}
                </Text>
              </View>
              <Switch
                value={grantedPermissions.has(permission.id)}
                onValueChange={() => togglePermission(permission.id)}
                trackColor={{ false: "#E0E0E0", true: "#007AFF88" }}
                thumbColor={
                  grantedPermissions.has(permission.id) ? "#007AFF" : "#fff"
                }
              />
            </View>
          </Animated.View>
        ))}

        <View style={styles.notice}>
          <Ionicons name="shield-checkmark" size={24} color="#666" />
          <Text style={styles.noticeText}>
            We value your privacy. You can change these permissions at any time
            in your device settings.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingButton
          label="Continue"
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
  },
  content: {
    flex: 1,
  },
  permissionCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  permissionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  permissionName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  required: {
    color: "#FF3B30",
    fontSize: 14,
  },
  permissionDescription: {
    fontSize: 14,
    color: "#666",
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  noticeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#666",
  },
  footer: {
    paddingVertical: 24,
  },
  button: {
    width: "100%",
  },
});
