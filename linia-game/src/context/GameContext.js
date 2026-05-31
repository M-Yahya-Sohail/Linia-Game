import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [currentPlayingLevel, setCurrentPlayingLevel] = useState(1);

  return (
    <GameContext.Provider value={{ 
      highestUnlockedLevel, 
      setHighestUnlockedLevel, 
      currentPlayingLevel, 
      setCurrentPlayingLevel 
    }}>
      {children}
    </GameContext.Provider>
  );
};