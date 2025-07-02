// src/components/AnimatedWave.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface WaveProps {
  color?: string;
  height?: number;
  speed?: number;
  opacity?: number;
  position?: 'top' | 'bottom';
}

export default function AnimatedWave({
  color = '#5c67f2',
  height = 120,
  speed = 6000,
  opacity = 0.2,
  position = 'bottom',
}: WaveProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue, speed]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  return (
    <View
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        width: width * 2,
        height,
        opacity,
        overflow: 'hidden',
      }}
    >
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        {[...Array(2)].map((_, index) => (
          <Svg
            key={index}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            <Path
              d={`
                M 0 30 
                Q ${width / 4} 0, ${width / 2} 30
                T ${width} 30 
                L ${width} ${height} 
                L 0 ${height} 
                Z
              `}
              fill={color}
            />
          </Svg>
        ))}
      </Animated.View>
    </View>
  );
}
