import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  Modal,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const FeedbackScreen = ({ route }: any) => {
  const { darkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useTheme();
  const styles = getStyles(darkMode, primaryColor);
  const { eventId } = route.params;
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  const handleSubmit = () => {
    if (rating === 0 || comment.trim().length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete',
        text2: 'Please rate and write some feedback.',
      });
      return;
    }

    setSuccessVisible(true);

    Toast.show({
      type: 'success',
      text1: 'Feedback Submitted',
      text2: 'Thank you for your feedback!',
    });

    setTimeout(() => {
      setSuccessVisible(false);
      navigation.goBack();
    }, 2500);
  };

  const renderStars = () => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={34}
            style={{ marginHorizontal: 6, color: primaryColor }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#121212" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
              <Ionicons name="arrow-back" size={26} color="#90caf9" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Event Feedback</Text>
            <View style={{ width: 26 }} />
          </View>

          {/* Glassmorphism Card */}
          <Animatable.View animation="fadeInUp" delay={100} style={styles.cardWrapper}>
            <BlurView intensity={50} tint="dark" style={styles.blurCard}>
              <Text style={styles.label}>Rate your experience</Text>
              {renderStars()}

              <Text style={styles.label}>Write a comment</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Your feedback helps us improve!"
                placeholderTextColor="#888"
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity activeOpacity={0.85} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#000', primaryColor, primaryColor, primaryColor, '#000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitText}>🚀 Submit Feedback</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </Animatable.View>

          <Toast position="bottom" />

          {/* ✅ Success Modal */}
          <Modal transparent visible={successVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.successBox}>
                <LottieView
                  source={require('../assets/success-check.json')}
                  autoPlay
                  loop={false}
                  style={{ width: 120, height: 120 }}
                />
                <Text style={styles.successText}>Thank you!</Text>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const getStyles = (darkMode: boolean, primaryColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    header: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
    },
    cardWrapper: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    blurCard: {
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: '#00c6ff60',
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
    },
    eventId: {
      color: '#aaa',
      fontSize: 14,
      marginBottom: 20,
    },
    label: {
      color: '#ccc',
      fontSize: 16,
      marginBottom: 8,
      fontWeight: '500',
    },
    starRow: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      backgroundColor: '#1e1e1e',
      color: '#fff',
      borderRadius: 10,
      padding: 14,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: 24,
      fontSize: 15,
    },
    submitButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      shadowColor: '#00c6ff',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    submitText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
      letterSpacing: 0.5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(18,18,18,0.85)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    successBox: {
      backgroundColor: '#1f1f1f',
      padding: 30,
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: '#90caf9',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    successText: {
      color: '#90caf9',
      fontSize: 20,
      fontWeight: '600',
      marginTop: 12,
    },
  });
