import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

interface TimeSlot {
  id: string;
  label: string;
  defaultValue: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: "breakfast", label: "Breakfast (6AM - 10AM)", defaultValue: true },
  { id: "lunch", label: "Lunch (11AM - 2PM)", defaultValue: true },
  { id: "dinner", label: "Dinner (5PM - 9PM)", defaultValue: true },
];

export default function ScheduleScreen() {
  const router = useRouter();
  const [mealsPerWeek, setMealsPerWeek] = useState(7);
  const [maxPrepTime, setMaxPrepTime] = useState(45);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(
    new Set(
      TIME_SLOTS.filter((slot) => slot.defaultValue).map((slot) => slot.id)
    )
  );

  const toggleTimeSlot = (id: string) => {
    setSelectedSlots((prev) => {
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
    router.push("/(onboarding)/preferences");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cooking Schedule</Text>
      <Text style={styles.subtitle}>Let's plan your cooking schedule</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.delay(100)}>
          <Text style={styles.sectionTitle}>Meals per Week</Text>
          <Text style={styles.value}>{mealsPerWeek} meals</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={21}
            step={1}
            value={mealsPerWeek}
            onValueChange={setMealsPerWeek}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#E0E0E0"
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Prep Time</Text>
          <Text style={styles.value}>{maxPrepTime} minutes</Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={120}
            step={5}
            value={maxPrepTime}
            onValueChange={setMaxPrepTime}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#E0E0E0"
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Cooking Times</Text>
          <View style={styles.timeSlots}>
            {TIME_SLOTS.map((slot) => (
              <View
                key={slot.id}
                style={[
                  styles.timeSlot,
                  selectedSlots.has(slot.id) && styles.timeSlotSelected,
                ]}
                onTouchEnd={() => toggleTimeSlot(slot.id)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedSlots.has(slot.id) && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot.label}
                </Text>
              </View>
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
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeSlots: {
    gap: 12,
  },
  timeSlot: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  timeSlotSelected: {
    backgroundColor: "#007AFF",
  },
  timeSlotText: {
    fontSize: 16,
    color: "#333",
  },
  timeSlotTextSelected: {
    color: "#fff",
  },
  footer: {
    paddingVertical: 24,
  },
  button: {
    width: "100%",
  },
});
