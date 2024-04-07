import React from "react";
import { DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Cadastro from "../screens/Cadastro";
import Contas from "../screens/Contas";

export type RootTabParamList = {
  Cadastro: { id: string };
  Contas: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "blue",
    backround: "white",
  },
};

export const Routes = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.setParams({ id: undefined });
          },
        })}
        name="Cadastro"
        component={Cadastro}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              color={color}
              size={26}
            />
          ),
          title: "Cadastro",
        }}
      />
      <Tab.Screen
        name="Contas"
        component={Contas}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          title: "Lista de contatos",
        }}
      />
    </Tab.Navigator>
  );
};
