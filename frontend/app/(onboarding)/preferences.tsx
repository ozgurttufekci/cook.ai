import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

interface CuisineOption {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface CookingStyle {
  id: string;
  label: string;
  description: string;
}

const CUISINES: CuisineOption[] = [
  { id: "italian", label: "Italian", icon: "local-pizza" },
  { id: "asian", label: "Asian", icon: "ramen-dining" },
  { id: "mexican", label: "Mexican", icon: "restaurant" },
  { id: "mediterranean", label: "Mediterranean", icon: "local-dining" },
  { id: "american", label: "American", icon: "fastfood" },
  { id: "indian", label: "Indian", icon: "soup-kitchen" },
  { id: "french", label: "French", icon: "bakery-dining" },
  { id: "middle_eastern", label: "Middle Eastern", icon: "kebab-dining" },
];

const COOKING_STYLES: CookingStyle[] = [
  {
    id: "quick_easy",
    label: "Quick & Easy",
    description: "Simple recipes that take 30 minutes or less",
  },
  {
    id: "healthy",
    label: "Health-Focused",
    description: "Nutritious and balanced meals",
  },
  {
    id: "gourmet",
    label: "Gourmet",
    description: "Restaurant-quality dishes for special occasions",
  },
  {
    id: "meal_prep",
    label: "Meal Prep",
    description: "Make-ahead meals for busy weeks",
  },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(
    new Set()
  );
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(
    new Set(["quick_easy"])
  );

  const toggleCuisine = (id: string) => {
    setSelectedCuisines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) => {
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
    // Here you would typically save the preferences
    router.push("/(onboarding)/integrations");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cooking Preferences</Text>
      <Text style={styles.subtitle}>
        Select your favorite cuisines and cooking styles
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.delay(100)}>
          <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
          <View style={styles.cuisineGrid}>
            {CUISINES.map((cuisine, index) => (
              <Animated.View
                key={cuisine.id}
                entering={FadeIn.delay(index * 50)}
                style={styles.cuisineItem}
              >
                <View
                  style={[
                    styles.cuisine,
                    selectedCuisines.has(cuisine.id) && styles.cuisineSelected,
                  ]}
                  onTouchEnd={() => toggleCuisine(cuisine.id)}
                >
                  <MaterialIcons
                    name={cuisine.icon}
                    size={32}
                    color={
                      selectedCuisines.has(cuisine.id) ? "#fff" : "#007AFF"
                    }
                  />
                  <Text
                    style={[
                      styles.cuisineLabel,
                      selectedCuisines.has(cuisine.id) &&
                        styles.cuisineLabelSelected,
                    ]}
                  >
                    {cuisine.label}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Cooking Style</Text>
          <View style={styles.styleList}>
            {COOKING_STYLES.map((style, index) => (
              <Animated.View
                key={style.id}
                entering={FadeIn.delay(index * 100)}
              >
                <View
                  style={[
                    styles.style,
                    selectedStyles.has(style.id) && styles.styleSelected,
                  ]}
                  onTouchEnd={() => toggleStyle(style.id)}
                >
                  <View>
                    <Text
                      style={[
                        styles.styleLabel,
                        selectedStyles.has(style.id) &&
                          styles.styleLabelSelected,
                      ]}
                    >
                      {style.label}
                    </Text>
                    <Text
                      style={[
                        styles.styleDescription,
                        selectedStyles.has(style.id) &&
                          styles.styleDescriptionSelected,
                      ]}
                    >
                      {style.description}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
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
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  cuisineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  cuisineItem: {
    width: "25%",
    padding: 8,
  },
  cuisine: {
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cuisineSelected: {
    backgroundColor: "#007AFF",
  },
  cuisineLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },
  cuisineLabelSelected: {
    color: "#fff",
  },
  styleList: {
    gap: 12,
  },
  style: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  styleSelected: {
    backgroundColor: "#007AFF",
  },
  styleLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  styleLabelSelected: {
    color: "#fff",
  },
  styleDescription: {
    fontSize: 14,
    color: "#666",
  },
  styleDescriptionSelected: {
    color: "#fff",
  },
  footer: {
    paddingVertical: 24,
  },
  button: {
    width: "100%",
  },
});
