import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsModal from "../components/SettingsModal"; // <-- Settings Import

export default function MainMenu({ navigation }) {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(widthAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [colorAnim, widthAnim]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: ["#00f0ff", "#ff0055", "#b500ff", "#00f0ff"],
  });

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 180],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoSection}>
        <View style={styles.titleWrapper}>
          <Text style={[styles.titleText, styles.titleGlow]}>LINIA</Text>
          <Text style={styles.titleText}>LINIA</Text>
          <Animated.View
            style={[
              styles.neonBeam,
              {
                backgroundColor: animatedColor,
                shadowColor: animatedColor,
                width: animatedWidth,
              },
            ]}
          />
          <Text style={styles.subtitleText}>NEON CIRCUITS</Text>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Gameplay")}
        >
          <Text style={styles.primaryBtnText}>START GAME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("LevelSelection")}
        >
          <Text style={styles.secondaryBtnText}>SELECT LEVEL</Text>
        </TouchableOpacity>

        {/* SETTINGS BUTTON CONNECTED HERE */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.6}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.secondaryBtnText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>

      {/* RENDER SETTINGS MODAL */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
}

// ... (Neeche wale styles exactly wahi hain jo pehle the, usme koi change nahi)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  logoSection: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  titleWrapper: { alignItems: "center", justifyContent: "center" },
  titleText: {
    fontSize: 74,
    fontWeight: "900",
    letterSpacing: 18,
    marginLeft: 18,
    textAlign: "center",
    color: "#e0ffff",
    marginBottom: 8,
  },
  titleGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "rgba(0, 240, 255, 0.3)",
    textShadowColor: "#00f0ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    zIndex: -1,
  },
  neonBeam: {
    height: 4,
    borderRadius: 2,
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 12,
  },
  subtitleText: {
    color: "rgba(0, 240, 255, 0.7)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 10,
    marginLeft: 10,
    marginTop: 5,
  },
  buttonSection: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 40,
    justifyContent: "center",
    gap: 15,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#00f0ff",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 5,
  },
  primaryBtnText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },
  secondaryBtn: {
    width: "100%",
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#27272a",
  },
  secondaryBtnText: {
    color: "#a1a1aa",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
