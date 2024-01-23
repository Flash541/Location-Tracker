import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Locator from "../screens/Locator";
import Settings from "../screens/Settings";
import image from "../../assets/gradient.png";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            border: 0,
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === "Locator") {
              iconName = "map-outline";
            } else if (route.name === "Settings") {
              iconName = "settings-outline";
            }
            return <Ionicons name={iconName} size={32} color="white" />;
          },
          tabBarBackground: () => (
            <Image style={{ width: "100%", height: 50 }} source={image} />
          ),
        })}
      >
        <Tab.Screen name="Locator" component={Locator} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
