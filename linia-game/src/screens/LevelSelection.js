import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { GameContext } from "../context/GameContext";

export default function LevelSelection({ navigation }) {
  const {
    highestUnlockedLevel,
    currentPlayingLevel,
    setCurrentPlayingLevel,
    levelStars = {},
    isLoaded,
  } = useContext(GameContext);

  const { width } = useWindowDimensions();

  const GRID_COLUMNS = 5;
  const GRID_GAP = 10;

  const gridWidth = Math.max(0, Math.min(width - 32, 350));

  const cellSize = Math.max(
    0,
    (gridWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS,
  );

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

        <Text
          style={styles.titleText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          SELECT LEVEL
        </Text>

        <View style={{ width: 45 }} />
      </View>

      {/* RESPONSIVE LEVEL GRID */}
      <ScrollView
        style={styles.gridScroll}
        contentContainerStyle={styles.gridWrapper}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.grid,
            {
              width: gridWidth,
              columnGap: GRID_GAP,
              rowGap: GRID_GAP,
            },
          ]}
        >
          {levels.map((level) => {
            const isUnlocked = level <= highestUnlockedLevel;

            const isCurrent = level === currentPlayingLevel;

            const isLocked = level > highestUnlockedLevel;

            const earnedStars = levelStars[level] || 0;

            return (
              <TouchableOpacity
                key={level}
                disabled={isLocked}
                activeOpacity={0.6}
                onPress={() => handleLevelPress(level)}
                style={[
                  styles.levelBox,
                  {
                    width: cellSize,
                    height: cellSize,
                  },
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
                  <>
                    <Text
                      style={[
                        styles.levelNumber,
                        isCurrent && styles.textCurrent,
                      ]}
                    >
                      {level}
                    </Text>

                    {/* MINI 3-STAR RATING */}
                    <View style={styles.miniStarsRow}>
                      {[1, 2, 3].map((s) => (
                        <Text
                          key={s}
                          style={[
                            styles.miniStar,
                            s <= earnedStars && styles.miniStarActive,
                          ]}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
    alignItems: "center",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#09090b",
    justifyContent: "center",
    alignItems: "center",
  },

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

  iconBtnText: {
    color: "#a1a1aa",
    fontSize: 18,
    fontWeight: "bold",
  },

  titleText: {
    color: "#00f0ff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 240, 255, 0.4)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 10,
    flexShrink: 1,
    textAlign: "center",
  },

  // Grid
  gridScroll: {
    flex: 1,
    width: "100%",
  },

  gridWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  levelBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 4,
  },

  boxUnlocked: {
    backgroundColor: "#121214",
    borderColor: "#27272a",
  },

  boxCurrent: {
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    borderColor: "#00f0ff",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
  },

  boxLocked: {
    backgroundColor: "#0c0c0e",
    borderColor: "#18181b",
  },

  levelNumber: {
    color: "#a1a1aa",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  textCurrent: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    textShadowColor: "#00f0ff",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 8,
  },

  miniStarsRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },

  miniStar: {
    fontSize: 9,
    color: "#27272a",
  },

  miniStarActive: {
    color: "#ffb703",
    textShadowColor: "rgba(251, 133, 0, 0.8)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 4,
  },

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

  pagination: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 8,
  },

  pageBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#121214",
    alignItems: "center",
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

  pageTextDisabled: {
    color: "#52525b",
  },

  pageIndicatorBox: {
    alignItems: "center",
  },

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
