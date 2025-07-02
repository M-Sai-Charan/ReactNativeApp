import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { galleryData } from '../assets/galleryData';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const GalleryScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const allEventTypes = ['All', ...galleryData.map((g) => g.eventType)];

  const filteredData =
    selectedFilter === 'All'
      ? galleryData
      : galleryData.filter((event) => event.eventType === selectedFilter);

  const openModal = (images: string[]) => {
    setModalImages(images);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImages([]);
  };

  const onImagePress = (img: string) => {
    setExpandedImage(img);
  };

  const renderImageItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => onImagePress(item)} style={styles.imageWrapper}>
      <Image source={{ uri: item }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Wedding Gallery</Text>

      {/* Filter Buttons */}
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {allEventTypes.map((eventType) => (
          <TouchableOpacity
            key={eventType}
            style={[
              styles.filterButton,
              selectedFilter === eventType && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(eventType)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === eventType && styles.filterTextActive,
              ]}
            >
              {eventType}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Event Grid Blocks */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {filteredData.map((event) => (
          <View key={event.eventType} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.eventType}</Text>
              <TouchableOpacity onPress={() => openModal(event.photos)}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={event.photos.slice(0, 4)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={renderImageItem}
              scrollEnabled={false}
            />
          </View>
        ))}
      </ScrollView>

      {/* Modal Grid */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Full Gallery</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={modalImages}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={renderImageItem}
              contentContainerStyle={styles.modalGrid}
            />
          </View>
        </View>
      </Modal>

      {/* Full Image Modal */}
      <Modal visible={!!expandedImage} transparent animationType="fade">
        <TouchableOpacity style={styles.fullImageWrapper} onPress={() => setExpandedImage(null)}>
          <Image source={{ uri: expandedImage! }} style={styles.fullImage} />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setExpandedImage(null)}>
            <Icon name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007aff',
  },
  filterText: {
    color: '#bbb',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    color: '#90caf9',
    fontSize: 14,
  },
  imageWrapper: {
    flex: 1,
    margin: 6,
  },
  gridImage: {
    width: (width - 70) / 2,
    height: 140,
    borderRadius: 12,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    height: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalGrid: {
    paddingBottom: 40,
  },
  fullImageWrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: '90%',
    resizeMode: 'contain',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
