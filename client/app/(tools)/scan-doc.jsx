import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Modal, Portal, Provider, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { router } from 'expo-router';

const NOT_LOADING = -1.0;

const ScanDoc = () => {
    const [images, setImages] = useState([
    ]);
    const [lastImgId, setLastImgId] = useState(0);
    const [loading, setLoading] = useState(NOT_LOADING);

    const addImage = (imguri) => {
        const newImgId = lastImgId + 1;
        setImages([
            ...images,
            { id: newImgId, uri: imguri },
        ])
        setLastImgId(newImgId);
    }

    const compressImage = async (uri, ratio) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }], // Adjust width as needed
            { compress: ratio, format: ImageManipulator.SaveFormat.JPEG } // Adjust quality (0-1)
        );

        return manipResult;
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            let imageUri = result.assets[0].uri;

            const imageInfo = await FileSystem.getInfoAsync(imageUri);
            let imageSizeInMB = imageInfo.size / 1024 / 1024;
            if (imageSizeInMB > 1) {
                const mratio = imageSizeInMB < 1.5 ? 0.7 : imageSizeInMB < 4 ? 0.5 : 0.1;
                const compressedImage = await compressImage(result.assets[0].uri, mratio);
                imageUri = compressedImage.uri;

                // Check the size of the image
                const c_imageInfo = await FileSystem.getInfoAsync(compressedImage.uri);
                imageSizeInMB = c_imageInfo.size / 1024 / 1024; // Convert to MB
            }
            console.log(`Final image size: ${imageSizeInMB.toFixed(2)} MB`);

            addImage(imageUri);
        }
    };

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getData = async () => {
        setLoading(0.0);
        let fullDat = '';
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const dat = await performOCR(img.uri);
            fullDat += dat + "\n\n";
            setLoading((i + 1) / images.length);
        }
        await wait(500);
        setLoading(NOT_LOADING);
        // console.log(fullDat);
        router.push({ pathname: '../transcript', params: { transcript: fullDat } });
    }

    const performOCR = async (imgUri) => {
        if (!imgUri) return;

        const formData = new FormData();
        formData.append('file', {
            uri: imgUri,
            name: 'image.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(
                'https://api.ocr.space/parse/image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'apikey': process.env.AXIOS_API_KEY, // replace with your actual OCR.space API key
                    },
                }
            );

            const result = response.data.ParsedResults[0].ParsedText;
            if (result === '') console.log('no text found');
            else console.log('text found!');

            return result;
        } catch (error) {
            console.error(error.message);
            console.log('Error performing OCR.');
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text style={styles.title}>Scan a Document</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                    {images.map((image) => (
                        <Image key={image.id} source={{ uri: image.uri }}
                            style={[styles.image, image.id === lastImgId ? styles.lastImage : {}]} />
                    ))}
                </ScrollView>
                <View style={styles.bottomButtons}>

                    <Button mode="contained" style={styles.button} onPress={pickImage}>
                        Add Image
                    </Button>
                    <Button mode="contained" style={styles.button} onPress={getData}>
                        Get Data
                    </Button>
                </View>
                {/* Overlay loading indicator */}
                <Portal>
                    <Modal visible={loading !== NOT_LOADING} dismissable={false} contentContainerStyle={styles.modal}>
                        <ActivityIndicator animating={true} size="large" />
                        <Text style={styles.loadingText}>{`Loading... ${(100 * loading).toFixed(2)} %`}</Text>
                    </Modal>
                </Portal>
            </View>

        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    scrollView: {
        width: '100%',
        marginBottom: 20,
        padding: 20,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'black',
        backgroundColor: '#ddd'
    },
    image: {
        width: 300, // Adjust the width as needed
        height: 'auto', // Adjust the height as needed
        marginRight: 15,
        borderColor: 'black',
        borderWidth: 1,
    },
    lastImage: {
        marginRight: 40,
    },
    button: {
        flex: 1
    },
    bottomButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    modal: {
        backgroundColor: '#00000055',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: 'white',
    },
});

export default ScanDoc;
