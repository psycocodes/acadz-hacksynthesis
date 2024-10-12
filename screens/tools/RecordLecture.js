import axios from "axios";
import { ActivityIndicator, Modal, Portal, Button, Text, TextInput, useTheme, IconButton } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
    addSpeechRecognitionListener,
} from "expo-speech-recognition";

import VolumeMeter, { getInitialVolumeArray } from "../../components/VolumeMeter";

async function sendForTranscription(audioUrl, setter) {
    try {
        //const FILE_URL = 'https://assets.editor.p5js.org/5f5b9204e713f0002451fa37/d865c743-da58-4bdc-8911-02a8a0d52330.mp3';

        const FILE_URL = audioUrl;
        const transcriptionResponse = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            {
                audio_url: FILE_URL,
            },
            {
                headers: {
                    authorization: process.env.ASSEMBLY_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        const transcriptId = transcriptionResponse.data.id;
        console.log("Transcription requested, ID:", transcriptId);

        // Step 3: Poll for transcription result
        let isTranscribed = false;
        let transcriptData;

        while (!isTranscribed) {
            const transcriptResult = await axios.get(
                `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                {
                    headers: {
                        authorization: process.env.ASSEMBLY_API_KEY,
                    },
                }
            );

            if (transcriptResult.data.status === "completed") {
                isTranscribed = true;
                transcriptData = transcriptResult.data.text;
                setter(transcriptData);
                console.log("Transcription completed:", transcriptData);
            } else if (transcriptResult.data.status === "failed") {
                console.error("Transcription failed:", transcriptResult.data.error);
                break;
            } else {
                console.log("Transcription in progress...");
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
            }
        }

        return transcriptData;
    } catch (error) {
        console.error("Error during transcription:", error);
    }
}

export default function RecordLectureScreen({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [loading, setLoading] = useState(false);

    const [transcribeFromUrl, setTranscribeFromUrl] = useState(false);
    const [audioUrl, setAudioUrl] = useState(""); // State for audio URL

    const [recognizing, setRecognizing] = useState(false);
    const [shouldRecognize, setShouldRecognize] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [preTranscript, setPreTranscript] = useState("");
    const [volumeArray, setVolumeArray] = useState(getInitialVolumeArray()); // Initialize bars with zero height 


    const handleTranscriptionFromUrl = async () => {
        if (audioUrl) {
            setLoading(true);
            const data = await sendForTranscription(audioUrl, setTranscript);
            setLoading(false);
            navigation.navigate('Transcript', { transcript: data });
            // router.push({ pathname: "../transcript", params: { transcript: data } });
        } else {
            console.error("Please enter a valid audio URL");
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<IconButton
                icon={transcribeFromUrl ? "microphone" : "link"}
                iconColor={theme.colors.onPrimaryContainer}
                disabled={transcript !== '' || shouldRecognize || recognizing}
                onPress={() => setTranscribeFromUrl(!transcribeFromUrl)}
            />)
        });
    }, [transcript, shouldRecognize, recognizing, transcribeFromUrl]);

    useEffect(() => {
        const resultListener = addSpeechRecognitionListener("result", (event) => {
            // console.log(event.isFinal, event.results[0]);
            if (event.isFinal) {
                setTranscript(transcript + event.results[0]?.transcript);
                setPreTranscript("");
            }
            else {
                setPreTranscript(event.results[0]?.transcript);
            }
        });
        return resultListener.remove;
    }, [transcript]);

    useEffect(() => {
        const errorListener = addSpeechRecognitionListener("error", (event) => {
            setTranscript(transcript + preTranscript);
            setPreTranscript("");
            console.log("error code:", event.error, "error messsage:", event.message);
        });
        return errorListener.remove;
    }, [transcript, preTranscript]);

    useSpeechRecognitionEvent("start", () => setRecognizing(true));
    useSpeechRecognitionEvent("end", () => setRecognizing(false));

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
        addVolumes(nv1, nv2);
    });

    const handleStart = async () => {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            console.warn("Permissions not granted", result);
            Alert.alert("Permissions not granted", result.toString());
            return;
        }
        setShouldRecognize(true);

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
    const handlePause = async () => {
        setShouldRecognize(false);
        ExpoSpeechRecognitionModule.stop();
    }
    const handleDone = async () => {
        navigation.navigate('Transcript', { transcript: transcript });
    }

    return (
        <View style={styles.container}>
            {transcribeFromUrl ? (
                <>
                    <TextInput
                        mode='outlined'
                        value={audioUrl}
                        onChangeText={setAudioUrl}
                        label="Enter audio file URL"
                        style={styles.urlText}
                    />
                    <Button mode='contained' onPress={handleTranscriptionFromUrl}>
                        Start Transcription from URL
                    </Button>
                </>
            ) : (
                <>
                    <ScrollView style={styles.transcriptContainer}>
                        <Text>{transcript + preTranscript}</Text>
                    </ScrollView>
                    <View style={styles.bottomSection}>

                        <VolumeMeter volumeArray={volumeArray} style={styles.volumeMeter} />

                        <View style={styles.bottomButtonsContainer}>
                            {!recognizing ? (
                                <Button
                                    mode="contained"
                                    icon="play"
                                    style={styles.bottomButtons}
                                    onPress={handleStart}
                                    disabled={shouldRecognize}>
                                    {transcript === '' ? 'Start' : 'Resume'}
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    icon="pause"
                                    style={styles.bottomButtons}
                                    onPress={handlePause}
                                    disabled={!shouldRecognize}>
                                    Pause
                                </Button>
                            )}
                            <Button
                                mode="contained"
                                icon="check"
                                style={styles.bottomButtons}
                                onPress={handleDone}
                                disabled={recognizing || shouldRecognize || transcript === ''}>
                                Done
                            </Button>
                        </View>
                    </View>
                </>
            )
            }

            <Portal>
                <Modal
                    visible={loading}
                    dismissable={false}
                    contentContainerStyle={styles.modal}
                >
                    <ActivityIndicator animating={true} size="large" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </Modal>
            </Portal>
        </View>
    );
}

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 8,
    },
    urlText: {
        marginBottom: 16,
        marginHorizontal: 8,
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
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 8,
    },
    bottomButtons: {
        flex: 1,
    },

    modal: {
        backgroundColor: theme.colors.background,
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
});