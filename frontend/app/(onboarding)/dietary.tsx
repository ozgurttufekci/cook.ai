import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

interface DietaryOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const DIETARY_OPTIONS: DietaryOption[] = [
  { id: "vegetarian", label: "Vegetarian", icon: "leaf" },
  { id: "vegan", label: "Vegan", icon: "nutrition" },
  { id: "pescatarian", label: "Pescatarian", icon: "fish" },
  { id: "keto", label: "Keto", icon: "fitness" },
  { id: "paleo", label: "Paleo", icon: "restaurant" },
  { id: "gluten_free", label: "Gluten Free", icon: "warning" },
  { id: "dairy_free", label: "Dairy Free", icon: "water" },
  { id: "none", label: "No Restrictions", icon: "checkmark-circle" },
];

export default function DietaryScreen() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set()
  );

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => {
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
    // Here you would typically save the selections
    router.push("/kitchen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dietary Preferences</Text>
      <Text style={styles.subtitle}>
        Select any dietary restrictions or preferences you have
      </Text>

      <ScrollView
        style={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {DIETARY_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.id}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            <TouchableOpacity
              style={[
                styles.option,
                selectedOptions.has(option.id) && styles.optionSelected,
              ]}
              onPress={() => toggleOption(option.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={selectedOptions.has(option.id) ? "#fff" : "#007AFF"}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedOptions.has(option.id) && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedOptions.has(option.id) && (
                <Ionicons name="checkmark" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
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
  optionsContainer: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 12,
    flex: 1,
    color: "#333",
  },
  optionTextSelected: {
    color: "#fff",
  },
  footer: {
    paddingVertical: 24,
  },
  button: {
    width: "100%",
  },
});
