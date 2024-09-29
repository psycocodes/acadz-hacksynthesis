import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { icons, images } from "../../constants";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useEffect, useState } from 'react';
import { Button, Stylesheet } from 'react-native';
import { FlashcardData } from './flashcards';
import { IconButton } from "react-native-paper";
const name = 'ElectroStatics'


// const FlashCardSession = () => {
//   const question =
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem vitae ut alias, incidunt neque iste nesciunt hic cumque aliquid quas enim dicta ipsa, impedit, suscipit aliquam cupiditate quia velit cum?";
//   const answer = "4";

//   return (
    // <SafeAreaView className="h-full w-full bg-primary">
    //   <View
    //     id="navbar"
    //     className="flex-row justify-between items-center mt-12 mx-8"
    //   >
    //     <Image
    //       className="h-[20px] w-[20px]"
    //       source={icons.leftArrow}
    //       resizeMode="contain"
    //     />
    //   </View>
      // <View className="max-w-full h-3/5 bg-gradient-to-r from-red-500 to-orange-500 mx-8 mt-10 rounded-3xl">
      //     <LinearGradient
      //       colors={["#FDC830", "#F37335"]}
      //       className="w-full h-full rounded-3xl"
      //     >
      //       <ScrollView
      //         contentContainerStyle={{
      //           flexDirection: "column",
      //           minHeight: "100%",
      //           justifyContent: "center",
      //           padding: 15,
      //         }}
      //       >
      //         <Text className="text-white font-psemibold text-lg text-center">
      //           {question}
      //         </Text>
      //       </ScrollView>
      //     </LinearGradient>
      // </View>
//     </SafeAreaView>
//   );
// };

// export default FlashCardSession;

// const styles = StyleSheet.create({});



