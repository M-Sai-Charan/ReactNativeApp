
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import GalleryScreen from '../screens/GalleryScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { View, Text } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import UploadYourShotsScreen from '../screens/UploadYourShotsScreen';
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { primaryColor } = useTheme();
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
          let iconName: string = 'ellipse-outline';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
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
              <View>
                <Icon name={iconName} size={24} color={color} />
                {route.name === 'PhotoBooth' && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      backgroundColor: '#007aff',
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>+</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
       <Tab.Screen name="Upload" component={UploadYourShotsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
