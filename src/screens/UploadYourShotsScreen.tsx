// screens/UploadScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import CustomToast from '../components/CustomToast';
import { Picker } from '@react-native-picker/picker';

const TAG_OPTIONS = ['Wedding', 'Reception', 'Haldi', 'Engagement', 'Candid', 'Other'];

const UploadScreen = () => {
    const { darkMode, primaryColor } = useTheme();
    const styles = getStyles(darkMode, primaryColor);

    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [tag, setTag] = useState(TAG_OPTIONS[0]);
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = [...images, ...result.assets];
            const limitedImages = newImages.slice(0, 12);
            setImages(limitedImages);
        }
    };
    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Camera access is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const newImages = [...images, ...result.assets];
            const limitedImages = newImages.slice(0, 12);
            setImages(limitedImages);
        }
    };

    const handleUpload = () => {
        if (!customerName.trim()) {
            setToastMessage('Please enter name before uploading.');
            setToastVisible(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setToastMessage(`Upload by ${customerName} successful!`);
            setToastVisible(true);
            setImages([]);
            setCustomerName('');
        }, 2000);
    };


    return (
        <View style={styles.uploadedScreen}>
            <FlatList
                data={images}
                keyExtractor={(_, index) => index.toString()}
                numColumns={3}
                contentContainerStyle={styles.container}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>Upload Memories</Text>

                        <TouchableOpacity
                            style={[styles.pickButton, images.length >= 12 && { opacity: 0.6 }]}
                            onPress={pickImages}
                            disabled={images.length >= 12}
                        >
                            <Text style={styles.pickButtonText}>
                                {images.length >= 12 ? 'Limit Reached (12)' : '📁 Select Photos'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.pickButton,
                                images.length >= 12 && { opacity: 0.6 },
                            ]}
                            onPress={pickFromCamera}
                            disabled={images.length >= 12}
                        >
                            <Text style={styles.pickButtonText}>
                                {images.length >= 12 ? 'Limit Reached (12)' : '📷 Capture from Camera'}
                            </Text>
                        </TouchableOpacity>
                        {images.length > 0 && (
                            <>
                                <View style={styles.pickerWrapper}>
                                    <Text style={styles.subTitle}>
                                        Selected Media ({images.length}/12)
                                    </Text>
                                    <View style={styles.pickerBox}>
                                        <Picker
                                            selectedValue={tag}
                                            onValueChange={(itemValue) => setTag(itemValue)}
                                            style={styles.picker}
                                            dropdownIconColor={primaryColor}
                                        >
                                            {TAG_OPTIONS.map((t) => (
                                                <Picker.Item label={t} value={t} key={t} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.label}>Name</Text>
                                    <TextInput
                                        placeholder="Enter your name"
                                        placeholderTextColor="#888"
                                        value={customerName}
                                        onChangeText={setCustomerName}
                                        style={styles.textInput}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.uploadButton,
                                        (loading || !customerName.trim()) && { opacity: 0.6 },
                                    ]}
                                    onPress={handleUpload}
                                    disabled={loading || !customerName.trim()}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.uploadButtonText}>🚀 Upload</Text>
                                    )}
                                </TouchableOpacity>

                            </>
                        )}
                    </>
                }
                renderItem={({ item, index }) => (
                    <View style={styles.imageWrapper}>
                        <TouchableOpacity
                            style={styles.deleteIcon}
                            onPress={() => {
                                const updatedImages = images.filter((_, i) => i !== index);
                                setImages(updatedImages);
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 14 }}>✕</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: item.uri }} style={styles.previewImage} />
                    </View>
                )}
                ListFooterComponent={
                    <CustomToast
                        visible={toastVisible}
                        message={toastMessage}
                        type="success"
                        onHide={() => setToastVisible(false)}
                    />
                }
            />
        </View>
    );
};

export default UploadScreen;
const getStyles = (darkMode: boolean, primaryColor: string) =>
    StyleSheet.create({
        uploadedScreen: {
            backgroundColor: darkMode ? '#000' : '#f3f3f3',
            flex: 1,
        },
        container: {
            padding: 35,
            paddingBottom: 60,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: darkMode ? '#fff' : '#111',
            textAlign: 'center',
            marginBottom: 20,
        },
        pickButton: {
            backgroundColor: primaryColor,
            borderRadius: 12,
            padding: 14,
            alignItems: 'center',
            marginBottom: 20,
        },
        pickButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 16,
        },
        inputWrapper: {
            marginBottom: 16,
        },
        label: {
            color: darkMode ? '#ccc' : '#444',
            marginBottom: 6,
            fontSize: 14,
        },
        textInput: {
            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
            color: darkMode ? '#fff' : '#000',
            borderColor: '#444',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
        },
        subTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: darkMode ? '#ccc' : '#333',
            marginBottom: 10,
        },
        pickerWrapper: {
            marginBottom: 20,
        },
        pickerBox: {
            borderWidth: 1,
            borderColor: primaryColor,
            borderRadius: 10,
            overflow: 'hidden',
        },
        picker: {
            height: 55,
            color: darkMode ? '#fff' : '#000',
        },
        uploadButton: {
            backgroundColor: primaryColor,
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 30,
        },
        uploadButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
        imageWrapper: {
            position: 'relative',
            width: '31.5%',
            aspectRatio: 1,
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 12,
            marginRight: '2%',
        },
        previewImage: {
            width: '100%',
            height: '100%',
            borderRadius: 10,
        },
        deleteIcon: {
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: '#0008',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 20,
            zIndex: 1,
        },
    });
