// LoginScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import { RootStackParamList } from '../navigation/RootStackParamList';
import logoImage from '../assets/olp-logo.png';
import { useTheme } from '../context/ThemeContext';
import ParticleBackground from './ParticleBackground';
import CustomToast from '../components/CustomToast';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { darkMode, primaryColor } = useTheme();
  const styles = getStyles(darkMode, primaryColor);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [promptAutoLogin, setPromptAutoLogin] = useState(false);
  const [storedUser, setStoredUser] = useState<{ email: string; password: string; name: string } | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const sampleUsers = [
    { email: 'msunnylive@gmail.com', password: '123', name: 'Sunny' },
    { email: 'urssunny1804@gmail.com', password: '123', name: 'Charan' },
  ];

  const slideAnim = useRef(new Animated.Value(80)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
   const checkStoredLogin = async () => {
  try {
    const stored = await AsyncStorage.getItem('rememberedUser');
    const biometricPref = await AsyncStorage.getItem('biometricEnabled');
    const isBiometricEnabled = biometricPref === 'true';

    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const biometricAvailableNow = compatible && enrolled;
    setBiometricAvailable(biometricAvailableNow);

    if (stored) {
      const creds = JSON.parse(stored);
      const matched = sampleUsers.find(u => u.email === creds.email);
      if (matched) {
        const userWithName = { ...creds, name: matched.name };
        setStoredUser(userWithName);
        setEmail(creds.email);
        setPassword(creds.password);
        setRememberMe(true);

        if (biometricAvailableNow && isBiometricEnabled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with Face ID / Fingerprint',
            fallbackLabel: 'Enter password',
          });

          if (result.success) {
            handleLogin(creds.email, creds.password, true);
          } else {
            showToast('Biometric authentication failed.', 'error');
          }
        } else {
          setPromptAutoLogin(true);
        }
      }
    }
  } catch (e) {
    console.error('Error in auto-login logic:', e);
  }
};


    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    };

    checkStoredLogin();
    checkBiometrics();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleLogin = (
    emailArg?: string,
    passwordArg?: string,
    isAutoLogin: boolean = false
  ) => {
    const emailToCheck = emailArg || email;
    const passToCheck = passwordArg || password;

    setShowConfetti(false);
    Keyboard.dismiss();

    const validUser = sampleUsers.find(
      (user) => user.email === emailToCheck && user.password === passToCheck
    );

    if (!validUser) {
      if (!isAutoLogin) showToast('Invalid email or password.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setShowConfetti(true);
      showToast(`Welcome, ${validUser.name}`, 'success');

      if (rememberMe && !isAutoLogin) {
        await AsyncStorage.setItem(
          'rememberedUser',
          JSON.stringify({ email: emailToCheck, password: passToCheck, name: validUser.name })
        );
      }

      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 2500);
    }, 1200);
  };

  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with biometrics',
      fallbackLabel: 'Enter Password',
    });

    if (result.success && storedUser) {
      handleLogin(storedUser.email, storedUser.password, true);
    } else {
      showToast('Biometric authentication failed.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ParticleBackground />

          <Animated.View
            style={[styles.logoWrapper, {
              opacity: logoAnim,
              transform: [{
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                })
              }]
            }]}
          >
            <Image source={logoImage} style={styles.logoImage} />
            <Text style={styles.logoText}>One Look Photography</Text>
          </Animated.View>

          <Animated.View style={[styles.formWrapper, { transform: [{ translateY: slideAnim }] }]}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconOverlay}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Feather name="check" size={14} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </View>

            <TouchableOpacity onPress={() => handleLogin()} disabled={loading} style={styles.loginButton}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
            </TouchableOpacity>

            {biometricAvailable && storedUser && (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={[styles.loginButton, { backgroundColor: '#333', marginTop: 8 }]}
              >
                <Text style={styles.loginButtonText}>🔒 Login with Face ID / Fingerprint</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => Linking.openURL('https://your-contact-page.com')}>
              <Text style={styles.helpText}>Need help signing in? Contact us</Text>
            </TouchableOpacity>
          </Animated.View>

          {showConfetti && (
            <ConfettiCannon count={80} origin={{ x: width / 2, y: 0 }} fadeOut autoStart explosionSpeed={300} />
          )}

          <CustomToast
            visible={toastVisible}
            message={toastMessage}
            type={toastType}
            onHide={() => setToastVisible(false)}
          />

          {promptAutoLogin && storedUser && (
            <View style={styles.overlayPrompt}>
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>Welcome back, {storedUser.name}!</Text>
                <Text style={[styles.promptText, { fontSize: 13, marginTop: 4 }]}>Do you want to continue with saved login or use another account?</Text>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <TouchableOpacity onPress={() => {
                    setPromptAutoLogin(false);
                    handleLogin(storedUser.email, storedUser.password, true);
                  }} style={[styles.promptButton, { backgroundColor: primaryColor }]}>
                    <Text style={styles.promptBtnText}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('rememberedUser');
                    setPromptAutoLogin(false);
                    setEmail('');
                    setPassword('');
                    setRememberMe(false);
                  }} style={[styles.promptButton, { backgroundColor: '#555', marginLeft: 10 }]}>
                    <Text style={styles.promptBtnText}>Use Different</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const getStyles = (darkMode: boolean, primaryColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    logoWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    logoImage: {
      width: 96,
      height: 96,
    },
    logoText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      letterSpacing: 1,
      marginTop: 10,
      textAlign: 'center',
    },
    formWrapper: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: '#111',
      borderColor: '#333',
      borderWidth: 1,
      borderRadius: 24,
      padding: 20,
    },
    input: {
      backgroundColor: '#1a1a1a',
      color: '#fff',
      borderColor: '#333',
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    loginButton: {
      backgroundColor: primaryColor,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 12,
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    helpText: {
      color: '#ccc',
      textAlign: 'center',
      textDecorationLine: 'underline',
      fontSize: 13,
      marginTop: 4,
      opacity: 0.8,
    },
    eyeIconOverlay: {
      position: 'absolute',
      right: 10,
      top: '38%',
      transform: [{ translateY: -10 }],
      zIndex: 1,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#555',
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
    checkboxLabel: {
      color: '#ccc',
      fontSize: 14,
    },
    overlayPrompt: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      zIndex: 10,
    },
    promptBox: {
      backgroundColor: '#1a1a1a',
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxWidth: 320,
      borderWidth: 1,
      borderColor: '#333',
    },
    promptText: {
      color: '#fff',
      fontSize: 15,
      textAlign: 'center',
    },
    promptButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    promptBtnText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
