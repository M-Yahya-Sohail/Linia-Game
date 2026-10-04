import React, { useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { GameContext } from "../context/GameContext"; // Context Import Kiya

// Custom Cyberpunk Toggle Switch
const NeonToggle = ({ label, value, onToggle }) => {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={[styles.toggleTrack, value && styles.toggleTrackActive]}
      >
        <View
          style={[
            styles.toggleKnob,
            value ? styles.toggleKnobActive : styles.toggleKnobInactive,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function SettingsModal({ visible, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // GLOBAL STATE USE KI (Ab Main Menu aur Gameplay dono perfectly sync rahenge)
  const { isSoundOn, setIsSoundOn, isVibrationOn, setIsVibrationOn } =
    useContext(GameContext);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalCard,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.titleText}>SYSTEM SETTINGS</Text>
          <View style={styles.divider} />

          <View style={styles.settingsContainer}>
            <NeonToggle
              label="SOUND EFFECTS"
              value={isSoundOn}
              onToggle={() => setIsSoundOn(!isSoundOn)}
            />
            <NeonToggle
              label="HAPTIC FEEDBACK"
              value={isVibrationOn}
              onToggle={() => setIsVibrationOn(!isVibrationOn)}
            />
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.closeBtnText}>SAVE & CLOSE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ==========================================
// STYLESHEET (No Changes Here)
// ==========================================
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 8, 0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#0d0d12",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 240, 255, 0.15)",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.12,
    shadowRadius: 35,
    elevation: 20,
  },
  titleText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 15,
    textShadowColor: "rgba(0, 240, 255, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#00f0ff",
    borderRadius: 5,
    marginBottom: 35,
    shadowColor: "#00f0ff",
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  settingsContainer: { width: "100%", gap: 25, marginBottom: 40 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  toggleLabel: {
    color: "#a1a1aa",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
  toggleTrack: {
    width: 55,
    height: 28,
    backgroundColor: "#18181b",
    borderRadius: 20,
    padding: 4,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  toggleTrackActive: {
    backgroundColor: "rgba(0, 240, 255, 0.12)",
    borderColor: "#00f0ff",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  toggleKnob: { width: 20, height: 20, borderRadius: 10 },
  toggleKnobInactive: { backgroundColor: "#52525b", alignSelf: "flex-start" },
  toggleKnobActive: {
    backgroundColor: "#00f0ff",
    alignSelf: "flex-end",
    shadowColor: "#fff",
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  closeBtn: {
    width: "100%",
    paddingVertical: 18,
    backgroundColor: "#00f0ff",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  closeBtnText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
