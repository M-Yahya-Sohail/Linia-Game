
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Platform,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameContext } from "../context/GameContext";
import { generateLevel } from "../utils/LevelGenerator";
import PauseMenu from "../components/PauseMenu";
import WinModal from "../components/WinModal";
import HowToPlayModal from "../components/HowToPlayModal";

export default function Gameplay({ navigation }) {
  const {
    highestUnlockedLevel,
    setHighestUnlockedLevel,
    currentPlayingLevel,
    setCurrentPlayingLevel,
    isSoundOn,
    isVibrationOn,
    playClickSound,
    playWinSound,
    saveLevelScore,
  } = useContext(GameContext);

  const [levelData, setLevelData] = useState([]);
  const [path, setPath] = useState([]);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // === STAR RATING & UNDO TRACKING ===
  const [undoCount, setUndoCount] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);
  const undoCountRef = useRef(0);

  const levelDataRef = useRef([]);
  const cellSizeRef = useRef(80);
  const pathRef = useRef([]);
  const isWinningRef = useRef(false);
  const totalValidNodesRef = useRef(0);

  // PanResponder state refs
  const isPausedRef = useRef(false);
  const showWinModalRef = useRef(false);
  const showHowToPlayRef = useRef(false);

  // NEW: Track which visited node was tapped
  const rewindCandidateRef = useRef(null);

  // NEW: Keep the latest handlers available to PanResponder
  const touchHandlersRef = useRef({});

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    showWinModalRef.current = showWinModal;
  }, [showWinModal]);

  useEffect(() => {
    showHowToPlayRef.current = showHowToPlay;
  }, [showHowToPlay]);

  // === LIVE REFS ===
  const isSoundOnRef = useRef(isSoundOn);
  const isVibrationOnRef = useRef(isVibrationOn);

  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
  }, [isSoundOn]);

  useEffect(() => {
    isVibrationOnRef.current = isVibrationOn;
  }, [isVibrationOn]);

  // Level Setup & State Reset
  useEffect(() => {
    const newGrid = generateLevel(currentPlayingLevel);
    setLevelData(newGrid);
    levelDataRef.current = newGrid;

    totalValidNodesRef.current = newGrid
      .flat()
      .filter((cell) => cell !== 1).length;

    setPath([]);
    pathRef.current = [];
    isWinningRef.current = false;

    setIsLevelCleared(false);
    setShowWinModal(false);

    setUndoCount(0);
    undoCountRef.current = 0;
    setEarnedStars(3);

    rewindCandidateRef.current = null;
  }, [currentPlayingLevel]);

  const screenWidth = Dimensions.get("window").width;
  const columns = levelData.length > 0 ? levelData[0].length : 3;

  const currentCellSize = Math.min(
    85,
    Math.floor((screenWidth - 40) / columns)
  );

  cellSizeRef.current = currentCellSize;

  const NODE_SIZE = currentCellSize * 0.45;
  const LINE_THICKNESS = 14;

  // =====================================
  // NEW: CORRECT GRID TOUCH COORDINATES
  // =====================================

  const getGridPosition = (x, y) => {
    const currentGrid = levelDataRef.current;
    const size = cellSizeRef.current;

    if (currentGrid.length === 0) return null;

    // gridContainer has 20px padding on all sides.
    const gridX = x - 20;
    const gridY = y - 20;

    const col = Math.floor(gridX / size);
    const row = Math.floor(gridY / size);

    if (
      row < 0 ||
      row >= currentGrid.length ||
      col < 0 ||
      col >= currentGrid[0].length
    ) {
      return null;
    }

    return { row, col, gridX, gridY };
  };

  // =====================================
  // NEW: CHECK IF A VISITED NODE WAS TAPPED
  // =====================================

  const findRewindTarget = (x, y) => {
    const currentPath = pathRef.current;

    if (currentPath.length < 2) return null;

    const position = getGridPosition(x, y);

    if (!position) return null;

    const { row, col, gridX, gridY } = position;

    const nodeID = `${row}-${col}`;
    const nodeIndex = currentPath.indexOf(nodeID);

    // Only previous visited nodes can rewind.
    // Current final node cannot rewind to itself.
    if (
      nodeIndex === -1 ||
      nodeIndex === currentPath.length - 1
    ) {
      return null;
    }

    const size = cellSizeRef.current;

    const centerX = (col + 0.5) * size;
    const centerY = (row + 0.5) * size;

    const distance = Math.hypot(
      gridX - centerX,
      gridY - centerY
    );

    // Allow a comfortable hit area around the node.
    if (distance > size * 0.32) {
      return null;
    }

    return nodeIndex;
  };

  // =====================================
  // NEW: REWIND PATH TO THE TAPPED NODE
  // =====================================

  const handleTapRewind = (nodeIndex) => {
    if (
      isWinningRef.current ||
      isPausedRef.current ||
      showWinModalRef.current ||
      showHowToPlayRef.current
    ) {
      return;
    }

    const currentPath = pathRef.current;

    if (
      nodeIndex === null ||
      nodeIndex < 0 ||
      nodeIndex >= currentPath.length - 1
    ) {
      return;
    }

    // Keep the tapped node and all nodes before it.
    const newPath = currentPath.slice(0, nodeIndex + 1);

    pathRef.current = newPath;
    setPath(newPath);

    // One rewind action counts as one Undo.
    undoCountRef.current += 1;
    setUndoCount(undoCountRef.current);

    if (isSoundOnRef.current && playClickSound) {
      playClickSound();
    }

    if (
      isVibrationOnRef.current &&
      Platform.OS !== "web"
    ) {
      Vibration.vibrate(20);
    }
  };

  // =====================================
  // ORIGINAL GAME TOUCH FUNCTION
  // =====================================

  const handleTouch = (x, y) => {
    if (
      isWinningRef.current ||
      isPausedRef.current ||
      showWinModalRef.current ||
      showHowToPlayRef.current
    ) {
      return;
    }

    const currentGrid = levelDataRef.current;
    const currentPath = pathRef.current;

    const position = getGridPosition(x, y);

    if (!position) return;

    const { row, col } = position;

    const cellValue = currentGrid[row][col];
    const nodeID = `${row}-${col}`;

    if (cellValue === 1) return;
    if (currentPath.includes(nodeID)) return;

    if (currentPath.length === 0) {
      if (cellValue !== 2) return;
    } else {
      const lastNode = currentPath[currentPath.length - 1];

      const [lastRow, lastCol] = lastNode
        .split("-")
        .map(Number);

      const isAdjacent =
        Math.abs(lastRow - row) +
          Math.abs(lastCol - col) ===
        1;

      if (!isAdjacent) return;
    }

    const newPath = [...currentPath, nodeID];

    pathRef.current = newPath;
    setPath([...newPath]);

    const isLastNode =
      newPath.length === totalValidNodesRef.current;

    if (isLastNode && !isWinningRef.current) {
      isWinningRef.current = true;
      setIsLevelCleared(true);

      let stars = 3;

      if (undoCountRef.current > 2) {
        stars = 1;
      } else if (undoCountRef.current > 0) {
        stars = 2;
      }

      setEarnedStars(stars);

      if (saveLevelScore) {
        saveLevelScore(currentPlayingLevel, stars);
      }

      if (isSoundOnRef.current && playWinSound) {
        playWinSound();
      }

      if (
        isVibrationOnRef.current &&
        Platform.OS !== "web"
      ) {
        Vibration.vibrate([0, 100, 50, 100]);
      }
    } else if (!isWinningRef.current) {
      if (isSoundOnRef.current && playClickSound) {
        playClickSound();
      }

      if (
        isVibrationOnRef.current &&
        Platform.OS !== "web"
      ) {
        Vibration.vibrate(35);
      }
    }
  };

  // Always provide PanResponder with current handlers.
  touchHandlersRef.current = {
    handleTouch,
    findRewindTarget,
    handleTapRewind,
  };

  // =====================================
  // FIXED PAN RESPONDER
  // =====================================

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;

        // Check whether touch started on a visited node.
        const targetIndex =
          touchHandlersRef.current.findRewindTarget(
            locationX,
            locationY
          );

        rewindCandidateRef.current = targetIndex;

        // If it is a visited node, wait for finger release.
        if (targetIndex !== null) {
          return;
        }

        // Otherwise, continue normal path drawing.
        touchHandlersRef.current.handleTouch(
          locationX,
          locationY
        );
      },

      onPanResponderMove: (evt) => {
        // Don't extend the path if touch began
        // on an existing visited node.
        if (rewindCandidateRef.current !== null) {
          return;
        }

        touchHandlersRef.current.handleTouch(
          evt.nativeEvent.locationX,
          evt.nativeEvent.locationY
        );
      },

      onPanResponderRelease: (evt, gestureState) => {
        const targetIndex = rewindCandidateRef.current;

        rewindCandidateRef.current = null;

        // No visited node was selected.
        if (targetIndex === null) return;

        // A tap should have very little finger movement.
        const isTap =
          Math.abs(gestureState.dx) <= 12 &&
          Math.abs(gestureState.dy) <= 12;

        if (!isTap) return;

        // Rewind using the node saved at touch start.
        touchHandlersRef.current.handleTapRewind(
          targetIndex
        );
      },

      onPanResponderTerminate: () => {
        rewindCandidateRef.current = null;
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  useEffect(() => {
    if (isLevelCleared) {
      const timer = setTimeout(() => {
        setShowWinModal(true);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isLevelCleared]);

  const handleUndo = () => {
    if (
      pathRef.current.length === 0 ||
      isWinningRef.current ||
      isPaused
    ) {
      return;
    }

    const newPath = pathRef.current.slice(0, -1);
    pathRef.current = newPath;
    setPath(newPath);

    undoCountRef.current += 1;
    setUndoCount(undoCountRef.current);

    if (isSoundOnRef.current && playClickSound) {
      playClickSound();
    }

    if (
      isVibrationOnRef.current &&
      Platform.OS !== "web"
    ) {
      Vibration.vibrate(20);
    }
  };

  const handleReset = () => {
    if (isWinningRef.current || isPaused) return;

    pathRef.current = [];
    setPath([]);
  };

  const handleRestartFromPause = () => {
    setIsPaused(false);
    pathRef.current = [];
    setPath([]);
    setUndoCount(0);
    undoCountRef.current = 0;
  };

  const handleMainMenuFromPause = () => {
    setIsPaused(false);
    navigation.navigate("MainMenu");
  };

  const handleNextLevel = () => {
    setShowWinModal(false);
    setIsLevelCleared(false);

    if (currentPlayingLevel === highestUnlockedLevel) {
      setHighestUnlockedLevel((prev) => prev + 1);
    }

    setCurrentPlayingLevel((prev) => prev + 1);
  };

  const handleMainMenuFromWin = () => {
    setShowWinModal(false);
    setIsLevelCleared(false);

    if (currentPlayingLevel === highestUnlockedLevel) {
      setHighestUnlockedLevel((prev) => prev + 1);
    }

    navigation.navigate("MainMenu");
  };

  const progress =
    totalValidNodesRef.current > 0
      ? Math.round(
          (path.length / totalValidNodesRef.current) * 100
        )
      : 0;

  if (levelData.length === 0) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.iconBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.levelBadge}>
          <Text style={styles.levelCaption}>
            NOW PLAYING
          </Text>

          <Text style={styles.levelText}>
            LEVEL {currentPlayingLevel}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* HOW TO PLAY BUTTON */}
          <TouchableOpacity
            onPress={() => setShowHowToPlay(true)}
            style={styles.hintBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="How to play"
            accessibilityHint="Open the game tutorial"
          >
            <Text style={styles.hintText}>?</Text>
          </TouchableOpacity>

          {/* PAUSE BUTTON */}
          <TouchableOpacity
            onPress={() => setIsPaused(true)}
            style={styles.iconBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Pause game"
          >
            <Text style={styles.iconBtnText}>Ⅱ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PROGRESS */}
      <View
        style={styles.progressSection}
        pointerEvents="none"
      >
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>
            PROGRESS
          </Text>

          <Text style={styles.progressValue}>
            {progress}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
      </View>

      {/* PUZZLE GRID */}
      <View
        style={styles.gridContainer}
        {...panResponder.panHandlers}
      >
        {levelData.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={styles.row}
            pointerEvents="none"
          >
            {row.map((cellValue, colIndex) => {
              const nodeID = `${rowIndex}-${colIndex}`;
              const pathIndex = path.indexOf(nodeID);

              const isSelected = pathIndex !== -1;
              const isBlocked = cellValue === 1;
              const isStart = cellValue === 2;

              let lineStyle = null;

              if (isSelected && pathIndex > 0) {
                const prevNodeID = path[pathIndex - 1];

                const [prevRow, prevCol] = prevNodeID
                  .split("-")
                  .map(Number);

                if (rowIndex < prevRow) {
                  lineStyle = {
                    top: "50%",
                    left: "50%",
                    height: currentCellSize,
                    width: LINE_THICKNESS,
                    marginLeft: -LINE_THICKNESS / 2,
                  };
                } else if (rowIndex > prevRow) {
                  lineStyle = {
                    bottom: "50%",
                    left: "50%",
                    height: currentCellSize,
                    width: LINE_THICKNESS,
                    marginLeft: -LINE_THICKNESS / 2,
                  };
                } else if (colIndex < prevCol) {
                  lineStyle = {
                    top: "50%",
                    left: "50%",
                    width: currentCellSize,
                    height: LINE_THICKNESS,
                    marginTop: -LINE_THICKNESS / 2,
                  };
                } else if (colIndex > prevCol) {
                  lineStyle = {
                    top: "50%",
                    right: "50%",
                    width: currentCellSize,
                    height: LINE_THICKNESS,
                    marginTop: -LINE_THICKNESS / 2,
                  };
                }
              }

              return (
                <View
                  key={`cell-${colIndex}`}
                  style={{
                    width: currentCellSize,
                    height: currentCellSize,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {lineStyle && (
                    <View
                      style={[styles.pathLine, lineStyle]}
                    />
                  )}

                  <View
                    style={[
                      styles.baseNode,
                      {
                        width: NODE_SIZE,
                        height: NODE_SIZE,
                        borderRadius: NODE_SIZE / 2,
                      },
                      isSelected && styles.nodeSelected,
                      isBlocked && styles.nodeBlocked,
                      isStart &&
                        !isSelected &&
                        styles.nodeStart,
                      isStart &&
                        isSelected &&
                        styles.nodeStartSelected,
                    ]}
                  >
                    {isBlocked && (
                      <View style={styles.crossContainer}>
                        <View
                          style={[
                            styles.crossLine,
                            {
                              transform: [
                                { rotate: "45deg" },
                              ],
                            },
                          ]}
                        />

                        <View
                          style={[
                            styles.crossLine,
                            {
                              transform: [
                                { rotate: "-45deg" },
                              ],
                            },
                          ]}
                        />
                      </View>
                    )}

                    {isStart && !isSelected && (
                      <View style={styles.startCore} />
                    )}

                    {isSelected && (
                      <View style={styles.selectedCore} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* UNDO & RESET */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleUndo}
          style={styles.controlBtn}
        >
          <Text style={styles.controlText}>
            UNDO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          style={styles.controlBtnSecondary}
        >
          <Text style={styles.controlTextSecondary}>
            RESET
          </Text>
        </TouchableOpacity>
      </View>

      {/* HOW TO PLAY MODAL */}
      <HowToPlayModal
        visible={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* PAUSE MENU */}
      <PauseMenu
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onRestart={handleRestartFromPause}
        onMainMenu={handleMainMenuFromPause}
      />

      {/* WIN MODAL */}
      <WinModal
        visible={showWinModal}
        currentLevel={currentPlayingLevel}
        stars={earnedStars}
        onNextLevel={handleNextLevel}
        onMainMenu={handleMainMenuFromWin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 32,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 10,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#171922",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#303343",
  },

  iconBtnText: {
    color: "#E8EAF5",
    fontSize: 19,
    fontWeight: "700",
  },

  hintBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,240,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,240,255,0.50)",
  },

  hintText: {
    color: "#00F0FF",
    fontSize: 23,
    fontWeight: "800",
  },

  levelBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  levelCaption: {
    color: "#707C97",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 3,
  },

  levelText: {
    color: "#DDFEFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  progressSection: {
    width: "100%",
    paddingHorizontal: 28,
    marginBottom: 4,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressLabel: {
    color: "#8C92AA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  progressValue: {
    color: "#00F0FF",
    fontSize: 11,
    fontWeight: "800",
  },

  progressTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: "#292B3C",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#00F0FF",
    borderRadius: 4,
  },

  gridContainer: {
    backgroundColor: "#11131D",
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#303348",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },

  row: {
    flexDirection: "row",
  },

  baseNode: {
    backgroundColor: "#18181b",
    borderWidth: 2,
    borderColor: "#27272a",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  pathLine: {
    position: "absolute",
    backgroundColor: "#00f0ff",
    borderRadius: 10,
    shadowColor: "#00f0ff",
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },

  nodeSelected: {
    backgroundColor: "#00f0ff",
    borderColor: "rgba(255,255,255,0.8)",
    borderWidth: 3,
    shadowColor: "#00f0ff",
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },

  selectedCore: {
    width: "40%",
    height: "40%",
    backgroundColor: "#fff",
    borderRadius: 50,
  },

  nodeStart: {
    borderColor: "#00f0ff",
    borderWidth: 2,
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    borderStyle: "dashed",
  },

  startCore: {
    width: "50%",
    height: "50%",
    backgroundColor: "#00f0ff",
    borderRadius: 50,
    opacity: 0.8,
  },

  nodeStartSelected: {
    borderColor: "#fff",
    borderWidth: 3,
    backgroundColor: "#00f0ff",
    borderStyle: "solid",
  },

  nodeBlocked: {
    backgroundColor: "#0f0f12",
    borderColor: "#18181b",
    borderWidth: 2,
  },

  crossContainer: {
    width: "40%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },

  crossLine: {
    position: "absolute",
    width: "100%",
    height: 3,
    backgroundColor: "#ff3366",
    borderRadius: 2,
  },

  controls: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "center",
  },

  controlBtn: {
    paddingHorizontal: 25,
    paddingVertical: 18,
    backgroundColor: "#00f0ff",
    borderRadius: 100,
    minWidth: 124,
    alignItems: "center",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },

  controlText: {
    color: "#09090b",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },

  controlBtnSecondary: {
    paddingHorizontal: 25,
    paddingVertical: 18,
    backgroundColor: "#18181b",
    borderRadius: 100,
    minWidth: 124,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },

  controlTextSecondary: {
    color: "#a1a1aa",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
