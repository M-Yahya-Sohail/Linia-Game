import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  PanResponder,
  Alert,
} from "react-native";
import { GameContext } from "../context/GameContext"; // Added Context Import for Real-Time Progression

export default function Gameplay({ navigation }) {
  // Access global state from Context
  const {
    highestUnlockedLevel,
    setHighestUnlockedLevel,
    currentPlayingLevel,
    setCurrentPlayingLevel,
  } = useContext(GameContext);

  // Matrix Rules: 0 = Path, 1 = Blocked (Red), 2 = Start Point (Highlighted)
  // For testing, you can change level data here:
  const levelData = [
    [2, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  const [path, setPath] = useState([]);
  const pathRef = useRef([]);

  const CELL_SIZE = 80; // Size including margins

  const totalValidNodes = levelData.flat().filter((cell) => cell !== 1).length;

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
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (
      row < 0 ||
      row >= levelData.length ||
      col < 0 ||
      col >= levelData[0].length
    )
      return;

    const cellValue = levelData[row][col];
    const nodeID = `${row}-${col}`;
    const currentPath = pathRef.current;

    if (cellValue === 1) return; // Blocked
    if (currentPath.includes(nodeID)) return; // No overlapping

    if (currentPath.length === 0) {
      if (cellValue !== 2) return; // Must start at 'S'
    } else {
      const lastNode = currentPath[currentPath.length - 1];
      const [lastRow, lastCol] = lastNode.split("-").map(Number);
      const isAdjacent =
        Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1;

      if (!isAdjacent) return; // Only adjacent allowed
    }

    const newPath = [...currentPath, nodeID];
    pathRef.current = newPath;
    setPath([...newPath]);
  };

  // REAL-TIME PROGRESSION LOGIC
  useEffect(() => {
    if (path.length === totalValidNodes) {
      Alert.alert(
        "LEVEL CLEARED!",
        "You have successfully completed the Hamiltonian path.",
        [
          {
            text: "NEXT LEVEL",
            onPress: () => {
              // Unlock next level if current is the highest unlocked
              if (currentPlayingLevel === highestUnlockedLevel) {
                setHighestUnlockedLevel((prev) => prev + 1);
              }
              // Jump to next level
              setCurrentPlayingLevel((prev) => prev + 1);

              // Reset path for the new level
              pathRef.current = [];
              setPath([]);
            },
          },
        ],
      );
    }
  }, [path, currentPlayingLevel, highestUnlockedLevel]);

  const handleUndo = () => {
    if (pathRef.current.length === 0) return;
    const newPath = pathRef.current.slice(0, -1);
    pathRef.current = newPath;
    setPath(newPath);
  };

  const handleReset = () => {
    pathRef.current = [];
    setPath([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <Text style={styles.headerText}>← BACK</Text>
        </TouchableOpacity>
        {/* Dynamic Level Text */}
        <Text style={styles.levelText}>LEVEL {currentPlayingLevel}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.gridContainer} {...panResponder.panHandlers}>
        {levelData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row} pointerEvents="none">
            {row.map((cellValue, colIndex) => {
              const nodeID = `${rowIndex}-${colIndex}`;
              const pathIndex = path.indexOf(nodeID); // Position of node in path array
              const isSelected = pathIndex !== -1;
              const isBlocked = cellValue === 1;
              const isStart = cellValue === 2;

              let arrowSymbol = ""; // Calculation for what to show inside this node

              if (isSelected && pathIndex > 0) {
                // Calculate direction from PREVIOUS node in path to CURRENT node
                const prevNodeID = path[pathIndex - 1];
                const [prevRow, prevCol] = prevNodeID.split("-").map(Number);

                // Compare to find movement direction
                if (rowIndex < prevRow) arrowSymbol = "↑";
                else if (rowIndex > prevRow) arrowSymbol = "↓";
                else if (colIndex < prevCol) arrowSymbol = "←";
                else if (colIndex > prevCol) arrowSymbol = "→";
              }

              return (
                <View key={`cell-${colIndex}`} style={styles.cell}>
                  <View
                    style={[
                      styles.node,
                      isSelected && styles.nodeSelected,
                      isBlocked && styles.nodeBlocked,
                      isStart && !isSelected && styles.nodeStart,
                      isStart && isSelected && styles.nodeStartSelected, // Special styling for selected Start node
                    ]}
                  >
                    {isBlocked && <Text style={styles.blockedText}>✕</Text>}
                    {isStart && !isSelected && (
                      <Text style={styles.startText}>S</Text>
                    )}
                    {/* Show arrows on selected nodes (Except start node, because it's the first move) */}
                    {isSelected &&
                      !isBlocked &&
                      !isStart &&
                      arrowSymbol !== "" && (
                        <Text style={styles.arrowText}>{arrowSymbol}</Text>
                      )}
                    {/* If selected Start node, "S" is better than arrows */}
                    {isSelected && isStart && (
                      <Text style={styles.startTextSelected}>S</Text>
                    )}
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
        <TouchableOpacity onPress={handleReset} style={styles.controlBtn}>
          <Text style={styles.controlText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    alignItems: "center",
  },
  headerBtn: { padding: 10 },
  headerText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  levelText: {
    color: "#00e5ff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  gridContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    overflow: "hidden",
  },
  row: { flexDirection: "row" },
  cell: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  node: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2a2a2a",
    borderWidth: 2,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  nodeSelected: {
    backgroundColor: "#00e5ff",
    borderColor: "#fff",
    shadowColor: "#00e5ff",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  nodeBlocked: { backgroundColor: "#ff3366", borderColor: "#ff0033" },
  nodeStart: { borderColor: "#00ffcc", borderWidth: 3 },
  nodeStartSelected: {
    borderColor: "#fff",
    borderWidth: 3,
    backgroundColor: "#00e5ff",
  }, // Style when S is part of path
  startText: { color: "#00ffcc", fontWeight: "bold", fontSize: 20 },
  startTextSelected: { color: "#121212", fontWeight: "bold", fontSize: 20 }, // S text color when node is neon blue
  blockedText: { color: "#fff", fontWeight: "bold", fontSize: 24 },
  arrowText: { color: "#121212", fontWeight: "bold", fontSize: 26 }, // Black arrow on neon background
  controls: { flexDirection: "row", gap: 20 },
  controlBtn: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  controlText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
