import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { ActivityIndicator, Modal, Portal, Provider } from 'react-native-paper';
const YoutubeToTranscript = () => {
    const [youtubeLink, setYoutubeLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [videoDetails, setVideoDetails] = useState(null);
    const [infoFetched, setInfoFetched] = useState(false);


    const getVideoID = (url) => {
        const videoIDMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?/);
        return videoIDMatch ? videoIDMatch[1] : null;
    };

    const fetchVideoDetails = async (videoId) => {
        const apiKey = process.env.CLOUD_CONSOLE_API_KEY; // Replace with your actual API key
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;

        setLoadingInfo(true); // Start loading state for video info
        try {
            const response = await axios.get(url);
            const videoData = response.data.items[0]?.snippet;

            if (videoData) {
                setVideoDetails({
                    title: videoData.title,
                    thumbnail: videoData.thumbnails.high.url,
                    channelTitle: videoData.channelTitle,
                });
                setInfoFetched(true);
            } else {
                console.log("No video details found.");
                setVideoDetails(null);
            }
        } catch (error) {
            console.error("Error fetching video details:", error);
            setVideoDetails(null);
        } finally {
            setLoadingInfo(false); // End loading state for video info
        }
    };

    const getTranscript = async () => {
        setLoading(true);
        const tdata = await fetchTranscript();
        // const tdata = await fetchTranscript2();
        
        setLoading(false);
        router.push({ pathname: '../transcript', params: { transcript: tdata } });
    }

    const fetchTranscript2 = async () => {
        return "Sample transcript for:" + youtubeLink;
    }

    const fetchTranscript = async () => {
        const videoId = getVideoID(youtubeLink);

        if (!videoId) {
            return "Invalid YouTube URL";
        }

        setVideoDetails(null); // Reset video details when fetching new link

        try {
            await fetchVideoDetails(videoId);

            const options = {
                method: 'GET',
                url: 'https://youtube-transcripts.p.rapidapi.com/youtube/transcript',
                params: {
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                },
                headers: {
                    'x-rapidapi-key': process.env.RAPID_API_KEY, // Replace with your actual API key
                    'x-rapidapi-host': 'youtube-transcripts.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);

            if (response.data.content && response.data.content.length > 0) {
                const transcriptText = response.data.content
                    .map(segment => segment.text)
                    .join(' ');

                return transcriptText;
            } else {
                return "Transcript not available";
            }
        } catch (error) {
            console.error("Error fetching transcript:", error.response ? error.response.data : error.message);
            return "Error fetching transcript";
        }
    };

    return (
        <Provider>
            <SafeAreaView className=' h-full w-full bg-primary'>
                <View style={styles.container}>
                    <Text>Enter video link:</Text>
                    <TextInput
                        style={styles.input}
                        value={youtubeLink}
                        onChangeText={text => {
                            setYoutubeLink(text);
                        }}
                    />
                    <Button title="Show Video Info" onPress={() => fetchVideoDetails(getVideoID(youtubeLink))} disabled={loadingInfo} />
                    <Button title="Generate Transcript" onPress={getTranscript} disabled={!infoFetched || loading} />
                    {videoDetails && (
                        <View style={styles.videoInfoContainer}>
                            <Image source={{ uri: videoDetails.thumbnail }} style={styles.thumbnail} />
                            <Text style={styles.title}>{videoDetails.title}</Text>
                            <Text style={styles.channel}>By: {videoDetails.channelTitle}</Text>
                        </View>
                    )}
                    <Portal>
                        <Modal visible={loading} dismissable={false} contentContainerStyle={styles.modal}>
                            <ActivityIndicator animating={true} size="large" />
                            <Text style={styles.loadingText}>Loading... </Text>
                        </Modal>
                    </Portal>
                </View>
            </SafeAreaView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    videoInfoContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 5,
    },
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    channel: {
        fontSize: 14,
        color: 'gray',
    },
    transcriptBox: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 5,
    },
    loadingText: {
        marginTop: 20,
        fontStyle: 'italic',
    },
});

export default YoutubeToTranscript;
