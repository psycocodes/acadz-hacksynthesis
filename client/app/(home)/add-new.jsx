import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons, images } from "../../constants/";
import { CustomButton } from "../../components";
import { router } from "expo-router";
const AddNew = () => {
  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <View
        id="navbar"
        className="flex-row justify-between items-center mt-12 mx-8"
      >
        <Image
          className="h-[30px] w-[30px]"
          source={icons.leftArrow}
          resizeMode="contain"
        />

        <View className="flex-row items-center gap-7">
          <Image
            className="h-[30px] w-[10px]"
            source={icons.menu}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text className=" text-gray-100 font-plight text-s mt-10 p-10 text-center">
        {" "}
        Click on the buttons to Add a NoteBook or a Group.
      </Text>
      <View className="flex-column justify-center items-center mt-10 gap-5">
        <View className="flex-row justify-center items-center">
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
        <View className="flex-row justify-around items-center gap-5">
          <CustomButton
            title="R"
            handlePress={() => router.push("/record")}
            containerStyles="px-5 m-2"
          />
          <CustomButton
            title="S"
            handlePress={() => router.push("/scan-doc")}
            containerStyles="px-5 m-2"
          />
          <CustomButton
            title="Y"
            handlePress={() => router.push("/upload-yt")}
            containerStyles="px-5 m-2"
          />
          <CustomButton
            title="U"
            handlePress={() => router.push("/upload-doc")}
            containerStyles="px-5 m-2"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddNew;

const styles = StyleSheet.create({});
