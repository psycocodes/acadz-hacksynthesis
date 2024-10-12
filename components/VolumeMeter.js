import { StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import Svg, { Rect } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const VIEWPORT_WIDTH = 500;
const BAR_COUNT = 50;  // Number of bars for the meter
const BAR_WIDTH = VIEWPORT_WIDTH / BAR_COUNT * 0.3;

export const getInitialVolumeArray = () => new Array(BAR_COUNT).fill(0);

export default function VolumeMeter({ volumeArray, style }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={[styles.container, style]}>
            <Svg width="100%" viewBox={`0 0 ${VIEWPORT_WIDTH} 100`} style={styles.svg}>
                {volumeArray.map((value, index) => {

                    const animatedProps = useAnimatedProps(() => ({
                        height: value * 100 + 10,
                        y: (95 - value * 100) / 2,
                    }));

                    return (
                        <AnimatedRect
                            key={index}
                            x={index * VIEWPORT_WIDTH / BAR_COUNT}
                            width={BAR_WIDTH}
                            animatedProps={animatedProps}
                            fill={style?.color || theme.colors.primary}
                        />
                    );
                })}
            </Svg>
        </View>
    );
}

// Animated rectangle for each volume bar
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const createStyles = theme => StyleSheet.create({
    container: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 10,
        height: 80,
        padding: 8,
    },
    svg: {
        flex: 1,
    }
});
