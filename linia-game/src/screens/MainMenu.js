import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function MainMenu({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Linia</Text>
        <Text style={styles.subtitle}>A Hamiltonian Puzzle</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate("Gameplay")}
        >
          <Text style={styles.playText}>PLAY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: { alignItems: "center", marginBottom: 80 },
  title: {
    color: "#00e5ff",
    fontSize: 55,
    fontWeight: "bold",
    letterSpacing: 4,
  },
  subtitle: { color: "#888", fontSize: 16, letterSpacing: 2, marginTop: 10 },
  buttonContainer: { width: "100%", alignItems: "center" },
  playButton: {
    backgroundColor: "#00e5ff",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  playText: {
    color: "#121212",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
