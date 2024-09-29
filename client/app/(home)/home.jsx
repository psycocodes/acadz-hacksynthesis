import { Alert, BackHandler, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { icons, images } from "../../constants/";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, IconButton, Provider } from "react-native-paper";
import AddNewDialog from "../../components/AddNewDialog";


const EmptyContent = ({ onAdd }) => {
    const dialog = useRef(null);
    return <View>
        <Image
            className="h-[200px] w-full"
            source={images.noFiles}
            resizeMode="contain"
        />
        <Text className=" text-gray-100 font-plight text-s px-10 text-center pb-5">
            Click on the buttons to Add a NoteBook or a Group.
        </Text>
        <View className="flex-row justify-center items-center mt-8 gap-2">
            <View className=" flex flex-col justify-center items-center gap-2">
                <TouchableOpacity
                    onPress={() => {
                        dialog.current.showDialog();
                        dialog.current.create(TYPE_NOTEBOOK);
                    }}
                    activeOpacity={0.7}
                    className={`rounded-xl min-h-[62px] flex flex-row justify-center items-center p-10 border border-gray-100`}
                >
                    <Image
                        className="h-[70px] w-[70px]"
                        source={images.notebookCreate}
                        resizeMode="contain"
                        tintColor="#f3f4f6"
                    />
                </TouchableOpacity>
                <Text className=' text-center text-gray-100'>Add Notebook</Text>
            </View>
            <View className="flex flex-col justify-center items-center gap-2">
                <TouchableOpacity
                    // onPress={() => router.push("/question")}
                    onPress={() => {
                        dialog.current.showDialog();
                        dialog.current.create(TYPE_GROUP);
                    }}
                    activeOpacity={0.7}
                    className={`rounded-xl min-h-[62px] flex flex-row justify-center items-center p-10 border border-gray-100`}
                >
                    <Image
                        className="h-[70px] w-[70px]"
                        source={images.groupCreate}
                        resizeMode="contain"
                        tintColor="#f3f4f6"
                    />
                </TouchableOpacity>
                <Text className="text-center text-gray-100">Add Group</Text>
            </View>
        </View>
        <AddNewDialog ref={dialog} onDone={onAdd} />
    </View>
}


