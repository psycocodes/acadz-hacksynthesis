import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const HomeLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="record"
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#161622",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="scan-doc"
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#161622",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="upload-doc"
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#161622",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="upload-yt"
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
