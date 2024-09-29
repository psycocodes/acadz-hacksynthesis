import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from "react-native";
import React from "react";
import { icons, images } from "../../constants/";
import { CustomButton } from "../../components";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import data from "./note";
import { IconButton } from "react-native-paper";

const Home = () => {
  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <View
        id="navbar"
        className="flex-row justify-between items-center mt-12 mx-8"
      >
        <Image
          className="h-[20px] w-[20px]"
          source={images.logoSmall}
          resizeMode="contain"
        />

        <View className="flex-row items-center gap-7">
          <Image
            className="h-[20px] w-[20px]"
            source={icons.profile}
            resizeMode="contain"
          />
          <Image
            className="h-[20px] w-[10px]"
            source={icons.menu}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text id="breadcrums" className="text-gray-500 text-s mx-8 mt-4">
        root
      </Text>
      {/* // UI not responsive we need to add some more views and all */}
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View className="mb-3 mt-2 mx-5 rounded-2xl flex-row items-center justify-around p-2 pr-4 border border-gray-100">
            <TouchableOpacity
              onPress={() => router.push("/add-new")}
              activeOpacity={0.7}
              className={`flex-row items-center mx-4 mr-6`}
            >
              <IconButton
                icon={
                  item.type === "notebook"
                    ? "notebook-outline"
                    : "folder-outline"
                }
                iconColor={item.type === "notebook" ? "#6200EE" : "#03DAC6"}
                size={30}
              />
              <ScrollView horizontal={true}>
                <Text className=" text-white font-pmedium text-sm">
                  {item.name}
                </Text>
              </ScrollView>
            </TouchableOpacity>
            <IconButton icon="play" iconColor="#F5F5F5" size={30} />
          </View>
        )}
        keyExtractor={(item) => item.name}
      />
    </SafeAreaView>
  );
};

export default Home;
