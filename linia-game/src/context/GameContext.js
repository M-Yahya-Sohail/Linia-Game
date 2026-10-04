import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [currentPlayingLevel, setCurrentPlayingLevel] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // === NAYI GLOBAL SETTINGS ===
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('highestUnlockedLevel');
        if (savedLevel !== null) {
          setHighestUnlockedLevel(parseInt(savedLevel, 10));
          setCurrentPlayingLevel(parseInt(savedLevel, 10));
        }

        // Settings Load Karna
        const savedSound = await AsyncStorage.getItem('isSoundOn');
        if (savedSound !== null) setIsSoundOn(JSON.parse(savedSound));

        const savedVib = await AsyncStorage.getItem('isVibrationOn');
        if (savedVib !== null) setIsVibrationOn(JSON.parse(savedVib));

        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load progress.", e);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('highestUnlockedLevel', highestUnlockedLevel.toString());
      // Settings Save Karna (takay app restart hone par same rahein)
      AsyncStorage.setItem('isSoundOn', JSON.stringify(isSoundOn));
      AsyncStorage.setItem('isVibrationOn', JSON.stringify(isVibrationOn));
    }
  }, [highestUnlockedLevel, isSoundOn, isVibrationOn, isLoaded]);

  return (
    <GameContext.Provider value={{
      highestUnlockedLevel, setHighestUnlockedLevel,
      currentPlayingLevel, setCurrentPlayingLevel,
      isLoaded,
      isSoundOn, setIsSoundOn,
      isVibrationOn, setIsVibrationOn
    }}>
      {children}
    </GameContext.Provider>
  );
};