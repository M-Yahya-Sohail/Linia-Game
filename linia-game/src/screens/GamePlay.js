import React, { useState, useRef, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, PanResponder, Alert, Dimensions } from "react-native";
import { GameContext } from "../context/GameContext";
import { generateLevel } from "../utils/LevelGenerator";

export default function Gameplay({ navigation }) {
  const { highestUnlockedLevel, setHighestUnlockedLevel, currentPlayingLevel, setCurrentPlayingLevel } = useContext(GameContext);

  const [levelData, setLevelData] = useState([]);
  const [path, setPath] = useState([]);
  const [isLevelCleared, setIsLevelCleared] = useState(false); 
  
  const levelDataRef = useRef([]); 
  const cellSizeRef = useRef(80);
  const pathRef = useRef([]);
  const isWinningRef = useRef(false); 
  const totalValidNodesRef = useRef(0); 

  useEffect(() => {
    const newGrid = generateLevel(currentPlayingLevel);
    setLevelData(newGrid);
    levelDataRef.current = newGrid;
    totalValidNodesRef.current = newGrid.flat().filter(cell => cell !== 1).length;
    
    setPath([]);
    pathRef.current = [];
    isWinningRef.current = false; 
    setIsLevelCleared(false); 
  }, [currentPlayingLevel]);

  const screenWidth = Dimensions.get("window").width;
  const columns = levelData.length > 0 ? levelData[0].length : 3;
  const currentCellSize = Math.min(80, Math.floor((screenWidth - 60) / columns));
  cellSizeRef.current = currentCellSize;
  const NODE_SIZE = currentCellSize * 0.75;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
    })
  ).current;

  const handleTouch = (x, y) => {
    if (isWinningRef.current) return; 
    
    const currentGrid = levelDataRef.current;
    const size = cellSizeRef.current;
    const currentPath = pathRef.current;

    if (currentGrid.length === 0) return;

    const col = Math.floor(x / size);
    const row = Math.floor(y / size);

    if (row < 0 || row >= currentGrid.length || col < 0 || col >= currentGrid[0].length) return;

    const cellValue = currentGrid[row][col];
    const nodeID = `${row}-${col}`;

    if (cellValue === 1) return; 
    if (currentPath.includes(nodeID)) return; 

    if (currentPath.length === 0) {
      if (cellValue !== 2) return; 
    } else {
      const lastNode = currentPath[currentPath.length - 1];
      const [lastRow, lastCol] = lastNode.split("-").map(Number);
      const isAdjacent = Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1;
      
      if (!isAdjacent) return; 
    }

    const newPath = [...currentPath, nodeID];
    pathRef.current = newPath;
    setPath([...newPath]);

    if (newPath.length === totalValidNodesRef.current && !isWinningRef.current) {
      isWinningRef.current = true; 
      setIsLevelCleared(true); 
    }
  };

  // FIXED EFFECT: Clear the trigger state immediately inside the onPress event to stop double alerts
  useEffect(() => {
    if (isLevelCleared) {
      const timer = setTimeout(() => {
        Alert.alert(
          "LEVEL CLEARED!",
          "You have successfully completed the Hamiltonian path.",
          [
            {
              text: "NEXT LEVEL",
              onPress: () => {
                // Reset flag first before updating level to prevent loop trigger
                setIsLevelCleared(false);
                
                if (currentPlayingLevel === highestUnlockedLevel) {
                  setHighestUnlockedLevel((prev) => prev + 1);
                }
                setCurrentPlayingLevel((prev) => prev + 1);
              },
            },
          ],
          { cancelable: false }
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLevelCleared]); // Removed level states from here to stop re-triggering on level change

  const handleUndo = () => {
    if (pathRef.current.length === 0 || isWinningRef.current) return;
    const newPath = pathRef.current.slice(0, -1);
    pathRef.current = newPath;
    setPath(newPath);
  };

  const handleReset = () => {
    if (isWinningRef.current) return;
    pathRef.current = [];
    setPath([]);
  };

  if (levelData.length === 0) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Text style={styles.headerText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.levelText}>LEVEL {currentPlayingLevel}</Text>
        <View style={{ width: 60 }} />
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

              let arrowSymbol = "";
              if (isSelected && pathIndex > 0) {
                const prevNodeID = path[pathIndex - 1];
                const [prevRow, prevCol] = prevNodeID.split("-").map(Number);
                if (rowIndex < prevRow) arrowSymbol = "↑";
                else if (rowIndex > prevRow) arrowSymbol = "↓";
                else if (colIndex < prevCol) arrowSymbol = "←";
                else if (colIndex > prevCol) arrowSymbol = "→";
              }

              return (
                <View key={`cell-${colIndex}`} style={{ width: currentCellSize, height: currentCellSize, justifyContent: "center", alignItems: "center" }}>
                  <View
                    style={[
                      { width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2, backgroundColor: "#2a2a2a", borderWidth: 2, borderColor: "#444", justifyContent: "center", alignItems: "center" },
                      isSelected && styles.nodeSelected,
                      isBlocked && styles.nodeBlocked,
                      isStart && !isSelected && styles.nodeStart,
                      isStart && isSelected && styles.nodeStartSelected,
                    ]}
                  >
                    {isBlocked && <Text style={styles.blockedText}>✕</Text>}
                    {isStart && !isSelected && <Text style={styles.startText}>S</Text>}
                    {isSelected && !isBlocked && !isStart && arrowSymbol !== "" && (
                      <Text style={styles.arrowText}>{arrowSymbol}</Text>
                    )}
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
  container: { flex: 1, backgroundColor: "#121212", alignItems: "center", justifyContent: "space-between", paddingVertical: 50 },
  header: { width: "100%", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 30, alignItems: "center" },
  headerBtn: { padding: 10 },
  headerText: { color: "#888", fontSize: 16, fontWeight: "bold", letterSpacing: 1 },
  levelText: { color: "#00e5ff", fontSize: 24, fontWeight: "bold", letterSpacing: 2 },
  gridContainer: { backgroundColor: "#1a1a1a", borderRadius: 15, overflow: "hidden" },
  row: { flexDirection: "row" },
  nodeSelected: { backgroundColor: "#00e5ff", borderColor: "#fff", shadowColor: "#00e5ff", shadowOpacity: 0.8, shadowRadius: 10, elevation: 10 },
  nodeBlocked: { backgroundColor: "#ff3366", borderColor: "#ff0033" },
  nodeStart: { borderColor: "#00ffcc", borderWidth: 3 },
  nodeStartSelected: { borderColor: "#fff", borderWidth: 3, backgroundColor: "#00e5ff" },
  startText: { color: "#00ffcc", fontWeight: "bold", fontSize: 20 },
  startTextSelected: { color: "#121212", fontWeight: "bold", fontSize: 20 },
  blockedText: { color: "#fff", fontWeight: "bold", fontSize: 24 },
  arrowText: { color: "#121212", fontWeight: "bold", fontSize: 26 },
  controls: { flexDirection: "row", gap: 20 },
  controlBtn: { paddingHorizontal: 30, paddingVertical: 15, backgroundColor: "#333", borderRadius: 10, minWidth: 120, alignItems: "center" },
  controlText: { color: "#fff", fontSize: 18, fontWeight: "600", letterSpacing: 1 },
});