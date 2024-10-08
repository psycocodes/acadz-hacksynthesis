import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const HomeLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
         name="notebook"
         options={{
           headerTitle: "",
           headerStyle: {
             backgroundColor: "#161622",
           },
           headerTintColor: "white",
         }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default HomeLayout;
