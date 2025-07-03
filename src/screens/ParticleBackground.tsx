import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const NUM_PARTICLES = 15;

const Particle = ({ delay }: { delay: number }) => {
  const y = useSharedValue(0);
  const x = useSharedValue(Math.random() * width);

  useEffect(() => {
    y.value = withRepeat(
      withTiming(height + 40, {
        duration: 8000 + Math.random() * 4000,
      }),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }],
    opacity: 0.2,
  }));

  return <Animated.View style={[styles.particle, style]} />;
};

const ParticleBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: NUM_PARTICLES }).map((_, index) => (
        <Particle key={index} delay={index * 300} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4ff',
  },
});

export default ParticleBackground;
