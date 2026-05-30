import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import MainMenu from './src/screens/MainMenu';
import Gameplay from './src/screens/GamePlay';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="Gameplay" component={Gameplay} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
