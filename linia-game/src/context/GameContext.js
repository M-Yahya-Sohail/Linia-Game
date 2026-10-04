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

  // Sound Players Reference
  const clickPlayerRef = useRef(null);
  const winPlayerRef = useRef(null);

  // 1. Audio Engine & Players Setup (iOS Silent Mode bypass included)
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
      // Clean up players on unmount
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
      } else {
        const player = createAudioPlayer(require('../../assets/sounds/click.mp3'));
        player.play();
      }
    } catch (e) {
      console.warn('Click sound error:', e);
    }
  };

  const playWinSound = async () => {
    if (!isSoundOn) return;
    try {
      if (winPlayerRef.current) {
        winPlayerRef.current.seekTo(0);
        winPlayerRef.current.play();
      } else {
        const player = createAudioPlayer(require('../../assets/sounds/win.mp3'));
        player.play();
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

        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load progress.", e);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // 4. Save Storage Data
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};