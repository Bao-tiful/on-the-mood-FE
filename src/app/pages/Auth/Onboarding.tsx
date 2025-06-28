import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import SignInButton, { SignInType } from "@/src/components/login/SignInButton";
import { router } from "expo-router";
import Logo from "@/src/components/Logo";
import { LinearGradient } from "expo-linear-gradient";
import OnboardingCard from "@/src/components/auth/OnboardingCard";

const OnboardingPage = () => {
  return (
    <View style={styles.container}>
      <OnboardingCard index={0} />
      <TouchableOpacity style={styles.bottomSheetButton} onPress={() => {}}>
        <Text style={styles.bottomSheetButtonLabel}>보러가기</Text>
      </TouchableOpacity>
    </View>
    // </SafeAreaView>
  );
};

export default OnboardingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
    gap: 32,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: Colors.white100,
  },
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  signInButtonContainer: {
    width: "100%",
    gap: 16,
  },
  catchphrase: {
    ...typography.headline,
    color: Colors.black40,
    lineHeight: 26,
  },
  catchphraseEmphasis: {
    fontWeight: "bold",
    color: Colors.black70,
  },
  bottomSheetButton: {
    backgroundColor: Colors.black100,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 28,
    marginHorizontal: 16,
  },
  bottomSheetButtonLabel: {
    ...typography.body,
    fontWeight: 600,
    color: Colors.white100,
  },
});
