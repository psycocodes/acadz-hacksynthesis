import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, View, Image, ImageBackground, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Images } from "../constants/";


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

    return (
        isVisible && (
            <ImageBackground
                source={Images.bg}
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar style="light" />
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.logoImage}
                                    source={Images.logoSmall}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        )
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
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoImage: {
        height: 100,
        width: 100,
    },
});