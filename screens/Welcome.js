import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Images } from "../constants/";
import { useTheme, Button, Text } from "react-native-paper";


export default function WelcomeScreen({ navigation }) {
    const styles = createStyles(useTheme());
    return (
        <View style={styles.container}>
            <Image
                style={styles.animatedImage}
                source={Images.studentAnimated}
                resizeMode="contain"
            />
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>
                    Welcome, <Text style={styles.boldText}>Student</Text>
                </Text>
            </View>

            <Button
                icon="chevron-right"
                mode="outlined"
                style={styles.button}
                onPress={() => navigation.navigate("Home")}>
                Continue to Dashboard
            </Button>
            <Button
                icon="chevron-right"
                mode="outlined"
                style={styles.button}>
                Load Notes from Device
            </Button>
        </View>
    );
}


const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colors.background,
    },
    animatedImage: {
        height: 100,
        width: 100,
        marginLeft: 10,
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    welcomeText: {
        fontFamily: "Poppins-Regular",
        fontSize: 18,
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingTop: 2,
    },
    boldText: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
    },
    button: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
});