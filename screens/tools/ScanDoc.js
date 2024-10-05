import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Modal, Portal, Provider, Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const NOT_LOADING = -1.0;

const ScanDocumentScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(NOT_LOADING);

    const _getImageSizeInMB = async (imgUri) => {
        const imageInfo = await FileSystem.getInfoAsync(imgUri);
        return imageInfo.size / 1024 / 1024;
    }

    const _validateImage = async (imgUri) => { // make image under 1mb
        let finalImgUri = imgUri;
        let finalImgSize = await _getImageSizeInMB(finalImgUri);

        if (finalImgSize > 1) {
            const outputQuality = (finalImgSize < 1.5) ? (0.7) : (finalImgSize < 4 ? 0.5 : 0.1);
            const compressedImage = await _compressImage(finalImgUri, outputQuality);

            finalImgUri = compressedImage.uri;
            finalImgSize = _getImageSizeInMB(finalImgUri);
        }
        console.log(`Final image size: ${finalImgSize.toFixed(2)} MB`);

        return finalImgUri;
    };

    const _compressImage = async (uri, ratio) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }], // Adjust width as needed
            { compress: ratio, format: ImageManipulator.SaveFormat.JPEG } // Adjust quality (0-1)
        );

        return manipResult;
    };

    const _pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        }
    };

    const _getPickedImage = async () => {
        let imgUri = await _pickImage();
        if (!imgUri) {
            console.log('image picking canceled/failed');
            return;
        }
        console.log('image picked, uri: ' + imgUri);

        imgUri = _validateImage(imgUri);
        if (!imgUri) {
            console.log('image compression failed');
            return;
        }
        return imgUri;
    }

    const addImage = async () => {
        const imgUri = await _getPickedImage();
        setImages([...images, imgUri]);
    };

    const replaceImage = async (index) => {
        const imgUri = await _getPickedImage();
        if (imgUri) {
            images[index] = imgUri;
            setImages([...images]);
        }
    }
    const deleteImage = (index) => {
        images.splice(index, 1);
        setImages([...images]);
    }


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
        // router.push({ pathname: '../transcript', params: { transcript: fullDat } });
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
            Alert.alert('Oops!', 'Server is busy, please try again later!');
            console.error(error.message);
            console.log('Error performing OCR.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewInner}>
                {images.map((image, index) => {
                    console.log(images);
                    const isLastImg = index === images.length - 1;

                    return <View style={[styles.imageItem, isLastImg ? styles.lastImageItem : {}]}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <View style={styles.imageItemOptions}>
                            <IconButton
                                icon='camera-retake'
                                iconColor={theme.colors.onBackground}
                                style={styles.imageItemOptionIcons}
                                onPress={() => replaceImage(index)}
                            />
                            <IconButton
                                icon='delete'
                                iconColor={theme.colors.onBackground}
                                style={styles.imageItemOptionIcons}
                                onPress={() => deleteImage(index)}
                            />
                        </View>
                    </View>;
                })}
            </ScrollView>
            <View style={styles.bottomButtons}>

                <Button mode="contained" style={styles.button} onPress={addImage}>
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
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    scrollView: {
        width: '100%',
        marginBottom: 20,
        padding: 20,
        paddingVertical: 12,
        backgroundColor: theme.colors.surface,
    },
    scrollViewInner: {
        alignItems: 'stretch',
    },
    imageItem: {
        width: 300,
        marginRight: 15,
    },
    image: {
        width: '100%',
        flex: 1,
        borderRadius: 10,
        borderColor: theme.colors.background,
        borderWidth: 5,
        resizeMode: 'contain',
        backgroundColor: theme.colors.background,
    },
    lastImageItem: {
        marginRight: 40,
    },
    imageItemOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    imageItemOptionIcons: {
        marginVertical: 0,
        marginLeft: 0,
    },
    button: {
        flex: 1
    },
    bottomButtons: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 36,
        marginHorizontal: 16,
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

export default ScanDocumentScreen;
