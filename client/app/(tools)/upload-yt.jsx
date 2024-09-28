import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const YoutubeToTranscript = () => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [transcript, setTranscript] = useState('');
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

  const fetchTranscript = async () => {
    const videoId = getVideoID(youtubeLink);
    
    if (!videoId) {
      setTranscript("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    setTranscript(''); // Reset transcript when fetching new link
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

        setTranscript(transcriptText);
      } else {
        setTranscript("Transcript not available");
      }
    } catch (error) {
      console.error("Error fetching transcript:", error.response ? error.response.data : error.message);
      setTranscript("Error fetching transcript");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter video link:</Text>
      <TextInput
        style={styles.input}
        value={youtubeLink}
        onChangeText={text => {
          setYoutubeLink(text);
          setTranscript(''); // Clear transcript when changing link
        }}
      />
      <Button title="Show Video Info" onPress={() => fetchVideoDetails(getVideoID(youtubeLink))} disabled={loadingInfo} />
      <Button title="Generate Transcript" onPress={fetchTranscript} disabled={!infoFetched || loading} />

      {videoDetails && (
        <View style={styles.videoInfoContainer}>
          <Image source={{ uri: videoDetails.thumbnail }} style={styles.thumbnail} />
          <Text style={styles.title}>{videoDetails.title}</Text>
          <Text style={styles.channel}>By: {videoDetails.channelTitle}</Text>
        </View>
      )}

      {/* {loading ? (
        <Text style={styles.loadingText}>Generating transcript...</Text>
      ) : (
        <ScrollView style={styles.transcriptBox}>
          <Text>{transcript}</Text>
        </ScrollView>
      )} */}
    </View>
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
