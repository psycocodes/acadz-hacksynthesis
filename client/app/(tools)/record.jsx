import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from "axios";
import { Text, View, TextInput, Button } from "react-native";
import { router } from "expo-router";
import { ActivityIndicator, Modal, Portal, Provider } from "react-native-paper";


async function sendForTranscription(audioUrl, setter) {
  const API_KEY = "f700b044cbb6434bbc4409f4315cd8c6";
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
          authorization: API_KEY,
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
            authorization: API_KEY,
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

export default function AudioRecorder() {
  const [transcript, setTranscript] = useState("Transcript");
  const [audioUrl, setAudioUrl] = useState(""); // State for audio URL
  const [loading, setLoading] = useState(false);

  const handleTranscription = async () => {
    if (audioUrl) {
      setLoading(true);
      const data = await sendForTranscription(audioUrl, setTranscript);
      setLoading(false);
      router.push({ pathname: "../transcript", params: { transcript: data } });
    } else {
      console.error("Please enter a valid audio URL");
    }
  };

  return (
    <Provider>
      <SafeAreaView className="h-full w-full bg-primary">
        <View style={{ padding: 20 }}>
          <Text className="text-white font-psemibold text-lg">Enter Audio URL</Text>
          <TextInput
            value={audioUrl}
            onChangeText={setAudioUrl}
            style={{
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              padding: 8,
            }}
            className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-green-400 px-3 py-2 text-gray-100 font-psemibold text-xs`}
          />
          {/* <Button title="Start Transcription" onPress={handleTranscription} /> */}
          <TouchableOpacity
                onPress={() => handleDifficulty('easy')}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-green-400 px-3 py-2`}
              >
                <Text className='text-green-100 font-psemibold text-xs'> Start Transcription </Text>
              </TouchableOpacity>
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
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
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