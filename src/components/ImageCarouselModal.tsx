import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ImageCarouselModal = ({
  photos,
  startIndex,
  onClose,
}: {
  photos: string[];
  startIndex: number;
  onClose: () => void;
}) => {
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="close-circle" size={32} color="#fff" />
      </TouchableOpacity>
      <Carousel
        loop
        width={width}
        height={width * 1.1}
        autoPlay={false}
        data={photos}
        scrollAnimationDuration={400}
        defaultIndex={startIndex}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.carouselImage} />
        )}
      />
    </View>
  );
};

export default ImageCarouselModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
