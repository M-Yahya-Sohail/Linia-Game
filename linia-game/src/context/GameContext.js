import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [currentPlayingLevel, setCurrentPlayingLevel] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false); // Naya safety lock

  useEffect(() => {
    const loadGameProgress = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('SAVE_DATA_HIGHEST_LEVEL');
        if (savedLevel !== null && !isNaN(parseInt(savedLevel))) {
          const parsedLevel = parseInt(savedLevel);
          if (parsedLevel > 97) {
            setHighestUnlockedLevel(parsedLevel);
            setCurrentPlayingLevel(parsedLevel);
          }
        }
      } catch (error) {
        console.error("Failed to load progress");
      } finally {
        setIsLoaded(true); // Database ready ho gaya
      }
    };
    loadGameProgress();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('SAVE_DATA_HIGHEST_LEVEL', highestUnlockedLevel.toString());
    }
  }, [highestUnlockedLevel, isLoaded]);

  return (
    <GameContext.Provider value={{ 
      highestUnlockedLevel, 
      setHighestUnlockedLevel, 
      currentPlayingLevel, 
      setCurrentPlayingLevel,
      isLoaded // Yeh lock aage pass kar diya
    }}>
      {children}
    </GameContext.Provider>
  );
};