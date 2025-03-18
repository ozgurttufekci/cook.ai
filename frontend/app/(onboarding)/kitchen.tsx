import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

interface KitchenItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  category: "appliance" | "tool";
}

const KITCHEN_ITEMS: KitchenItem[] = [
  // Appliances
  { id: "stove", label: "Stove/Range", icon: "stove", category: "appliance" },
  { id: "oven", label: "Oven", icon: "toaster-oven", category: "appliance" },
  {
    id: "microwave",
    label: "Microwave",
    icon: "microwave",
    category: "appliance",
  },
  {
    id: "slow_cooker",
    label: "Slow Cooker",
    icon: "pot-steam",
    category: "appliance",
  },
  {
    id: "air_fryer",
    label: "Air Fryer",
    icon: "air-filter",
    category: "appliance",
  },
  { id: "blender", label: "Blender", icon: "blender", category: "appliance" },

  // Tools
  { id: "knife", label: "Chef's Knife", icon: "knife", category: "tool" },
  {
    id: "cutting_board",
    label: "Cutting Board",
    icon: "food-variant",
    category: "tool",
  },
  {
    id: "measuring_cups",
    label: "Measuring Cups",
    icon: "cup",
    category: "tool",
  },
  {
    id: "mixing_bowls",
    label: "Mixing Bowls",
    icon: "bowl-mix",
    category: "tool",
  },
  { id: "pots_pans", label: "Pots & Pans", icon: "pot", category: "tool" },
  {
    id: "baking_sheet",
    label: "Baking Sheet",
    icon: "rectangle",
    category: "tool",
  },
];

export default function KitchenScreen() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
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
    router.push("/(onboarding)/schedule");
  };

  const renderCategory = (category: "appliance" | "tool") => {
    const items = KITCHEN_ITEMS.filter((item) => item.category === category);
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>
          {category === "appliance" ? "Appliances" : "Kitchen Tools"}
        </Text>
        <View style={styles.itemsGrid}>
          {items.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeIn.delay(index * 100)}
              style={styles.itemContainer}
            >
              <View
                style={[
                  styles.item,
                  selectedItems.has(item.id) && styles.itemSelected,
                ]}
                onTouchEnd={() => toggleItem(item.id)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color={selectedItems.has(item.id) ? "#fff" : "#007AFF"}
                />
                <Text
                  style={[
                    styles.itemLabel,
                    selectedItems.has(item.id) && styles.itemLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Inventory</Text>
      <Text style={styles.subtitle}>
        Select the appliances and tools you have in your kitchen
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCategory("appliance")}
        {renderCategory("tool")}
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
  categoryContainer: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  itemContainer: {
    width: "50%",
    padding: 8,
  },
  item: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
  itemSelected: {
    backgroundColor: "#007AFF",
  },
  itemLabel: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },
  itemLabelSelected: {
    color: "#fff",
  },
  footer: {
    paddingVertical: 24,
  },
  button: {
    width: "100%",
  },
});
