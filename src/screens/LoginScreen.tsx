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
import { useEffect, useRef, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import ConfettiCannon from 'react-native-confetti-cannon';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import logoImage from '../assets/olp-logo.png';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowConfetti(true);
      Toast.show({
        type: 'success',
        text1: 'Login successful!',
        text2: `Welcome, ${email.split('@')[0]}`,
      });
     navigation.replace('MainTabs');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoAnim,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={logoImage} style={styles.logoImage} />
            <Text style={styles.logoText}>One Look Photography</Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            style={[styles.formWrapper, { transform: [{ translateY: slideAnim }] }]}
          >
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
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconOverlay}
              >
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://your-contact-page.com')}
            >
              <Text style={styles.helpText}>Need help signing in? Contact us</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Confetti */}
          {showConfetti && (
            <ConfettiCannon
              count={80}
              origin={{ x: width / 2, y: 0 }}
              fadeOut
              autoStart
              explosionSpeed={300}
            />
          )}

          <Toast position="bottom" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    borderColor: '#333',
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
    backgroundColor: '#7e5bef',
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
});
