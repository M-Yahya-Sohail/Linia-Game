import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; // <-- Naya Import

import MainMenu from "./src/screens/MainMenu";
import Gameplay from "./src/screens/GamePlay";
import LevelSelection from "./src/screens/LevelSelection";
import { GameProvider } from "./src/context/GameContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: "fade",
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="MainMenu" component={MainMenu} />
            <Stack.Screen
              name="LevelSelection"
              component={LevelSelection}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Gameplay"
              component={Gameplay}
              options={{ gestureEnabled: false }}
            />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}
