import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(onboarding)/dietary");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={styles.header}
      >
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Cook.ai</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered cooking assistant
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).springify()}
        style={styles.features}
      >
        <Text style={styles.featuresTitle}>Get ready to:</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Discover personalized recipes</Text>
          <Text style={styles.feature}>• Plan meals effortlessly</Text>
          <Text style={styles.feature}>• Learn new cooking techniques</Text>
          <Text style={styles.feature}>• Track your culinary journey</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(600).springify()}
        style={styles.footer}
      >
        <OnboardingButton
          label="Get Started"
          onPress={handleGetStarted}
          style={styles.button}
        />
        <OnboardingButton
          label="I already have an account"
          variant="secondary"
          onPress={() => router.push("/login")}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    maxWidth: "80%",
  },
  features: {
    paddingVertical: 32,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  featureList: {
    gap: 12,
  },
  feature: {
    fontSize: 18,
    color: "#333",
  },
  footer: {
    paddingBottom: 48,
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
