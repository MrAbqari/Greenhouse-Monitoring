import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import CoolingFan from "./Perangkat/CoolingFan";
import LEDUV from "./Perangkat/LEDUV";
import WaterPump from "./Perangkat/WaterPump";
import FertPump from "./Perangkat/FertPump";
import Grafik from "./Grafik";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CoolingFan" component={CoolingFan} />
        <Stack.Screen name="LEDUV" component={LEDUV} />
        <Stack.Screen name="WaterPump" component={WaterPump} />
        <Stack.Screen name="FertPump" component={FertPump} />
        <Stack.Screen name="Grafik" component={Grafik} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
