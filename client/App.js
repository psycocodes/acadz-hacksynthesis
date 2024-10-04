import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';

// Importing Screens
import WelcomeScreen from './app/Welcome';
import HomeScreen from './app/Home';
// import NotebookScreen from './screens/Notebook';

// import RecordLectureScreen from './screens/RecordLecture';
// import ScanDocumentScreen from './screens/ScanDoc';
// import UploadDocumentScreen from './screens/UploadDoc';
// import YoutubeTranscriptScreen from './screens/YoutubeTranscript';

// import TranscriptScreen from './screens/Transcript';
// import SummaryScreen from './screens/Summary';
// import FlashcardsScreen from './screens/Flashcards';
// import YoutubeSuggestionsScreen from './screens/YoutubeSuggestions';

// import FlashcardSessionScreen from './screens/FlashcardSession';
// import FlashcardSessionReportScreen from './screens/FlashcardSessionReport';

const Stack = createStackNavigator();

export default function App() {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    {/* <Stack.Screen name="Notebook" component={NotebookScreen} />
                    
                    <Stack.Screen name="RecordLecture" component={RecordLectureScreen} />
                    <Stack.Screen name="ScanDocument" component={ScanDocumentScreen} />
                    <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} />
                    <Stack.Screen name="YoutubeTranscript" component={YoutubeTranscriptScreen} />
                    
                    <Stack.Screen name="Transcript" component={TranscriptScreen} />
                    <Stack.Screen name="Summary" component={SummaryScreen} />
                    <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
                    <Stack.Screen name="YoutubeSuggestions" component={YoutubeSuggestionsScreen} />
                    
                    <Stack.Screen name="FlashcardSession" component={FlashcardSessionScreen} />
                    <Stack.Screen name="FlashcardSessionReport" component={FlashcardSessionReportScreen} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
