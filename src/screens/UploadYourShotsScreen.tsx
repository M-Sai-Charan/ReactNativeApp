// screens/UploadScreen.tsx
import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Image, StyleSheet,
    ScrollView, ActivityIndicator
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
    const [loading, setLoading] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All
            ,
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets);
        }
    };

    const handleUpload = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setImages([]);
            setToastVisible(true);
        }, 2000);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Upload Memories</Text>

            <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
                <Text style={styles.pickButtonText}>📁 Select Photos/Videos</Text>
            </TouchableOpacity>

            {images.length > 0 && (
                <>
                    <Text style={styles.subTitle}>Selected Media</Text>
                    <ScrollView horizontal style={styles.previewScroll}>
                        {images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img.uri }}
                                style={styles.previewImage}
                            />
                        ))}
                    </ScrollView>
                    <Text style={styles.selectedTag}>
                        Selected Event Type: <Text style={{ fontWeight: 'bold' }}>{tag}</Text>
                    </Text>
                    <View style={styles.pickerWrapper}>
                        <Text style={styles.label}>Tag Event:</Text>
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

                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleUpload}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.uploadButtonText}>🚀 Upload</Text>
                        )}
                    </TouchableOpacity>
                </>
            )}

            <CustomToast
                visible={toastVisible}
                message="Upload successful!"
                type="success"
                onHide={() => setToastVisible(false)}
            />
        </ScrollView>
    );
};

export default UploadScreen;
const getStyles = (darkMode: boolean, primaryColor: string) =>
    StyleSheet.create({
        container: {
            flexGrow: 1,
            padding: 20,
            backgroundColor: darkMode ? '#000' : '#f3f3f3',
            marginBottom: 40,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: '#fff',
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
        subTitle: {
            fontSize: 18,
            color: darkMode ? '#ccc' : '#333',
            marginBottom: 10,
        },
        previewScroll: {
            marginBottom: 20,
        },
        previewImage: {
            width: 100,
            height: 100,
            borderRadius: 12,
            marginRight: 10,
        },
        pickerWrapper: {
            marginBottom: 20,
        },
        label: {
            color: darkMode ? '#ccc' : '#444',
            marginBottom: 6,
        },
        pickerBox: {
            borderWidth: 1,
            borderColor: primaryColor,
            borderRadius: 10,
            overflow: 'hidden',
        },
        picker: {
            height: 40,
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
        selectedTag: {
            color: darkMode ? '#ccc' : '#333',
            fontSize: 14,
            marginBottom: 12,
            textAlign: 'center',
            fontWeight: '500',
            textDecorationLine: 'underline',
        }
    });
