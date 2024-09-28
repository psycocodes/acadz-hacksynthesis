import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { images } from "../constants/";
import { CustomButton } from "../components";

export default function Home() {
  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Image
            className="h-[100px] w-[300px]"
            source={images.logo}
            resizeMode="contain"
          />
          <Text className="font-pregular text-l text-white p-5">
            The Future of Smarter Learning
          </Text>
          <CustomButton
            title="Proceed to Dashboard"
            handlePress={() => router.push("/home")}
            containerStyles="px-5"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
