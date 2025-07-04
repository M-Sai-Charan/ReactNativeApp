import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const NUM_BLOBS = 6;
const COLORS = ['#7e5bef55', '#ff6b6b55', '#00c9a755', '#feca5755', '#1dd1a155'];

const FloatingBlob = ({ index }: { index: number }) => {
  const x = useSharedValue(Math.random() * width);
  const y = useSharedValue(Math.random() * height);
  const scale = useSharedValue(1);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(Math.random() * width, {
        duration: 8000 + Math.random() * 3000,
      }),
      -1,
      true
    );

    y.value = withRepeat(
      withTiming(Math.random() * height, {
        duration: 9000 + Math.random() * 3000,
      }),
      -1,
      true
    );

    scale.value = withRepeat(
      withTiming(1.4, { duration: 6000 }),
      -1,
      true
    );
  }, []);

  const blobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: interpolate(scale.value, [1, 1.4], [0.3, 0.45]),
  }));

  return (
    <Animated.View
      style={[
        styles.blob,
        blobStyle,
        { backgroundColor: COLORS[index % COLORS.length] },
      ]}
    />
  );
};

const ParticleBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: NUM_BLOBS }).map((_, i) => (
        <FloatingBlob key={i} index={i} />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#7e5bef55',
  },
});

export default ParticleBackground;
