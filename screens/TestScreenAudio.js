import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
    addSpeechRecognitionListener,
} from "expo-speech-recognition";

import VolumeMeter, { getInitialVolumeArray } from "../components/VolumeMeter";


// need to make changes for Android 12 and below (make it continuous)
export default function TestScreenAudio() {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [recognizing, setRecognizing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [preTranscript, setPreTranscript] = useState("...");

    const [volumeArray, setVolumeArray] = useState(getInitialVolumeArray()); // Initialize bars with zero height 

    useEffect(() => {
        const listener = addSpeechRecognitionListener("result", (event) => {
            if (event.isFinal) {
                setTranscript(transcript + event.results[0]?.transcript);
                setPreTranscript("");
            }
            else {
                setPreTranscript(event.results[0]?.transcript);
            }
        });
        return listener.remove;
    }, [transcript]);

    useSpeechRecognitionEvent("start", () => setRecognizing(true));
    useSpeechRecognitionEvent("end", () => setRecognizing(false));

    // useSpeechRecognitionEvent("audiostart", (event) => {
    //     console.log('audio start ' + event.uri)
    // });
    // useSpeechRecognitionEvent("audioend", (event) => {
    //     console.log('audio end ' + event.uri)
    // });

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const addVolumes = async (nv1, nv2) => {
        await timeout(300);
        volumeArray.shift();
        volumeArray.push(nv1);
        setVolumeArray([...volumeArray]);
        await timeout(300);
        volumeArray.shift();
        volumeArray.push(nv2);
        setVolumeArray([...volumeArray]);
    }

    useSpeechRecognitionEvent("volumechange", (event) => {
        const lastVol = volumeArray[volumeArray.length - 1];
        const currVol = (event.value + 2) / 12;
        const nv1 = (lastVol + currVol) / 2;
        const nv2 = (nv1 + currVol) / 2;
        // volumeArray.shift();
        // volumeArray.shift();
        // volumeArray.push(nv1, nv2);
        // setVolumeArray([...volumeArray]);
        addVolumes(nv1, nv2);
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
            lang: "en-IN",
            interimResults: true,
            maxAlternatives: 1,
            continuous: true,
            requiresOnDeviceRecognition: true,
            addsPunctuation: true,
            androidIntentOptions: {
                EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
                EXTRA_MASK_OFFENSIVE_WORDS: false,
            },
            // recordingOptions: {
            //     persist: true,
            //     outputDirectory: undefined,
            //     outputFileName: "recording.wav",
            // },
            contextualStrings: ["AcadZ"],
            volumeChangeEventOptions: {
                enabled: true,
                intervalMillis: 300,
            },
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.transcriptContainer}>
                <Text>{transcript + preTranscript}</Text>
            </ScrollView>
            <View style={styles.bottomSection}>

                <VolumeMeter volumeArray={volumeArray} style={styles.volumeMeter} />

                {!recognizing ? (
                    <Button mode="contained" onPress={handleStart}> Start </Button>
                ) : (
                    <Button mode="contained" onPress={ExpoSpeechRecognitionModule.stop}> Stop </Button>
                )}
            </View>

        </View>
    );
}

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 8,
    },
    transcriptContainer: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
    },
    bottomSection: {
        paddingBottom: 25,
    },
    volumeMeter: {
        marginBottom: 8,
    }
});