const FilledContent = ({ items, onItemPress, onAdd }) => {
    const dialog = useRef(null);
    return <View style={{ flex: 1 }}>
        <FlatList
            data={items}
            renderItem={({ item }) => (
                <View className="mb-3 mt-2 mx-5 rounded-2xl flex-row items-center justify-around p-2 pr-4 border border-gray-100">
                    <TouchableOpacity
                        onPress={() => onItemPress(item)}
                        activeOpacity={0.7}
                        className={`flex-row items-center mx-4 mr-6`}
                    >
                        <IconButton
                            icon={
                                item.type === "notebook"
                                    ? "notebook-outline"
                                    : "folder-outline"
                            }
                            iconColor={item.type === "notebook" ? "#6200EE" : "#03DAC6"}
                            size={30}
                        />
                        <ScrollView horizontal={true}>
                            <Text className=" text-white font-pmedium text-sm">
                                {item.name}
                            </Text>
                        </ScrollView>
                    </TouchableOpacity>
                    <IconButton icon="play" iconColor="#F5F5F5" size={30} />
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
        <FAB
            style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
            icon="plus"
            label="Add"
            onPress={() => dialog.current.showDialog()} />
        <AddNewDialog ref={dialog} onDone={onAdd} />
    </View>;
}

const ROOT_PATH = '/root/';
const TYPE_NOTEBOOK = 'notebook';
const TYPE_GROUP = 'group';

const Home = () => {
    const [currentPath, setCurrentPath] = useState(ROOT_PATH);  // Start at root
    const [groups, setGroups] = useState([]);
    const [notebooks, setNotebooks] = useState([]);

    const emptyPage = groups.length === 0 && notebooks.length === 0;
    const items = [];
    if (!emptyPage) {
        for (let i = 0; i < groups.length; i++) {
            items.push({ 'name': groups[i], 'type': TYPE_GROUP })
        }
        for (let i = 0; i < notebooks.length; i++) {
            items.push({ 'name': notebooks[i], 'type': TYPE_NOTEBOOK })
        }
    }

    useEffect(() => {
        loadList(currentPath);
    }, [currentPath]);

    const goBack = () => {
        console.log('on back clicked, curr: ' + currentPath);
        if (currentPath === ROOT_PATH) return false;  // If at root, can't go back

        console.log('on back clicked 2');
        const paths = currentPath.split('/').filter(Boolean);
        paths.pop(); // Remove the last group
        setCurrentPath(paths.length ? `/${paths.join('/')}/` : ROOT_PATH); // If empty, go back to root
        return true;
    };
    // useEffect(() => {

    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         goBack
    //     );
    //     return () => backHandler.remove(); // Cleanup on unmount
    // }, []);

    const loadList = async (path) => {
        try {
            const storedGroups = await AsyncStorage.getItem(path);
            const storedNotebooks = await AsyncStorage.getItem(`${path}_notebooks`); // Use a different key for notebooks
            // group name cant be '_notebooks'
            if (storedGroups !== null) setGroups(JSON.parse(storedGroups));
            else setGroups([]);

            if (storedNotebooks !== null) setNotebooks(JSON.parse(storedNotebooks));
            else setNotebooks([]);
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    const onAdd = (name, type) => {
        if (type === TYPE_NOTEBOOK) addNotebook(name);
        else addGroup(name);
    };

    const addNotebook = async (name) => {
        //validity checks
        name = name.trim();
        if (!name) {
            Alert.alert('Error', 'Notebook name cannot be empty');
            return;
        }

        try {
            if (notebooks.includes(name)) {
                Alert.alert('Error', 'Notebook already exists!');
                return;
            }

            const updatedNotebooks = [...notebooks, name];
            await AsyncStorage.setItem(`${currentPath}_notebooks`, JSON.stringify(updatedNotebooks));
            setNotebooks(updatedNotebooks);
        } catch (e) {
            console.error('Failed to create notebook', e);
            Alert.alert('Error', 'Error while creating notebook!');
        }
    }
    const addGroup = async (name) => {
        //validity checks
        name = name.trim();
        if (!name) {
            Alert.alert('Error', 'Group name cannot be empty');
            return;
        }

        try {
            if (groups.includes(name)) {
                Alert.alert('Error', 'Group already exists!');
                return;
            }

            const updatedGroups = [...groups, name];
            await AsyncStorage.setItem(currentPath, JSON.stringify(updatedGroups));
            setGroups(updatedGroups);
        } catch (e) {
            console.error('Failed to create Group', e);
            Alert.alert('Error', 'Error while creating Group!');
        }
    }

    const onItemPress = (item) => {
        if (item.type === TYPE_NOTEBOOK) {
            openNotebook(item.name);
        } else {
            openGroup(item.name);
        }
    }

    // Open a group (navigate into it)
    const openGroup = (groupName) => {
        setCurrentPath(`${currentPath}${groupName}/`);
    };

    const openNotebook = (notebookName) => {
        console.log('open notebook: ' + notebookName);
    };
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear(); // Clears AsyncStorage
            setGroups([]);  // Reset groups state to an empty array
            setNotebooks([]);  // Reset notebooks state to an empty array
            console.log('Storage cleared successfully');
        } catch (e) {
            console.error('Failed to clear storage', e);
        }
    };

    // Navigate back to the parent folder

    const rname = () => ('hello_' + Math.floor(Math.random() * 1000));
    return (
        <Provider>
            <SafeAreaView className="h-full w-full bg-primary">
                <View
                    id="navbar"
                    className="flex-row justify-between items-center mt-12 mx-8"
                >
                    <Image
                        className="h-[20px] w-[20px]"
                        source={images.logoSmall}
                        resizeMode="contain"
                    />

                    <View className="flex-row items-center gap-7">
                        <Image
                            className="h-[20px] w-[20px]"
                            source={icons.profile}
                            resizeMode="contain"
                        />
                        <TouchableOpacity onPress={clearStorage}>
                            <Image
                                className="h-[20px] w-[10px]"
                                source={icons.menu}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableOpacity onPress={goBack}>
                    <Text id="breadcrums" className="text-gray-500 text-s mx-8 mt-4">
                        {currentPath}
                    </Text>
                </TouchableOpacity>
                {emptyPage &&
                    <EmptyContent onAdd={onAdd} />
                }
                {!emptyPage &&
                    <FilledContent items={items} onItemPress={onItemPress} onAdd={onAdd} />
                }
            </SafeAreaView>
        </Provider>
    );
};

export default Home;

const styles = StyleSheet.create({});
