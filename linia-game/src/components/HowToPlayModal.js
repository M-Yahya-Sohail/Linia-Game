import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SLIDES = [
  {
    title: "Start from the Glow",
    description:
      "Begin at the highlighted starting node. Drag your finger to build one continuous path.",
    image: require("../../assets/images/htp1.png"),
  },
  {
    title: "Connect Neighbors Only",
    description:
      "Move up, down, left or right to an adjacent node. Diagonal moves and blocked nodes are not allowed.",
    image: require("../../assets/images/htp2.png"),
  },
  {
    title: "Complete the Path",
    description:
      "Visit every open node exactly once. Don't cross or repeat your path. Use Undo or Reset if needed.",
    image: require("../../assets/images/htp3.png"),
  },
];

export default function HowToPlayModal({ visible, onClose }) {
  const [page, setPage] = useState(0);
  const { width, height } = useWindowDimensions();
  const imageSize = Math.min(width - 44, height * 0.44, 390);
  const currentSlide = SLIDES[page];
  const isLastSlide = page === SLIDES.length - 1;

  useEffect(() => {
    if (visible) setPage(0);
  }, [visible]);

  const goNext = () => {
    if (isLastSlide) {
      onClose?.();
    } else {
      setPage((previous) => previous + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View pointerEvents="none" style={styles.ambientTop} />
        <View pointerEvents="none" style={styles.ambientBottom} />

        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>L I N I A</Text>
            <Text style={styles.eyebrow}>HOW TO PLAY</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close tutorial"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.stepLabel}>STEP {page + 1} OF {SLIDES.length}</Text>
          <Image
            source={currentSlide.image}
            style={{ width: imageSize, height: imageSize, borderRadius: 22 }}
            resizeMode="contain"
            accessibilityLabel={`Tutorial illustration ${page + 1}`}
          />
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, page === index && styles.activeDot]}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={page === 0}
              onPress={() => setPage((previous) => Math.max(0, previous - 1))}
              style={({ pressed }) => [
                styles.secondaryButton,
                page === 0 && styles.disabledButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryText}>PREVIOUS</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={goNext}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryText}>
                {isLastSlide ? "LET'S PLAY" : "NEXT"}
              </Text>
            </Pressable>
          </View>

          {!isLastSlide && (
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip tutorial</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080914",
  },
  ambientTop: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0, 224, 255, 0.045)",
    top: -125,
    left: -125,
  },
  ambientBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(235, 34, 219, 0.05)",
    bottom: -160,
    right: -160,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 10,
  },
  brand: {
    color: "#F5F5FF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
  },
  eyebrow: {
    color: "#52E8FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.5,
    marginTop: 5,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#33344A",
    backgroundColor: "#171725",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#DDE0F1",
    fontSize: 26,
    lineHeight: 30,
  },
  scrollArea: { flex: 1 },
  body: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  stepLabel: {
    color: "#64DDF1",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 10,
  },
  title: {
    color: "#F5F6FF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 9,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  description: {
    color: "#B5B6CA",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 380,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 60,
    gap: 14,
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#37384E" },
  activeDot: { width: 28, backgroundColor: "#23E5F5" },
  actions: { flexDirection: "row", gap: 12 },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    backgroundColor: "#181827",
    borderColor: "#37364B",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    flex: 1.35,
    minHeight: 52,
    backgroundColor: "#24E5F5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#24E5F5",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  secondaryText: {
    color: "#F0EEFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  primaryText: {
    color: "#080914",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  disabledButton: { opacity: 0.36 },
  pressed: { opacity: 0.75 },
  skipButton: { alignSelf: "center", paddingVertical: 6, paddingHorizontal: 18 },
  skipText: { fontSize: 14, color: "#8E8FA8", textDecorationLine: "underline", },
});
