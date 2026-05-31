import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { GameContext } from '../context/GameContext';

export default function LevelSelection({ navigation }) {
  const { highestUnlockedLevel, currentPlayingLevel, setCurrentPlayingLevel } = useContext(GameContext);
  
  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 25;

  // Pagination Logic: Limit user to current unlocked page + 1 locked page
  const maxUnlockedPage = Math.floor((highestUnlockedLevel - 1) / levelsPerPage);
  const allowedMaxPage = maxUnlockedPage + 1; 

  const startLevel = currentPage * levelsPerPage + 1;
  const levels = Array.from({ length: levelsPerPage }, (_, i) => startLevel + i);

  const handleNextPage = () => {
    if (currentPage < allowedMaxPage) setCurrentPage(prev => prev + 1);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const handleLevelPress = (level) => {
    if (level <= highestUnlockedLevel) {
      setCurrentPlayingLevel(level); // Update active level
      navigation.navigate('Gameplay');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>SELECT LEVEL</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.gridWrapper}>
        <View style={styles.grid}>
          {levels.map((level) => {
            const isUnlocked = level <= highestUnlockedLevel;
            const isCurrent = level === currentPlayingLevel; // Highlight wo hoga jo kheil raha hai
            const isLocked = level > highestUnlockedLevel;

            return (
              <TouchableOpacity
                key={level}
                activeOpacity={isLocked ? 1 : 0.7}
                onPress={() => handleLevelPress(level)}
                style={[
                  styles.levelBox,
                  isUnlocked && styles.boxUnlocked,
                  isCurrent && styles.boxCurrent,
                  isLocked && styles.boxLocked
                ]}
              >
                {isLocked ? (
                  <Text style={styles.lockedIcon}>🔒</Text>
                ) : (
                  <Text style={[
                    styles.levelNumber,
                    isCurrent && styles.textCurrent
                  ]}>
                    {level}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.pagination}>
        <TouchableOpacity 
          style={[styles.pageBtn, currentPage === 0 && styles.pageBtnDisabled]} 
          onPress={handlePrevPage}
          disabled={currentPage === 0}
        >
          <Text style={[styles.pageBtnText, currentPage === 0 && styles.pageTextDisabled]}>PREV</Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>PAGE {currentPage + 1}</Text>

        <TouchableOpacity 
          style={[styles.pageBtn, currentPage >= allowedMaxPage && styles.pageBtnDisabled]} 
          onPress={handleNextPage}
          disabled={currentPage >= allowedMaxPage} // Lock button if limit reached
        >
          <Text style={[styles.pageBtnText, currentPage >= allowedMaxPage && styles.pageTextDisabled]}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20, alignItems: 'center' },
  backBtn: { padding: 10 },
  backText: { color: '#888', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  titleText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 3 },
  gridWrapper: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 350, justifyContent: 'center', gap: 12 },
  levelBox: { width: 55, height: 55, justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 2 },
  boxUnlocked: { backgroundColor: '#1a1a1a', borderColor: '#333' },
  boxCurrent: { backgroundColor: 'rgba(0, 229, 255, 0.1)', borderColor: '#00e5ff', shadowColor: '#00e5ff', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
  boxLocked: { backgroundColor: '#0a0a0a', borderColor: '#1a1a1a' },
  levelNumber: { color: '#888', fontSize: 20, fontWeight: 'bold' },
  textCurrent: { color: '#00e5ff', fontSize: 22 },
  lockedIcon: { fontSize: 18, opacity: 0.3 },
  pagination: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 50 },
  pageBtn: { backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  pageBtnDisabled: { backgroundColor: '#1a1a1a' },
  pageBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  pageTextDisabled: { color: '#444' },
  pageIndicator: { color: '#666', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 }
});