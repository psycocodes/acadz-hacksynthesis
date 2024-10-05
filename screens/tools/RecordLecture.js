import { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import axios from "axios";
import { View } from "react-native";
import { ActivityIndicator, Modal, Portal, Button, Text, TextInput, useTheme } from "react-native-paper";

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

    const [transcript, setTranscript] = useState("Transcript");
    const [audioUrl, setAudioUrl] = useState(""); // State for audio URL
    const [loading, setLoading] = useState(false);

    const handleTranscription = async () => {
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

    return (
        <View style={styles.container}>
            <TextInput
                mode='outlined'
                value={audioUrl}
                onChangeText={setAudioUrl}
                label="Enter audio file URL"
                style={styles.urlText}
            />
            <Button mode='contained' onPress={handleTranscription}>
                Start Transcription
            </Button>
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
        paddingHorizontal: 16,
    },
    urlText: {
        marginVertical: 16,
        marginHorizontal: 8,
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