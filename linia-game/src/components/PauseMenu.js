import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { GameContext } from "../context/GameContext";
import PolicyModal from "./PolicyModal";

export default function PauseMenu({
  isPaused,
  setIsPaused,
  onRestart,
  onMainMenu,
}) {
  const [showPolicy, setShowPolicy] = useState(false);

  // Seedha Global GameContext se state aur setters access kiye
  const { isSoundOn, setIsSoundOn, isVibrationOn, setIsVibrationOn } =
    useContext(GameContext);

  const isPauseModalVisible = isPaused && !showPolicy;

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPauseModalVisible}
        onRequestClose={() => setIsPaused(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pauseMenuBox}>
            <Text style={styles.pauseTitle}>GAME PAUSED</Text>

            <TouchableOpacity
              onPress={() => setIsPaused(false)}
              style={styles.pauseMenuBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.pauseMenuBtnText}>RESUME</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRestart}
              style={styles.pauseMenuBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.pauseMenuBtnText}>RESTART LEVEL</Text>
            </TouchableOpacity>

            {/* Sound & Vibration Toggles */}
            <View style={styles.settingsRow}>
              <TouchableOpacity
                onPress={() => setIsSoundOn((prev) => !prev)}
                activeOpacity={0.8}
                style={[styles.toggleBtn, isSoundOn && styles.toggleBtnActive]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    isSoundOn && styles.toggleBtnTextActive,
                  ]}
                >
                  SOUND: {isSoundOn ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsVibrationOn((prev) => !prev)}
                activeOpacity={0.8}
                style={[
                  styles.toggleBtn,
                  isVibrationOn && styles.toggleBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    isVibrationOn && styles.toggleBtnTextActive,
                  ]}
                >
                  VIBRATION: {isVibrationOn ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* TERMS & PRIVACY BUTTON */}
            <TouchableOpacity
              onPress={() => setShowPolicy(true)}
              style={styles.policyRow}
              activeOpacity={0.7}
            >
              <Text style={styles.policyLabel}>TERMS & PRIVACY</Text>
              <Text style={styles.policyArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onMainMenu}
              style={[styles.pauseMenuBtn, styles.quitBtn]}
              activeOpacity={0.8}
            >
              <Text style={styles.quitBtnText}>MAIN MENU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Policy Modal */}
      {showPolicy && (
        <PolicyModal
          visible={showPolicy}
          onClose={() => setShowPolicy(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 8, 0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseMenuBox: {
    width: "85%",
    backgroundColor: "#0d0d12",
    paddingVertical: 32,
    paddingHorizontal: 25,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 240, 255, 0.2)",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
  },
  pauseTitle: {
    color: "#00f0ff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 25,
    textShadowColor: "rgba(0, 240, 255, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  pauseMenuBtn: {
    width: "100%",
    backgroundColor: "#18181b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  pauseMenuBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: "#18181b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#27272a",
  },
  toggleBtnActive: {
    borderColor: "#00f0ff",
    backgroundColor: "rgba(0, 240, 255, 0.1)",
  },
  toggleBtnText: {
    color: "#71717a",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  toggleBtnTextActive: {
    color: "#00f0ff",
  },
  policyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: "#141418",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 14,
  },
  policyLabel: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  policyArrow: {
    color: "#00f0ff",
    fontSize: 15,
    fontWeight: "900",
  },
  quitBtn: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 0, 85, 0.5)",
    borderWidth: 1.5,
    marginTop: 4,
    marginBottom: 0,
  },
  quitBtnText: {
    color: "#ff0055",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
});