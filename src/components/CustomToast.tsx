import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

type ToastProps = {
  message: string;
  visible: boolean;
  type?: 'success' | 'error';
  onHide: () => void;
};

const CustomToast = ({ message, visible, type = 'success', onHide }: ToastProps) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onHide)();
        });
      }, 2200);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const color = type === 'success' ? '#00c897' : '#ff5c5c';

  return (
    <Animated.View style={[styles.toastWrapper, animatedStyle]}>
      <BlurView intensity={80} tint="dark" style={styles.toast}>
        <Text style={[styles.toastText, { color }]}>{message}</Text>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: 'center',
  },
  toast: {
    width: width - 40,
    padding: 14,
    borderRadius: 14,
    borderColor: '#ffffff15',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  toastText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CustomToast;
