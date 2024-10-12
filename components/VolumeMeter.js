import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import Svg, { Rect } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';


export default function VolumeMeter({ volumeArray }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const BAR_COUNT = volumeArray.length;  // Number of bars for the meter
    const BAR_WIDTH = 300 / BAR_COUNT * 0.5;

    return (
        <Svg height="100" width="100%" viewBox="0 0 300 100" style={styles.svg}>
            {volumeArray.map((value, index) => {

                const animatedProps = useAnimatedProps(() => ({
                    height: value * 80,
                    y: (100 - value * 80) / 2,
                }));

                return (
                    <AnimatedRect
                        key={index}
                        x={index * 300 / BAR_COUNT}
                        width={BAR_WIDTH}
                        animatedProps={animatedProps}
                        fill="white"
                    />
                );
            })}
        </Svg>
    );
}

// Animated rectangle for each volume bar
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const createStyles = theme => StyleSheet.create({
    svg: {
        // backgroundColor: '#0000ff'
    }
});
