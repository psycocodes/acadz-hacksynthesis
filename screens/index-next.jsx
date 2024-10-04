import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, ImageBackground, Animated, StyleSheet } from "react-native";
import { Images } from "../constants/";
import { IconButton } from "react-native-paper";

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
        <ImageBackground source={Images.bg} style={styles.backgroundImage}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="light" />
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
                        <View style={styles.container}>
                            <Image
                                style={styles.animatedImage}
                                source={Images.studentAnimated}
                                resizeMode="contain"
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.welcomeText}>
                                    Welcome, <Text style={styles.boldText}>Student</Text>
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => router.push("/home")}
                                activeOpacity={0.7}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Continue to Dashboard</Text>
                                <IconButton icon="chevron-right" iconColor="#f3f4f6" size={30} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { }}
                                activeOpacity={0.7}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Load Notes from Device</Text>
                                <IconButton icon="chevron-right" iconColor="#f3f4f6" size={30} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        resizeMode: "cover",
        overflow: "hidden",
    },
    safeArea: {
        flex: 1,
    },
    scrollViewContent: {
        height: "100%",
    },
    animatedView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
    },
    animatedImage: {
        height: 100,
        width: 100,
        marginLeft: 10,
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    welcomeText: {
        fontFamily: "Poppins-Regular",
        fontSize: 18,
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingTop: 2,
    },
    boldText: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 62,
        marginHorizontal: 8,
        marginBottom: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    buttonText: {
        color: "#f3f4f6",
        marginLeft: 7,
    },
});