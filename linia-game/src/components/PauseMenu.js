import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';

export default function PauseMenu({ 
  isPaused, 
  setIsPaused, 
  isSoundOn, 
  setIsSoundOn, 
  isVibrationOn, 
  setIsVibrationOn, 
  onRestart, 
  onMainMenu 
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isPaused}
      onRequestClose={() => setIsPaused(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pauseMenuBox}>
          <Text style={styles.pauseTitle}>GAME PAUSED</Text>
          
          <TouchableOpacity onPress={() => setIsPaused(false)} style={styles.pauseMenuBtn}>
            <Text style={styles.pauseMenuBtnText}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRestart} style={styles.pauseMenuBtn}>
            <Text style={styles.pauseMenuBtnText}>RESTART LEVEL</Text>
          </TouchableOpacity>

          {/* Sound & Vibration Toggles */}
          <View style={styles.settingsRow}>
            <TouchableOpacity 
              onPress={() => setIsSoundOn(!isSoundOn)} 
              style={[styles.toggleBtn, isSoundOn && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, isSoundOn && styles.toggleBtnTextActive]}>
                SOUND: {isSoundOn ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsVibrationOn(!isVibrationOn)} 
              style={[styles.toggleBtn, isVibrationOn && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, isVibrationOn && styles.toggleBtnTextActive]}>
                VIBRATION: {isVibrationOn ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => Alert.alert("TERMS & POLICY", "Terms and Policy content goes here.")} style={styles.textLinkBtn}>
            <Text style={styles.textLinkBtnText}>TERMS & POLICY</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onMainMenu} style={[styles.pauseMenuBtn, styles.quitBtn]}>
            <Text style={styles.quitBtnText}>MAIN MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.85)", justifyContent: "center", alignItems: "center" },
  pauseMenuBox: { width: "85%", backgroundColor: "#1a1a1a", padding: 30, borderRadius: 20, alignItems: "center", borderWidth: 2, borderColor: "#333" },
  pauseTitle: { color: "#00e5ff", fontSize: 28, fontWeight: "900", letterSpacing: 3, marginBottom: 30 },
  pauseMenuBtn: { width: "100%", backgroundColor: "#333", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginBottom: 15 },
  pauseMenuBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold", letterSpacing: 2 },
  settingsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 15, gap: 10 },
  toggleBtn: { flex: 1, backgroundColor: "#222", paddingVertical: 15, borderRadius: 12, alignItems: "center", borderWidth: 2, borderColor: "#333" },
  toggleBtnActive: { borderColor: "#00e5ff", backgroundColor: "rgba(0, 229, 255, 0.1)" },
  toggleBtnText: { color: "#666", fontSize: 12, fontWeight: "bold", letterSpacing: 1 },
  toggleBtnTextActive: { color: "#00e5ff" },
  textLinkBtn: { marginVertical: 15 },
  textLinkBtnText: { color: "#888", fontSize: 12, fontWeight: "bold", letterSpacing: 1, textDecorationLine: "underline" },
  quitBtn: { backgroundColor: "transparent", borderColor: "#ff3366", borderWidth: 2, marginTop: 10 },
  quitBtnText: { color: "#ff3366", fontSize: 16, fontWeight: "bold", letterSpacing: 2 }
});