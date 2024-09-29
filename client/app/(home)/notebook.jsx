import { Image, SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants/";
import { router, useLocalSearchParams } from "expo-router";
import { Button, IconButton } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotebookScreen = () => {
    const {path} = useLocalSearchParams();
    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState(null);
    const [ytsugg, setYtsugg] = useState(null);


    const loadDatas = async () => {
        try {
            const data = await AsyncStorage.getItem(path);
            const parsedData = data ? JSON.parse(data) : {};
            if (!('transcript' in parsedData)) return;

            setTranscript(parsedData.transcript);
            if ('summary' in parsedData) {
                setSummary(parsedData.summary);
            }
            if ('flashcards' in parsedData) {
                setFlashcards(parsedData.flashcards);
            }
            if ('ytsugg' in parsedData) {
                setYtsugg(parsedData.ytsugg);
            }
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };
    return (
        <SafeAreaView className="h-full w-full bg-primary">
            <View
                style={styles.navbar}
            >
                <Image
                    className="h-[30px] w-[30px]"
                    source={icons.leftArrow}
                    resizeMode="contain"
                />

                <View className="flex-row items-center gap-7">
                    <Image
                        className="h-[30px] w-[10px]"
                        source={icons.menu}
                        resizeMode="contain"
                    />
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <IconButton
                icon="microphone-variant"
                size={42}
                onPress={() => router.push("/record")}
                iconColor="#ffaa00"
                containerColor="#99999955"
                />
                <IconButton
                icon="line-scan"
                size={42}
                onPress={() => router.push("/scan-doc")}
                iconColor="#ffaa00"
                containerColor="#99999955"
                />
                <IconButton
                icon="youtube"
                size={42}
                onPress={() => router.push("/upload-yt")}
                iconColor="#ffaa00"
                containerColor="#99999955"
                />
                <IconButton
                icon="file-pdf-box"
                size={42}
                onPress={() => router.push("/upload-doc")}
                iconColor="#ffaa00"
                containerColor="#99999955"
                />
            </View>
            
            <View style={styles.otherContainer}>
                {!transcript &&
                    <Text style={styles.helpText}>
                        Choose any of the above options to create transcript/content
                        {'\n'}{'\n'}
                        Then you can use it to generate Summary, Flashcards, Youtube Suggestions
                    </Text>
                }
                {transcript &&
                    <Button
                    mode="contained"
                    style={styles.button1}>
                        Transcript
                    </Button>
                }
                {transcript && summary &&
                    <Button
                    mode="contained"
                    style={styles.button1}>
                        Summary
                    </Button>
                }
                {transcript && flashcards &&
                    <Button
                    mode="contained"
                    style={styles.button1}>
                        Flashcards
                    </Button>
                }
                {transcript && ytsugg &&
                    <Button
                    mode="contained"
                    style={styles.button1}>
                        Youtube Suggestions
                    </Button>
                }
                {transcript && !summary &&
                    <Button
                    mode="outlined"
                    style={styles.button2}>
                        Generate Summary
                    </Button>
                }
                {transcript && !flashcards &&
                    <Button
                    mode="outlined"
                    style={styles.button2}>
                        Generate Flashcards
                    </Button>
                }
                {transcript && !ytsugg &&
                    <Button
                    mode="outlined"
                    style={styles.button2}>
                        Get Youtube Suggestions
                    </Button>
                }
            </View>
        </SafeAreaView >
    );
};

export default NotebookScreen;

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 8,
        marginBottom: 8,
        // borderWidth: 1,
        // borderColor: 'white',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 5,
        paddingTop: 15,
        paddingHorizontal: 15,
        // borderWidth: 1,
        // borderColor: 'white',
    },
    otherContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 15,
        paddingTop: 40,
        paddingHorizontal: 14,
        alignItems: 'stretch',
    },
    button1: {
        marginHorizontal: 34,
    },
    button2: {
        marginHorizontal: 34,
        backgroundColor: '#99999922'
    },
    helpText: {
        color: '#946300',
        paddingHorizontal: 8,
        textAlign: 'center',
    }
});
