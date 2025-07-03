import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import ParticleBackground from './ParticleBackground';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [helpVisible, setHelpVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Entry animation
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const profileAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Help modal animation
  const scale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);

  const helpModalAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: modalOpacity.value,
  }));

  const openHelp = () => {
    setHelpVisible(true);
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
    modalOpacity.value = withTiming(1, { duration: 300 });
  };

  const closeHelp = () => {
    scale.value = withTiming(0.8, { duration: 200 });
    modalOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setHelpVisible)(false);
    });
  };

  // App Settings modal animation
  const settingsScale = useSharedValue(0.8);
  const settingsOpacity = useSharedValue(0);

  const settingsModalAnim = useAnimatedStyle(() => ({
    transform: [{ scale: settingsScale.value }],
    opacity: settingsOpacity.value,
  }));

  const openSettings = () => {
    setSettingsVisible(true);
    settingsScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
    settingsOpacity.value = withTiming(1, { duration: 300 });
  };

  const closeSettings = () => {
    settingsScale.value = withTiming(0.8, { duration: 200 });
    settingsOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setSettingsVisible)(false);
    });
  };

  return (
    <View style={styles.container}>
      <ParticleBackground />

      <Animated.View style={[styles.profileCard, profileAnim]}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Sai Charan</Text>
        <Text style={styles.email}>charan@example.com</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3589</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>
      </Animated.View>

      {/* Option Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionBtn} onPress={openSettings}>
          <Text style={styles.optionText}>⚙️ App Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn} onPress={openHelp}>
          <Text style={styles.optionText}>🆘 Help</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as keyof RootStackParamList }],
            })
          }
        >
          <Text style={styles.optionText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Help Modal */}
      {helpVisible && (
        <Modal transparent animationType="none" visible={helpVisible}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.helpModal, helpModalAnim]}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <Text style={styles.modalText}>📧 support@onelookphotography.com</Text>
              <Text style={styles.modalText}>📞 +91 98765 43210</Text>

              <TouchableOpacity style={styles.modalCloseBtn} onPress={closeHelp}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* App Settings Modal */}
      {settingsVisible && (
        <Modal transparent animationType="none" visible={settingsVisible}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.helpModal, settingsModalAnim]}>
              <Text style={styles.modalTitle}>App Settings</Text>

              <View style={styles.settingItem}>
                <Text style={styles.modalText}>🌙 Dark Mode</Text>
                <Text style={styles.modalText}>On</Text>
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.modalText}>🔔 Notifications</Text>
                <Text style={styles.modalText}>Enabled</Text>
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.modalText}>🌐 Language</Text>
                <Text style={styles.modalText}>English</Text>
              </View>

              <TouchableOpacity style={styles.modalCloseBtn} onPress={closeSettings}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 60,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: width - 40,
    elevation: 10,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#007aff',
    borderWidth: 2,
    marginBottom: 12,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    color: '#aaa',
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
    color: '#00d4ff',
  },
  statLabel: {
    color: '#888',
    fontSize: 13,
  },
  buttonContainer: {
    width: width - 40,
    marginTop: 10,
  },
  optionBtn: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  optionText: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModal: {
    width: width - 60,
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 12,
  },
  modalText: {
    color: '#ccc',
    fontSize: 15,
    marginVertical: 4,
    textAlign: 'center',
  },
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: '#7e5bef',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCloseText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  settingItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});
