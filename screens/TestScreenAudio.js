import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
    addSpeechRecognitionListener,
} from "expo-speech-recognition";

import Svg, { Rect } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const BAR_COUNT = 50;  // Number of bars for the meter
const BAR_WIDTH = 300 / BAR_COUNT * 0.5;

// Helper function to generate random volume changes (you'll replace this with actual data)
const getVolumeLevels = (maxLevel) => {
    const levels = [];
    for (let i = 0; i < BAR_COUNT; i++) {
        levels.push(Math.random() * maxLevel);
    }
    return levels;
};

// need to make changes for Android 12 and below (make it continuous)
export default function TestScreenAudio() {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [recognizing, setRecognizing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [preTranscript, setPreTranscript] = useState("...");
    // const [volume, setVolume] = useState(0);

    const [bars, setBars] = useState(getVolumeLevels(1)); // Initialize bars with zero height new Array(BAR_COUNT).fill(0)

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
    useSpeechRecognitionEvent("volumechange", (event) => {
        // console.log("Volume changed to:", event.value);
        const vol = (event.value + 2) / 12;
        // setVolume(vol);
        bars.shift();
        bars.push(vol);
        setBars([...bars]);
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

                <Svg height="100" width="100%" viewBox="0 0 300 100" style={styles.svg}>
                    {bars.map((value, index) => {
                        // Animate the height of each bar
                        const animatedProps = useAnimatedProps(() => ({
                            height: value * 80,
                            y: (100 - value * 80) / 2,  // Adjust Y to grow from bottom to top
                        }));

                        return (
                            <AnimatedRect
                                key={index}
                                x={index * 300 / BAR_COUNT}
                                width={BAR_WIDTH}
                                animatedProps={animatedProps}
                                fill="white"
                            />
                        );
                    })}
                </Svg>

                {!recognizing ? (
                    <Button mode="contained" onPress={handleStart}> Start </Button>
                ) : (
                    <Button mode="contained" onPress={ExpoSpeechRecognitionModule.stop}> Stop </Button>
                )}
            </View>

        </View>
    );
}

// Animated rectangle for each volume bar
const AnimatedRect = Animated.createAnimatedComponent(Rect);

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
        // borderWidth: 1,
        // borderColor: 'red',
        // paddingTop: 15,
        paddingBottom: 35,
    },
    progress: {
        marginBottom: 15,
    },
    svg: {
        // backgroundColor: '#0000ff'
    }
});
