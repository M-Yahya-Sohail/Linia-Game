import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [currentPlayingLevel, setCurrentPlayingLevel] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // === GLOBAL SETTINGS ===
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(true);

  // === NEW: STARS TRACKING ({ 1: 3, 2: 2, 3: 1 }) ===
  const [levelStars, setLevelStars] = useState({});

  // Sound Players Reference
  const clickPlayerRef = useRef(null);
  const winPlayerRef = useRef(null);

  // 1. Audio Engine & Players Setup
  useEffect(() => {
    async function initAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentModeIOS: true,
        });

        clickPlayerRef.current = createAudioPlayer(require('../../assets/sounds/click.mp3'));
        winPlayerRef.current = createAudioPlayer(require('../../assets/sounds/win.mp3'));
      } catch (err) {
        console.warn('Audio setup error:', err);
      }
    }
    initAudio();

    return () => {
      if (clickPlayerRef.current) clickPlayerRef.current.remove();
      if (winPlayerRef.current) winPlayerRef.current.remove();
    };
  }, []);

  // 2. Play Sound Functions
  const playClickSound = async () => {
    if (!isSoundOn) return;
    try {
      if (clickPlayerRef.current) {
        clickPlayerRef.current.seekTo(0);
        clickPlayerRef.current.play();
      }
    } catch (e) {}
  };

  const playWinSound = async () => {
    if (!isSoundOn) return;
    try {
      if (clickPlayerRef.current) {
        try { clickPlayerRef.current.pause(); } catch (err) {}
      }
      if (winPlayerRef.current) {
        winPlayerRef.current.seekTo(0);
        winPlayerRef.current.play();
      }
    } catch (e) {
      console.warn('Win sound error:', e);
    }
  };

  // 3. Load Storage Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('highestUnlockedLevel');
        if (savedLevel !== null) {
          setHighestUnlockedLevel(parseInt(savedLevel, 10));
          setCurrentPlayingLevel(parseInt(savedLevel, 10));
        }

        const savedSound = await AsyncStorage.getItem('isSoundOn');
        if (savedSound !== null) setIsSoundOn(JSON.parse(savedSound));

        const savedVib = await AsyncStorage.getItem('isVibrationOn');
        if (savedVib !== null) setIsVibrationOn(JSON.parse(savedVib));

        // Load Saved Stars
        const savedStars = await AsyncStorage.getItem('levelStars');
        if (savedStars !== null) setLevelStars(JSON.parse(savedStars));

        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load progress.", e);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // 4. Save Stars Function (Better score overwrite only)
  const saveLevelScore = async (level, stars) => {
    setLevelStars((prev) => {
      const currentBest = prev[level] || 0;
      if (stars > currentBest) {
        const updated = { ...prev, [level]: stars };
        AsyncStorage.setItem('levelStars', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // 5. Save General Storage Data
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('highestUnlockedLevel', highestUnlockedLevel.toString());
      AsyncStorage.setItem('isSoundOn', JSON.stringify(isSoundOn));
      AsyncStorage.setItem('isVibrationOn', JSON.stringify(isVibrationOn));
    }
  }, [highestUnlockedLevel, isSoundOn, isVibrationOn, isLoaded]);

  return (
    <GameContext.Provider
      value={{
        highestUnlockedLevel,
        setHighestUnlockedLevel,
        currentPlayingLevel,
        setCurrentPlayingLevel,
        isLoaded,
        isSoundOn,
        setIsSoundOn,
        isVibrationOn,
        setIsVibrationOn,
        playClickSound,
        playWinSound,
        levelStars,
        saveLevelScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};