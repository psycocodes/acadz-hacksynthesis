import React, { useEffect } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { Images } from "../constants/";
import { useTheme, Button, Text, IconButton } from "react-native-paper";

const app_info = `
Version: 0.2.0a (alpha)
Date: 12-10-2024
Devs: Mohikshit Ghorai, Pritam Das, Suparno Saha

Initially made for #HackSynthesis 2024 hackathon at UEM, Newton, Kolkata
`.trim();

export default function WelcomeScreen({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<IconButton
                icon="information-outline"
                onPress={() => Alert.alert('App Info', app_info)}
                iconColor={theme.colors.onPrimaryContainer}
            />)
        });
    }, []);
    return (
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

            <Button
                icon="chevron-right"
                mode="outlined"
                style={styles.button}
                onPress={() => navigation.navigate("Home")}>
                Continue to Dashboard
            </Button>
            <Button
                icon="chevron-right"
                mode="outlined"
                style={styles.button}
                disabled={true}
                onPress={() => navigation.navigate("TestAudio")}>
                Test button
            </Button>
        </View>
    );
}


const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colors.background,
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
        // fontFamily: "Poppins-Regular",
        fontSize: 18,
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingTop: 2,
    },
    boldText: {
        // fontFamily: "Poppins-Bold",
        fontSize: 24,
    },
    button: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
});