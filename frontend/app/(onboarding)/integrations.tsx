import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "grocery_delivery",
    name: "Grocery Delivery",
    description: "Automatically order ingredients from local stores",
    icon: "truck-delivery",
  },
  {
    id: "meal_planning",
    name: "Meal Planning",
    description: "Sync meal plans with your calendar",
    icon: "calendar-clock",
  },
  {
    id: "smart_kitchen",
    name: "Smart Kitchen",
    description: "Connect with smart kitchen appliances",
    icon: "home-automation",
  },
  {
    id: "nutrition",
    name: "Nutrition Tracking",
    description: "Track nutritional info with health apps",
    icon: "heart-pulse",
  },
];

export default function IntegrationsScreen() {
  const router = useRouter();
  const [enabledIntegrations, setEnabledIntegrations] = useState<Set<string>>(
    new Set()
  );

  const toggleIntegration = (id: string) => {
    setEnabledIntegrations((prev) => {
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
    // Here you would typically save the integration preferences
    router.push("/(onboarding)/permissions");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integrations</Text>
      <Text style={styles.subtitle}>
        Connect with your favorite services to enhance your cooking experience
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {INTEGRATIONS.map((integration, index) => (
          <Animated.View
            key={integration.id}
            entering={FadeIn.delay(index * 100)}
            style={styles.integrationCard}
          >
            <View style={styles.integrationContent}>
              <MaterialCommunityIcons
                name={integration.icon}
                size={32}
                color="#007AFF"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.integrationName}>{integration.name}</Text>
                <Text style={styles.integrationDescription}>
                  {integration.description}
                </Text>
              </View>
              <Switch
                value={enabledIntegrations.has(integration.id)}
                onValueChange={() => toggleIntegration(integration.id)}
                trackColor={{ false: "#E0E0E0", true: "#007AFF88" }}
                thumbColor={
                  enabledIntegrations.has(integration.id) ? "#007AFF" : "#fff"
                }
              />
            </View>
          </Animated.View>
        ))}

        <View style={styles.notice}>
          <MaterialCommunityIcons name="information" size={24} color="#666" />
          <Text style={styles.noticeText}>
            You can always manage these integrations later in settings
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingButton
          label="Continue"
          onPress={handleNext}
          style={styles.button}
        />
        <OnboardingButton
          label="Skip for now"
          variant="secondary"
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
  integrationCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  integrationContent: {
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
  integrationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  integrationDescription: {
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
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
