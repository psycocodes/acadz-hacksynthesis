import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons, images } from "../../constants/";
import { CustomButton } from "../../components";
import { ActivityIndicator, TouchableOpacity } from "react-native";
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
      <Text className=" text-gray-100 font-plight text-s mt-10 p-10 text-center">
        {" "}
        Click on the buttons to Add a NoteBook or a Group.
      </Text>
      <View className="flex-row justify-center items-center mt-8 gap-2">
        <View className=" flex flex-col justify-center items-center gap-2">
          <TouchableOpacity
            onPress={() => router.push("/add-new")}
            activeOpacity={0.7}
            className={`rounded-xl min-h-[62px] flex flex-row justify-center items-center p-10 border-2 border-gray-100`}
          >
            <Image
              className="h-[70px] w-[70px]"
              source={images.notebookCreate}
              resizeMode="contain"
              tintColor="#f3f4f6"
            />
          </TouchableOpacity>
          <Text className=' text-center text-gray-100'>Add Notebook</Text>
        </View>
        <View className="flex flex-col justify-center items-center gap-2">
          <TouchableOpacity
            onPress={() => router.push("/add-new")}
            activeOpacity={0.7}
            className={`rounded-xl min-h-[62px] flex flex-row justify-center items-center p-10 border-2 border-gray-100`}
          >
            <Image
              className="h-[70px] w-[70px]"
              source={images.groupCreate}
              resizeMode="contain"
              tintColor="#f3f4f6"
            />
          </TouchableOpacity>
          <Text className="text-center text-gray-100">Add Group</Text>
                </View>
        </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
