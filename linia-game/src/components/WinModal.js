import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";

export default function WinModal({
  visible,
  currentLevel,
  stars = 3,
  onNextLevel,
  onMainMenu,
}) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Star animations
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      star1Anim.setValue(0);
      star2Anim.setValue(0);
      star3Anim.setValue(0);

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Sequential star pop animations
      const starAnimations = [];
      if (stars >= 1) {
        starAnimations.push(
          Animated.spring(star1Anim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          })
        );
      }
      if (stars >= 2) {
        starAnimations.push(
          Animated.spring(star2Anim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          })
        );
      }
      if (stars >= 3) {
        starAnimations.push(
          Animated.spring(star3Anim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          })
        );
      }

      Animated.stagger(140, starAnimations).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible, stars]);

  const starScales = [star1Anim, star2Anim, star3Anim];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onMainMenu}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{currentLevel}</Text>
          </View>

          <Text style={styles.title}>LEVEL CLEARED</Text>
          <Text style={styles.subtitle}>Circuit connected successfully.</Text>

          {/* Glowing 3-Stars Container */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map((index) => {
              const isEarned = index <= stars;
              const animVal = starScales[index - 1];

              return (
                <View key={index} style={styles.starWrapper}>
                  {/* Empty base star */}
                  <Text style={styles.emptyStar}>★</Text>
                  {/* Earned neon star overlay */}
                  {isEarned && (
                    <Animated.Text
                      style={[
                        styles.filledStar,
                        {
                          transform: [{ scale: animVal }],
                        },
                      ]}
                    >
                      ★
                    </Animated.Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.nextBtn}
            activeOpacity={0.8}
            onPress={onNextLevel}
          >
            <Text style={styles.nextBtnText}>NEXT LEVEL</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuBtn}
            activeOpacity={0.7}
            onPress={onMainMenu}
          >
            <Text style={styles.menuBtnText}>MAIN MENU</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 5, 8, 0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#0d0d12",
    borderRadius: 28,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 240, 255, 0.25)",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  levelBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#121216",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00f0ff",
    marginBottom: 16,
    shadowColor: "#00f0ff",
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  levelNumber: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 6,
  },
  subtitle: {
    color: "#71717a",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 28,
  },
  starWrapper: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStar: {
    position: "absolute",
    fontSize: 40,
    color: "#27272a",
  },
  filledStar: {
    position: "absolute",
    fontSize: 40,
    color: "#ffb703",
    textShadowColor: "#fb8500",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  nextBtn: {
    width: "100%",
    backgroundColor: "#00f0ff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#00f0ff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  nextBtnText: {
    color: "#050508",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },
  menuBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  menuBtnText: {
    color: "#71717a",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
});