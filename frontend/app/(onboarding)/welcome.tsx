import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dietary");
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
        />
        <Text style={styles.title}>Welcome to Cook.ai</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered cooking assistant
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).springify()}
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
  },
  logo: {
    width: 120,
    height: 120,
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
  footer: {
    paddingBottom: 48,
  },
  button: {
    width: "100%",
  },
});
