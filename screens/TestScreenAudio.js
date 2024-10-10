import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";


export default function TestScreenAudio() {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [recognizing, setRecognizing] = useState(false);
    const [transcript, setTranscript] = useState("sdfdfzxcvdfgdf");

    useSpeechRecognitionEvent("start", () => setRecognizing(true));
    useSpeechRecognitionEvent("end", () => setRecognizing(false));
    useSpeechRecognitionEvent("result", (event) => {
        setTranscript(event.results[0]?.transcript);
    });
    useSpeechRecognitionEvent("error", (event) => {
        console.log("error code:", event.error, "error messsage:", event.message);
    });

    const handleStart = async () => {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            console.warn("Permissions not granted", result);
            return;
        }
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
            lang: "en-US",
            interimResults: true,
            maxAlternatives: 1,
            continuous: false,
            requiresOnDeviceRecognition: false,
            addsPunctuation: false,
            contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
        });
    };

    return (
        <View style={styles.container}>
            {!recognizing ? (
                <Button mode="contained" onPress={handleStart}> Start </Button>
            ) : (
                <Button mode="contained" onPress={ExpoSpeechRecognitionModule.stop}> Stop </Button>
            )}

            <ScrollView>
                <Text>{transcript}</Text>
            </ScrollView>
        </View>
    );
}

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    }

});
