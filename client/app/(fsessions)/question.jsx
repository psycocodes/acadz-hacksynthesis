import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { icons, images } from "../../constants";
import Swipeable from "react-native-gesture-handler/Swipeable";

const FlashCardSession = () => {
  const question =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem vitae ut alias, incidunt neque iste nesciunt hic cumque aliquid quas enim dicta ipsa, impedit, suscipit aliquam cupiditate quia velit cum?";
  const answer = "4";

  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <View
        id="navbar"
        className="flex-row justify-between items-center mt-12 mx-8"
      >
        <Image
          className="h-[20px] w-[20px]"
          source={icons.leftArrow}
          resizeMode="contain"
        />
      </View>
      <View className="max-w-full h-3/5 bg-gradient-to-r from-red-500 to-orange-500 mx-8 mt-10 rounded-3xl">
          <LinearGradient
            colors={["#FDC830", "#F37335"]}
            className="w-full h-full rounded-3xl"
          >
            <ScrollView
              contentContainerStyle={{
                flexDirection: "column",
                minHeight: "100%",
                justifyContent: "center",
                padding: 15,
              }}
            >
              <Text className="text-white font-psemibold text-lg text-center">
                {question}
              </Text>
            </ScrollView>
          </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default FlashCardSession;

const styles = StyleSheet.create({});
