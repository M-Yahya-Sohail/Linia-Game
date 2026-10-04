import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated, Easing } from "react-native";

export default function WinModal({ visible, currentLevel, onNextLevel, onMainMenu }) {
  // Animations ke liye values
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Jab modal open ho toh dono animations ek sath chalao
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)), // Halka sa bounce effect
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Modal close hone par values reset karo
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none" // Hum custom animation use kar rahe hain
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalCard, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
          
          {/* Minimalist Glowing Level Ring */}
          <View style={styles.ringContainer}>
            <View style={styles.glowRing} />
            <Text style={styles.ringText}>{currentLevel}</Text>
          </View>

          <Text style={styles.titleText}>LEVEL CLEARED</Text>
          
          {/* Elegant Divider */}
          <View style={styles.divider} />
          
          <Text style={styles.subtitleText}>Circuit connected successfully.</Text>
          
          {/* Sleek Buttons */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={onNextLevel} style={styles.primaryBtn} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>NEXT LEVEL</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onMainMenu} style={styles.secondaryBtn} activeOpacity={0.6}>
              <Text style={styles.secondaryBtnText}>MAIN MENU</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Pitch dark overlay to put complete focus on the modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 8, 0.95)", 
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Sleek, borderless dark card
  modalCard: {
    width: "85%",
    backgroundColor: "#0d0d12",
    paddingVertical: 45,
    paddingHorizontal: 30,
    borderRadius: 35,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 240, 255, 0.15)", // Very subtle border
    shadowColor: "#00f0ff",
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },

  // Premium Geometric Level Ring
  ringContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  glowRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#00f0ff",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  ringText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // Elegant Typography
  titleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 6,
    marginBottom: 15,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#00f0ff",
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#00f0ff",
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  subtitleText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1.5,
    marginBottom: 40,
    textAlign: "center",
  },

  // Refined Minimalist Buttons
  buttonWrapper: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 18,
    backgroundColor: "#00f0ff",
    borderRadius: 16, // Modern slightly rounded corners instead of full pills
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 18,
    backgroundColor: "transparent",
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
});