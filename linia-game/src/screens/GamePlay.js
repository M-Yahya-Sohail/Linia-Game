import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  PanResponder,
  Alert,
} from "react-native";

export default function Gameplay({ navigation }) {
  // Matrix Rules: 0 = Path, 1 = Blocked (Red), 2 = Start Point (Highlighted)
  const levelData = [
    [2, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  const [path, setPath] = useState([]);
  const pathRef = useRef([]);

  const CELL_SIZE = 80;

  const totalValidNodes = levelData.flat().filter((cell) => cell !== 1).length;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // onPanResponderGrant tap (click) ko handle karta hai
      onPanResponderGrant: (evt) =>
        handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      // onPanResponderMove drag ko handle karta hai
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
  };

  useEffect(() => {
    if (path.length === totalValidNodes) {
      Alert.alert(
        "Level Cleared!",
        "You have successfully traversed the matrix.",
        [{ text: "Awesome", onPress: handleReset }],
      );
    }
  }, [path]);

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
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.levelText}>Level 1</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Container mein padding 0 kar di hai aur overflow hidden kiya hai taake coordinates exact accurately map hon */}
      <View style={styles.gridContainer} {...panResponder.panHandlers}>
        {levelData.map((row, rowIndex) => (
          /* pointerEvents="none" ka magic yahan hai: yeh tap aur drag ko mix nahi hone dega */
          <View key={`row-${rowIndex}`} style={styles.row} pointerEvents="none">
            {row.map((cellValue, colIndex) => {
              const nodeID = `${rowIndex}-${colIndex}`;
              const isSelected = path.includes(nodeID);
              const isBlocked = cellValue === 1;
              const isStart = cellValue === 2;

              return (
                <View key={`cell-${colIndex}`} style={styles.cell}>
                  <View
                    style={[
                      styles.node,
                      isSelected && styles.nodeSelected,
                      isBlocked && styles.nodeBlocked,
                      isStart && !isSelected && styles.nodeStart,
                    ]}
                  >
                    {isStart && !isSelected && (
                      <Text style={styles.startText}>S</Text>
                    )}
                    {isBlocked && <Text style={styles.blockedText}>✕</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleUndo} style={styles.controlBtn}>
          <Text style={styles.controlText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.controlBtn}>
          <Text style={styles.controlText}>Reset</Text>
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
  headerText: { color: "#888", fontSize: 16 },
  levelText: { color: "#00e5ff", fontSize: 24, fontWeight: "bold" },
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
  startText: { color: "#00ffcc", fontWeight: "bold", fontSize: 20 },
  blockedText: { color: "#fff", fontWeight: "bold", fontSize: 24 },
  controls: { flexDirection: "row", gap: 20 },
  controlBtn: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  controlText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
