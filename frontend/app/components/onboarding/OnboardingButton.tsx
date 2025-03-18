import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

interface OnboardingButtonProps {
  onPress: () => void;
  label: string;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function OnboardingButton({
  onPress,
  label,
  variant = "primary",
  style,
  labelStyle,
}: OnboardingButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        style={[styles.secondaryButton, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={[styles.secondaryLabel, labelStyle]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <BlurView intensity={90} style={styles.blur}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginVertical: 8,
  },
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF88",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginVertical: 8,
  },
  secondaryLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
});
