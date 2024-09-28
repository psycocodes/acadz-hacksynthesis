
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput, Alert } from 'react-native';
import { Provider, Text, Button  } from 'react-native-paper';

const TranscriptScreen = () => {
    const [editingMode, setEditingMode] = useState(false);
    const [editedTranscript, setEditedTranscript] = useState('');
    const [transcript, setTranscript] = useState(useLocalSearchParams().transcript);
    if (!transcript) Alert.alert('Transcript loading failed!');

    const startEdit = () => {
        setEditedTranscript(transcript);
        setEditingMode(true);
    }
    const confirmEdit = () => {
        setTranscript(editedTranscript);
        setEditedTranscript('');
        setEditingMode(false);
    }
    const cancelEdit = () => {
        setEditedTranscript('');
        setEditingMode(false);
    }
    const summarize = () => {
        router.push({ pathname: '../summary', params: { transcript: transcript } });
    }
    const flashcards = () => {
        router.push({ pathname: '../flashcards', params: { transcript: transcript } });
    }

    return (
        <Provider>
            <View style={styles.mainView}>
                <Text style={styles.title}>View Transcript</Text>
                <View style={styles.containerMain}>
                    {!editingMode &&
                        <ScrollView contentContainerStyle={styles.container}>
                            <Text style={styles.data}>
                                {transcript}
                            </Text>
                        </ScrollView>}
                    {editingMode &&
                        <TextInput
                            style={styles.textEditor}
                            label="Edit Transcript"
                            value={editedTranscript}
                            onChangeText={setEditedTranscript}
                            multiline={true}
                            textAlignVertical='top'>
                        </TextInput>}
                </View>
                <View style={styles.containerTools}>
                    {!editingMode &&
                        <Button mode="outlined" style={styles.specialButton} onPress={startEdit}>
                            Edit Transcript
                        </Button>}
                    {editingMode &&
                        <View style={styles.editOptions}>
                            <Button mode="outlined" style={styles.specialButton}  onPress={cancelEdit}>
                                Cancel
                            </Button>
                            <Button mode="outlined" style={styles.specialButton}  onPress={confirmEdit}>
                                Confirm
                            </Button>
                        </View>
                    }
                    <Button mode="contained" disabled={editingMode} onPress={summarize}>
                        Summarize
                    </Button>
                    <Button mode="contained" disabled={editingMode} onPress={flashcards}>
                        Flashcards
                    </Button>
                    <Button mode="contained" disabled={editingMode}>
                        Youtube video suggestions
                    </Button>
                </View>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingBottom: 8,
    },
    containerMain: {
        padding: 4,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        margin: 6,
        marginTop: 0,
        flex: 1,
    },
    container: {
        padding: 12,
    },
    containerTools: {
        gap: 8,
        padding: 8,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 12,
    },
    data: {
        fontSize: 16,
        marginBottom: 8,
    },
    textEditor: {
        backgroundColor: '#eee',
        flex:1,
        padding: 4,
    },
    editOptions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    specialButton: {
        borderColor: 'black',
    }
});

export default TranscriptScreen;