const FlashcardApp = () => {
  const [flashcards, setFlashcards] = useState(FlashcardData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficultyLevels, setDifficultyLevels] = useState(
    new Array(flashcards.length).fill('')
  );
  
  // State variables to track counts for each difficulty
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [unmarkedCount, setUnmarkedCount] = useState(flashcards.length);
  const [sessionEnded, setSessionEnded] = useState(false);
  const filteredFlashcards = flashcards.filter((_, index) => difficultyLevels[index] !== 'easy');

  useEffect(() => {
    countUnmarkedQuestions(); // Recalculate unmarked questions whenever difficulty levels change
  }, [difficultyLevels]);

  const handleEndSession = () => {
    setSessionEnded(true);
  };

  const handleShowAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleNextCard = () => {
    setShowAnswer(false);

    // Start from the current index and look for the next valid card
    let nextIndex = currentCardIndex + 1;

    console.log(currentCardIndex)
    //console.log(nextIndex);

    // Loop to find the next card that isn't marked as easy
    while (difficultyLevels[nextIndex % flashcards.length] === 'easy') {
        nextIndex++;
    }

    // Ensure we wrap around to the beginning if we go past the end
    if (nextIndex >= flashcards.length) {
      while (difficultyLevels[nextIndex % flashcards.length] === 'easy') {
        nextIndex++;
      }
    }
    // Set the current card index to the next valid card index
    setCurrentCardIndex(nextIndex % flashcards.length);
  };

  const handleResetSession = () => {
    setDifficultyLevels(new Array(flashcards.length).fill(''));
    setEasyCount(0);
    setMediumCount(0);
    setHardCount(0);
    setUnmarkedCount(flashcards.length);
    setSessionEnded(false);
    setCurrentCardIndex(0);
  };
  


  const countUnmarkedQuestions = () => {
    const count = difficultyLevels.filter(level => level === '').length;
    setUnmarkedCount(count);
  };


  const handleDifficulty = (level) => {
    const newDifficultyLevels = [...difficultyLevels];
    const previousLevel = newDifficultyLevels[currentCardIndex];
    newDifficultyLevels[currentCardIndex] = level;
    setDifficultyLevels(newDifficultyLevels);
    
    console.log(`Selected difficulty for card ${currentCardIndex}: ${level}`);

    // Update counts based on the new difficulty and remove the previous one
    if (previousLevel === 'easy') {
      setEasyCount((prev) => prev - 1);
    } else if (previousLevel === 'medium') {
      setMediumCount((prev) => prev - 1);
    } else if (previousLevel === 'hard') {
      setHardCount((prev) => prev - 1);
    }

    // Update counts based on the selected difficulty
    switch (level) {
      case 'easy':
        setEasyCount((prev) => prev + 1);
        break;
      case 'medium':
        setMediumCount((prev) => prev + 1);
        break;
      case 'hard':
        setHardCount((prev) => prev + 1);
        break;
      default:
        break;
    }

    countUnmarkedQuestions();

    // Check if all questions are rated as easy
    if (newDifficultyLevels.every((l) => l === 'easy')) {
      console.log('Session ended. All cards rated as easy!');
      setSessionEnded(true);
    }
  };

  return (
          <SafeAreaView className="h-full w-full bg-primary">
      <View
        id="navbar"
        className="flex-row justify-between items-center mt-12 mx-8"
      >
        <Image
          className="h-[20px] w-[20px]"
          source={icons.leftArrow}
          resizeMode="contain"
        />
      </View>
      {filteredFlashcards.length > 0 && !sessionEnded ? (
        <>
          <Text className='text-gray-500 font-plight text-s text-center mt-2'>
            Currently Marked: {difficultyLevels[currentCardIndex] || 'Unmarked'}
          </Text>
          {/* <Text style={styles.question}>
            {flashcards[currentCardIndex].Question}
          </Text> */}
          <View className="max-w-full h-1/2 bg-gradient-to-r from-red-500 to-orange-500 mx-8 mt-2 rounded-3xl">
          <LinearGradient
            colors={["#FDC830", "#F37335"]}
            className="w-full h-full rounded-3xl"
          >
            <ScrollView
              contentContainerStyle={{
                flexDirection: "column",
                minHeight: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 15,
              }}
            >
              <Text className="text-white font-psemibold text-lg text-center">
              {showAnswer ? flashcards[currentCardIndex].Question : flashcards[currentCardIndex].Answer}
              </Text>
            </ScrollView>
          </LinearGradient>
      </View>
          {/* {showAnswer && (
            <Text style={styles.answer}>
              {flashcards[currentCardIndex].Answer}
            </Text>
          )} */}
          {/* <Button title="Show Answer" onPress={handleShowAnswer} />
          <Button title="Next Card" onPress={handleNextCard} /> */}
  
          {/* Difficulty Buttons */}
          <View className="flex-column mx-1">
            <View className="">
              <View style={styles.buttonContainer} className=' flex flex-row justify-center items-center mt-5 px-5'>
              <TouchableOpacity
                onPress={() => handleDifficulty('easy')}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-green-400 px-3 py-2`}
              >
                <Text className='text-green-100 font-psemibold text-xs'> Easy </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>handleDifficulty('medium')}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-yellow-400 px-3 py-2`}
              >
                <Text className='text-yellow-100 font-psemibold text-xs'> Mid </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDifficulty('hard')}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-red-400 px-3 py-2`}
              >
                <Text className='text-red-100 font-psemibold text-xs'> Hard </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDifficulty('hard')}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-gray-400 px-3 py-2`}
              >
                <Text className='text-gray-100 font-psemibold text-xs'> Next </Text>
              </TouchableOpacity>
            </View>
            <View className="mx-5">
              <TouchableOpacity
                onPress={handleEndSession}
                activeOpacity={0.7}
                className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-gray-400 `}
              >
                <IconButton
                    icon='stop'
                    iconColor='#FF3B30'
                    size={30}
                  />
                <Text className='text-gray-100 font-psemibold text-xs'> End Session </Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
  
          {/* Difficulty Counters */}
          {/* <View style={styles.counterContainer}>
            <Text>Easy: {easyCount}</Text>
            <Text>Medium: {mediumCount}</Text>
            <Text>Hard: {hardCount}</Text>
            <Text>Unmarked: {unmarkedCount}</Text>
          </View> */}
  

        </> 
      ) : (
        <View className='flex flex-col mt-20'>
          <Text className='text-gray-100 font-pbold text-2xl text-center'>Session Ended</Text>
          <Text className='text-gray-400 font-pbold text-l text-center'>{name}</Text>
          <Text className='text-gray-200 font-pmedium text-l text-center'>Your Performance:</Text> 
          <Text className='text-green-500 font-plight text-s text-center'>Easy: {easyCount}</Text>
          <Text className='text-yellow-500 font-plight text-s text-center'>Medium: {mediumCount}</Text>
          <Text className='text-red-500 font-plight text-s text-center'>Hard: {hardCount}</Text>
          <Text className='text-gray-500 font-plight text-s text-center'>Unmarked: {unmarkedCount}</Text>
          <View className="">
            <TouchableOpacity
              onPress={() => {
                setSessionEnded(false);
                setCurrentCardIndex(0); // Reset the index when resuming
              }}
              activeOpacity={0.7}
              className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-gray-400 px-3 py-2 mx-10 mt-7`}
            >
                              <IconButton
                      icon='play-circle-outline'
                      iconColor='#4CAF50'
                      size={30}
                    />
              <Text className='text-gray-100 font-psemibold text-xs'>Resume Session</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleResetSession}
            activeOpacity={0.7}
            className={`rounded-xl min-h-[62px] min-w-[72px] flex flex-row justify-center items-center border border-gray-400 px-3 py-2 mx-10 mt-3`}
          >
                            <IconButton
                    icon='rewind-outline'
                    iconColor='#FF3B30'
                    size={30}
                  />
            <Text className='text-gray-100 font-psemibold text-xs'>Reset Session</Text>
          </TouchableOpacity>
          {/* <Text>Session Ended</Text>
          <Text>Easy: {easyCount}</Text>
          <Text>Medium: {mediumCount}</Text>
          <Text>Hard: {hardCount}</Text>
          <Text>Unmarked: {unmarkedCount}</Text>
          <Button title="Resume Session" onPress={() => {
            setSessionEnded(false);
            setCurrentCardIndex(0); // Reset the index when resuming
          }} />
          <Button title="Reset Session" onPress={handleResetSession} /> */}
        </View>
/******  ec4bc1ce-4cd8-4a29-b62b-13fee61351a1  *******/
      )}
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
  },
  answer: {
    fontSize: 20,
    marginBottom: 20,
    color: 'green',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  counterContainer: {
    marginTop: 20,
  },
});

export default FlashcardApp;

