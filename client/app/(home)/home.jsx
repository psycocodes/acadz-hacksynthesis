import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons, images } from "../../constants/";
import { CustomButton } from "../../components";
import { router } from "expo-router";
const Home = () => {
  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <View
        id="navbar"
        className="flex-row justify-between items-center mt-12 mx-8"
      >
        <Image
          className="h-[30px] w-[30px]"
          source={images.logoSmall}
          resizeMode="contain"
        />

        <View className="flex-row items-center gap-7">
          <Image
            className="h-[30px] w-[30px]"
            source={icons.profile}
            resizeMode="contain"
          />
          <Image
            className="h-[30px] w-[10px]"
            source={icons.menu}
            resizeMode="contain"
          />
        </View>
      </View>
        <Text className=" text-gray-100 font-plight text-s mt-10 p-10 text-center"> Click on the buttons to Add a NoteBook or a Group.</Text>
      <View className="flex-row justify-center items-center mt-10">
        <CustomButton
          title="+NoteBook"
          handlePress={() => router.push("/add-new")}
          containerStyles="px-5"
        />
        <CustomButton
          title="+Group"
          handlePress={() => router.push("/add-new")}
          containerStyles="px-5 ml-5"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
