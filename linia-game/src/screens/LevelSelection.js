// ==========================================
// 1. IMPORTS & CONTEXT
// ==========================================
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameContext } from "../context/GameContext";

export default function LevelSelection({ navigation }) {
  const {
    highestUnlockedLevel,
    currentPlayingLevel,
    setCurrentPlayingLevel,
    isLoaded,
  } = useContext(GameContext);

  // ==========================================
  // 2. CONFIGURATION & STATE
  // ==========================================
  const levelsPerPage = 25;
  const initialPage = Math.floor(
    (currentPlayingLevel > 0 ? currentPlayingLevel - 1 : 0) / levelsPerPage,
  );
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const maxUnlockedPage = Math.floor(
    (highestUnlockedLevel > 0 ? highestUnlockedLevel - 1 : 0) / levelsPerPage,
  );

  const startLevel = currentPage * levelsPerPage + 1;
  const levels = Array.from(
    { length: levelsPerPage },
    (_, i) => startLevel + i,
  );

  // ==========================================
  // 3. HANDLERS
  // ==========================================
  const handleNextPage = () => {
    if (currentPage < maxUnlockedPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleLevelPress = (level) => {
    if (level <= highestUnlockedLevel) {
      setCurrentPlayingLevel(level);
      navigation.navigate("Gameplay");
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* STUDIO HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.iconBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>SELECT LEVEL</Text>
        <View style={{ width: 45 }} />
      </View>

      {/* MATRIX GRID WRAPPER */}
      <View style={styles.gridWrapper}>
        <View style={styles.grid}>
          {levels.map((level) => {
            const isUnlocked = level <= highestUnlockedLevel;
            const isCurrent = level === currentPlayingLevel;
            const isLocked = level > highestUnlockedLevel;

            return (
              <TouchableOpacity
                key={level}
                activeOpacity={isLocked ? 1 : 0.6}
                onPress={() => handleLevelPress(level)}
                style={[
                  styles.levelBox,
                  isUnlocked && styles.boxUnlocked,
                  isCurrent && styles.boxCurrent,
                  isLocked && styles.boxLocked,
                ]}
              >
                {isLocked ? (
                  <View style={styles.lockContainer}>
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody} />
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.levelNumber,
                      isCurrent && styles.textCurrent,
                    ]}
                  >
                    {level}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* STUDIO PAGINATION */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageBtn, currentPage === 0 && styles.pageBtnDisabled]}
          onPress={handlePrevPage}
          disabled={currentPage === 0}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pageBtnText,
              currentPage === 0 && styles.pageTextDisabled,
            ]}
          >
            PREV
          </Text>
        </TouchableOpacity>

        <View style={styles.pageIndicatorBox}>
          <Text style={styles.pageIndicator}>PAGE</Text>
          <Text style={styles.pageIndicatorNumber}>{currentPage + 1}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.pageBtn,
            currentPage >= maxUnlockedPage && styles.pageBtnDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPage >= maxUnlockedPage}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pageBtnText,
              currentPage >= maxUnlockedPage && styles.pageTextDisabled,
            ]}
          >
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// ULTRA-PREMIUM NEON STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090b", alignItems: "center" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#09090b",
    justifyContent: "center",
    alignItems: "center",
  },

  // Header
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  iconBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#18181b",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  iconBtnText: { color: "#a1a1aa", fontSize: 18, fontWeight: "bold" },
  titleText: {
    color: "#00f0ff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 240, 255, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // Grid Sizing
  gridWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 350,
    justifyContent: "center",
    gap: 14,
  },

  // Premium Cyberpunk Grid Nodes
  levelBox: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
  },

  boxUnlocked: { backgroundColor: "#121214", borderColor: "#27272a" },
  boxCurrent: {
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    borderColor: "#00f0ff",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
  },
  boxLocked: { backgroundColor: "#0c0c0e", borderColor: "#18181b" },

  levelNumber: {
    color: "#71717a",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  textCurrent: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    textShadowColor: "#00f0ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // Geometric Vector Padlock
  lockContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.25,
  },
  lockShackle: {
    width: 12,
    height: 10,
    borderWidth: 1.5,
    borderColor: "#a1a1aa",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomWidth: 0,
    position: "absolute",
    top: 1,
  },
  lockBody: {
    width: 15,
    height: 11,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#a1a1aa",
    borderRadius: 3,
    position: "absolute",
    bottom: 1,
  },

  // Refined Pagination
  pagination: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  pageBtn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#121214",
  },
  pageBtnDisabled: {
    borderColor: "#141416",
    backgroundColor: "transparent",
    opacity: 0.3,
  },
  pageBtnText: {
    color: "#ffffff",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },
  pageTextDisabled: { color: "#52525b" },

  pageIndicatorBox: { alignItems: "center" },
  pageIndicator: {
    color: "#52525b",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 2,
  },
  pageIndicatorNumber: {
    color: "#00f0ff",
    fontSize: 20,
    fontWeight: "900",
    textShadowColor: "rgba(0, 240, 255, 0.4)",
    textShadowRadius: 5,
  },
});