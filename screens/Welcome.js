import React, { useEffect } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { Images } from "../constants/";
import { useTheme, Button, Text, IconButton } from "react-native-paper";

const app_info = `
Version: 0.2.1a (alpha)
Date: 15-10-2024
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

            <Text style={styles.infoText}>
                This app is currently in alpha stage. All features are not available yet!{'\n\n'}
                Any transcript/summary/flashcards etc, you add/generate are NOT saved.{'\n\n'}
                We are sorry for the inconvenience!
            </Text>
        </View>
    );
}


const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
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
        fontSize: 18,
        color: "white",
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    boldText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        marginHorizontal: 16,
        marginBottom: 16,
    },

    infoText: {
        borderTopWidth: 1,
        borderColor: theme.colors.tertiary,
        paddingTop: 15,
        marginTop: 15,
        color: theme.colors.tertiary,
        paddingHorizontal: 16,
    }
});