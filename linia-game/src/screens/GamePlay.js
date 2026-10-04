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
import { Audio } from "expo-av"; // <--- EXPO AUDIO IMPORT KIYA HAI
import { GameContext } from "../context/GameContext";
import { generateLevel } from "../utils/LevelGenerator";
import PauseMenu from "../components/PauseMenu";
import WinModal from "../components/WinModal";

export default function Gameplay({ navigation }) {
  const {
    highestUnlockedLevel,
    setHighestUnlockedLevel,
    currentPlayingLevel,
    setCurrentPlayingLevel,
    isSoundOn,
    setIsSoundOn,
    isVibrationOn,
    setIsVibrationOn,
  } = useContext(GameContext);

  const [levelData, setLevelData] = useState([]);
  const [path, setPath] = useState([]);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const levelDataRef = useRef([]);
  const cellSizeRef = useRef(80);
  const pathRef = useRef([]);
  const isWinningRef = useRef(false);
  const totalValidNodesRef = useRef(0);

  // ==========================================
  // SAFE AUDIO PLAYBACK SYSTEM (No Memory Leaks)
  // ==========================================
  const playSound = async (type) => {
    // Agar setting se sound band hai, toh yahin se wapas mud jao
    if (!isSoundOn) return;

    try {
      let audioSource;
      if (type === "click") {
        audioSource = require("../../assets/sounds/click.mp3");
      } else if (type === "win") {
        audioSource = require("../../assets/sounds/win.mp3");
      }

      const { sound } = await Audio.Sound.createAsync(audioSource);
      await sound.playAsync();

      // Jaise hi aawaz khatam ho, memory free kar do (Professional Approach)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Sound play error: ", error);
    }
  };

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
  }, [currentPlayingLevel]);

  const screenWidth = Dimensions.get("window").width;
  const columns = levelData.length > 0 ? levelData[0].length : 3;
  const currentCellSize = Math.min(
    85,
    Math.floor((screenWidth - 40) / columns),
  );
  cellSizeRef.current = currentCellSize;
  const NODE_SIZE = currentCellSize * 0.45;
  const LINE_THICKNESS = 14;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) =>
        handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      onPanResponderMove: (evt) =>
        handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
    }),
  ).current;

  const handleTouch = (x, y) => {
    if (isWinningRef.current || isPaused || showWinModal) return;

    const currentGrid = levelDataRef.current;
    const size = cellSizeRef.current;
    const currentPath = pathRef.current;

    if (currentGrid.length === 0) return;

    const col = Math.floor(x / size);
    const row = Math.floor(y / size);

    if (
      row < 0 ||
      row >= currentGrid.length ||
      col < 0 ||
      col >= currentGrid[0].length
    )
      return;

    const cellValue = currentGrid[row][col];
    const nodeID = `${row}-${col}`;

    if (cellValue === 1) return;
    if (currentPath.includes(nodeID)) return;

    if (currentPath.length === 0) {
      if (cellValue !== 2) return;
    } else {
      const lastNode = currentPath[currentPath.length - 1];
      const [lastRow, lastCol] = lastNode.split("-").map(Number);
      const isAdjacent =
        Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1;

      if (!isAdjacent) return;
    }

    const newPath = [...currentPath, nodeID];
    pathRef.current = newPath;
    setPath([...newPath]);

    // Check Win Condition First
    if (
      newPath.length === totalValidNodesRef.current &&
      !isWinningRef.current
    ) {
      isWinningRef.current = true;
      setIsLevelCleared(true);

      playSound("win"); // WIN SOUND
      if (isVibrationOn && Platform.OS !== "web") {
        Vibration.vibrate([0, 100, 50, 100]); // Long reward vibration
      }
    } else {
      playSound("click"); // NORMAL CLICK SOUND
      if (isVibrationOn && Platform.OS !== "web") {
        Vibration.vibrate(35); // Small haptic tick
      }
    }
  };

  useEffect(() => {
    if (isLevelCleared) {
      const timer = setTimeout(() => {
        setShowWinModal(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isLevelCleared]);

  const handleUndo = () => {
    if (pathRef.current.length === 0 || isWinningRef.current || isPaused)
      return;
    const newPath = pathRef.current.slice(0, -1);
    pathRef.current = newPath;
    setPath(newPath);

    playSound("click"); // Play sound on undo as well
    if (isVibrationOn && Platform.OS !== "web") {
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

  if (levelData.length === 0) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Text style={styles.iconBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LEVEL {currentPlayingLevel}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsPaused(true)}
          style={styles.iconBtn}
        >
          <Text style={styles.iconBtnText}>॥</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer} {...panResponder.panHandlers}>
        {levelData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row} pointerEvents="none">
            {row.map((cellValue, colIndex) => {
              const nodeID = `${rowIndex}-${colIndex}`;
              const pathIndex = path.indexOf(nodeID);
              const isSelected = pathIndex !== -1;
              const isBlocked = cellValue === 1;
              const isStart = cellValue === 2;

              let lineStyle = null;
              if (isSelected && pathIndex > 0) {
                const prevNodeID = path[pathIndex - 1];
                const [prevRow, prevCol] = prevNodeID.split("-").map(Number);
                if (rowIndex < prevRow)
                  lineStyle = {
                    top: "50%",
                    left: "50%",
                    height: currentCellSize,
                    width: LINE_THICKNESS,
                    marginLeft: -LINE_THICKNESS / 2,
                  };
                else if (rowIndex > prevRow)
                  lineStyle = {
                    bottom: "50%",
                    left: "50%",
                    height: currentCellSize,
                    width: LINE_THICKNESS,
                    marginLeft: -LINE_THICKNESS / 2,
                  };
                else if (colIndex < prevCol)
                  lineStyle = {
                    top: "50%",
                    left: "50%",
                    width: currentCellSize,
                    height: LINE_THICKNESS,
                    marginTop: -LINE_THICKNESS / 2,
                  };
                else if (colIndex > prevCol)
                  lineStyle = {
                    top: "50%",
                    right: "50%",
                    width: currentCellSize,
                    height: LINE_THICKNESS,
                    marginTop: -LINE_THICKNESS / 2,
                  };
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
                  {lineStyle && <View style={[styles.pathLine, lineStyle]} />}
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
                      isStart && !isSelected && styles.nodeStart,
                      isStart && isSelected && styles.nodeStartSelected,
                    ]}
                  >
                    {isBlocked && (
                      <View style={styles.crossContainer}>
                        <View
                          style={[
                            styles.crossLine,
                            { transform: [{ rotate: "45deg" }] },
                          ]}
                        />
                        <View
                          style={[
                            styles.crossLine,
                            { transform: [{ rotate: "-45deg" }] },
                          ]}
                        />
                      </View>
                    )}
                    {isStart && !isSelected && (
                      <View style={styles.startCore} />
                    )}
                    {isSelected && <View style={styles.selectedCore} />}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleUndo} style={styles.controlBtn}>
          <Text style={styles.controlText}>UNDO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReset}
          style={styles.controlBtnSecondary}
        >
          <Text style={styles.controlTextSecondary}>RESET</Text>
        </TouchableOpacity>
      </View>

      <PauseMenu
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        isSoundOn={isSoundOn}
        setIsSoundOn={setIsSoundOn}
        isVibrationOn={isVibrationOn}
        setIsVibrationOn={setIsVibrationOn}
        onRestart={handleRestartFromPause}
        onMainMenu={handleMainMenuFromPause}
      />

      <WinModal
        visible={showWinModal}
        currentLevel={currentPlayingLevel}
        onNextLevel={handleNextLevel}
        onMainMenu={handleMainMenuFromWin}
      />
    </SafeAreaView>
  );
}

// ==========================================
// STYLESHEET (As it was, no changes)
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    marginBottom: 20,
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
  levelBadge: {
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 240, 255, 0.3)",
  },
  levelText: {
    color: "#00f0ff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },
  gridContainer: {
    backgroundColor: "#121214",
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#27272a",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  row: { flexDirection: "row" },
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
    paddingHorizontal: 35,
    paddingVertical: 18,
    backgroundColor: "#00f0ff",
    borderRadius: 100,
    minWidth: 140,
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
    paddingHorizontal: 35,
    paddingVertical: 18,
    backgroundColor: "#18181b",
    borderRadius: 100,
    minWidth: 140,
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
