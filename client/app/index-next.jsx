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
  ImageBackground,
} from "react-native";
import { Link, router } from "expo-router";
import { images } from "../constants/";
import { CustomButton } from "../components";
import { IconButton } from "react-native-paper";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity

  useEffect(() => {
    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to 1 (fully visible)
      duration: 2000, // Duration of fade-in
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, [fadeAnim]);
  return (
    <ImageBackground
      source={images.bg}
      style={{
        height: null,
        width: "100%",
        resizeMode: "cover",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <SafeAreaView className="h-full w-full">
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <View className="flex-1 justify-center ">
              <Image
                className="h-[100px] w-[100px] ml-10"
                source={images.studentAnimated}
                resizeMode="contain"
              />
              <View className="flex-row items-center">
                <Text className="font-pregular text-xl text-white px-10 py-5 pt-2">
                  Welcome, <Text className="font-pbold text-3xl">Student </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/question")}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] flex flex-row justify-center items-center mx-8 border border-gray-100 mb-4`}
              >
                <Text className="text-gray-100 ml-7">
                  Continue to Dashboard
                </Text>
                <IconButton
                  icon="chevron-right"
                  iconColor="#f3f4f6"
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/home-alt")}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] flex flex-row justify-center items-center mx-8 border border-gray-100`}
              >
                <Text className="text-gray-100 ml-7">
                  Load Notes from Device
                </Text>
                <IconButton
                  icon="chevron-right"
                  iconColor="#f3f4f6"
                  size={30}
                />
              </TouchableOpacity>
              {/* <Image
                  className="h-[100px] w-[300px]"
                  source={images.logo}
                  resizeMode="contain"
                />
                <Text className="font-pregular text-l text-white p-5">
                  The Future of Smarter Learning
                </Text> */}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
