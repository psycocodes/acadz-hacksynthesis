import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { images } from "../constants/";
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';


export default function Home() {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const router = useRouter();

  useEffect(() => {
    // Start the fade-out animation
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade to 0 (invisible)
      duration: 4000, // Duration of fade-out
      useNativeDriver: true, // Use native driver for performance
    }).start(() => {
      setIsVisible(false); // Hide the current screen after fade-out
      router.replace('/index-next'); // Navigate to the next screen
    });
  }, [fadeAnim, router]);
  return (isVisible && (
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
              <View className="flex-1 justify-center items-center">
                <Image
                  className="h-[100px] w-[100px]"
                  source={images.logoSmall}
                  resizeMode="contain"
                />
                
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
  ));
}

