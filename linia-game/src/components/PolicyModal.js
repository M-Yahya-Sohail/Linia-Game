import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PolicyModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>TERMS & PRIVACY</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIconBtn}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Policy Content */}
          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.sectionHeading}>PRIVACY POLICY</Text>
            <Text style={styles.paragraph}>
              Welcome to <Text style={styles.highlight}>Linia Game</Text>. We
              respect your privacy and are committed to protecting it.
            </Text>

            <Text style={styles.subHeading}>1. Information We Collect</Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.boldText}>No Personal Data:</Text> We do not
              collect, transmit, or sell your name, email, location, or personal
              details.
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.boldText}>Local Storage:</Text> All level
              progress, unlocked stages, and audio/haptic preferences are saved
              strictly on your local device storage.
            </Text>

            <Text style={styles.subHeading}>2. Device Permissions</Text>
            <Text style={styles.paragraph}>
              • Sound & Haptic engines are used solely for in-game interactive
              feedback. We do not access your camera, microphone, or photo
              library.
            </Text>

            <Text style={styles.subHeading}>3. Offline Gameplay</Text>
            <Text style={styles.paragraph}>
              This application functions entirely offline. No background
              telemetry or ad tracking libraries are integrated.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.sectionHeading}>TERMS OF SERVICE</Text>
            <Text style={styles.subHeading}>1. Acceptance</Text>
            <Text style={styles.paragraph}>
              By accessing or playing Linia Game, you agree to these terms. This
              game is provided for personal, non-commercial entertainment.
            </Text>

            <Text style={styles.subHeading}>2. Intellectual Property</Text>
            <Text style={styles.paragraph}>
              All artwork, animations, sounds, and puzzle algorithms are the
              intellectual property of the developer. Reverse engineering or
              redistribution is strictly prohibited.
            </Text>

            <Text style={styles.subHeading}>3. Disclaimer</Text>
            <Text style={styles.paragraph}>
              The application is provided "AS IS" without warranties of any
              kind.
            </Text>

            <View style={{ height: 25 }} />
          </ScrollView>

          {/* Bottom Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.actionBtnText}>I UNDERSTAND</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 8, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "82%",
    backgroundColor: "#121215",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#27272a",
    padding: 22,
    shadowColor: "#00f0ff",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    paddingBottom: 14,
    marginBottom: 10,
  },
  headerTitle: {
    color: "#00f0ff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  closeIconText: {
    color: "#a1a1aa",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollArea: {
    marginVertical: 10,
  },
  sectionHeading: {
    color: "#00f0ff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 10,
    marginBottom: 8,
  },
  subHeading: {
    color: "#e0ffff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    color: "#a1a1aa",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  highlight: {
    color: "#00f0ff",
    fontWeight: "700",
  },
  boldText: {
    color: "#e4e4e7",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#27272a",
    marginVertical: 16,
  },
  actionBtn: {
    backgroundColor: "#00f0ff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#00f0ff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    color: "#09090b",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
