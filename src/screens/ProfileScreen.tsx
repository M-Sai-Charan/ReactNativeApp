import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ParticleBackground from './ParticleBackground';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const presetColors = ['#7e5bef', '#ff6b6b', '#00c9a7', '#feca57', '#1dd1a1'];

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { darkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useTheme();
  const styles = getStyles(darkMode, primaryColor);

  const [biometricLoginEnabled, setBiometricLoginEnabled] = useState(false);

  // Animate profile card on mount
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('biometricEnabled').then(val => {
      setBiometricLoginEnabled(val === 'false');
    });
  }, []);

  const toggleBiometric = async () => {
    const newValue = !biometricLoginEnabled;
    setBiometricLoginEnabled(newValue);
    await AsyncStorage.setItem('biometricEnabled', newValue.toString());
  };

  const profileAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <ParticleBackground />

      <Animated.View style={[styles.profileCard, profileAnim]}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
          style={[styles.avatar, { borderColor: primaryColor }]}
        />
        <Text style={styles.name}>Sai Charan</Text>
        <Text style={styles.email}>charan@example.com</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: primaryColor }]}>42</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: primaryColor }]}>3589</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>
      </Animated.View>

      {/* Settings Section */}
      <View style={styles.settingsCard}>
        <View style={{ marginBottom: 20 }}>
          <View style={styles.settingItem}>
            <Text style={styles.modalText}>🌙 Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#555', true: primaryColor }}
              thumbColor={darkMode ? '#fff' : '#ccc'}
            />
          </View>

          <View style={styles.colorRow}>
            {presetColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderColor: color === primaryColor ? '#000' : '#fff',
                  },
                ]}
                onPress={() => setPrimaryColor(color)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Biometric Toggle, Help & Logout */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionBtn}>
          <Text style={[styles.optionText, { color: primaryColor }]}>🆘 Help</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          }
        >
          <Text style={[styles.optionText, { color: primaryColor }]}>🚪 Logout</Text>
        </TouchableOpacity>

        {/* <View style={styles.settingItem}>
          <Text style={styles.modalText}>🔐 Biometric Login</Text>
          <Switch
            value={biometricLoginEnabled}
            onValueChange={toggleBiometric}
            trackColor={{ false: '#555', true: primaryColor }}
            thumbColor={biometricLoginEnabled ? '#fff' : '#ccc'}
          />
        </View> */}
      </View>
    </View>
  );
};

export default ProfileScreen;


const getStyles = (darkMode: boolean, primaryColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#0d0d0d' : '#f3f3f3',
      paddingTop: 60,
      alignItems: 'center',
    },
    profileCard: {
      backgroundColor: darkMode ? '#1f1f1f' : '#ffffff',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      width: width - 40,
      elevation: 10,
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      marginBottom: 12,
    },
    name: {
      color: darkMode ? '#fff' : '#222',
      fontSize: 22,
      fontWeight: '700',
    },
    email: {
      color: darkMode ? '#aaa' : '#555',
      fontSize: 14,
      marginBottom: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    statBox: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
    },
    statLabel: {
      color: darkMode ? '#888' : '#666',
      fontSize: 13,
    },
    settingsCard: {
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      width: width - 40,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: darkMode ? '#fff' : '#222',
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    colorRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 10,
      gap: 8,
    },
    colorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
    },
    modalText: {
      fontSize: 15,
      fontWeight: '700',
      color: primaryColor,
    },
    buttonContainer: {
      width: width - 40,
      marginTop: 10,
    },
    optionBtn: {
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 14,
    },
    optionText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
