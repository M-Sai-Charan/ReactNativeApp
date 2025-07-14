import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../screens/DashboardScreen';
import AdminDashboard from '../screens/AdminDashboard';
import GalleryScreen from '../screens/GalleryScreen';
import UploadYourShotsScreen from '../screens/UploadYourShotsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ClientScreen from '../screens/ClientScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { primaryColor } = useTheme();

  useEffect(() => {
    const checkUserRole = async () => {
      const stored = await AsyncStorage.getItem('rememberedUser');
      if (stored) {
        const user = JSON.parse(stored);
        setIsAdmin(user.admin === true);
      }
      setLoading(false);
    };
    checkUserRole();
  }, []);

  if (loading) return null; // Optional: Splash or loading UI

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 0,
          borderRadius: 50,
          backgroundColor: primaryColor,
          height: 70,
          elevation: 10,
          shadowColor: '#fff',
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 10,
          borderTopWidth: 0,
          overflow: 'hidden',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#000',
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'ClientScreen') {
            iconName = focused ? 'people' : 'people-outline';
          }

          const scale = useSharedValue(1);

          useEffect(() => {
            scale.value = withSpring(focused ? 1.2 : 1, { damping: 6 });
          }, [focused]);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
          }));

          return (
            <Animated.View style={animatedStyle}>
              <Icon name={iconName} size={24} color={color} />
            </Animated.View>
          );
        },
      })}
    >
      {/* Admin or Normal Dashboard */}
      <Tab.Screen
        name="Dashboard"
        component={isAdmin ? AdminDashboard : DashboardScreen}
      />

      {/* Show ClientScreen only for Admin */}
      {isAdmin && (
        <Tab.Screen
          name="ClientScreen"
          component={ClientScreen}
          options={{ tabBarLabel: 'Clients' }}
        />
      )}

      {/* Show Gallery only for Non-Admin */}
      {!isAdmin && (
        <Tab.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ tabBarLabel: 'Gallery' }}
        />
      )}

      {/* Shared Screens */}
      {!loading && !isAdmin && (
        <Tab.Screen name="Upload" component={UploadYourShotsScreen} options={{ tabBarLabel: 'Upload' }} />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
