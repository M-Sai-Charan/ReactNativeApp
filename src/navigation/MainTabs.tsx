// src/navigation/MainTabs.tsx
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          borderRadius: 50,
          backgroundColor: '#fff',
          height: 70,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ focused, color }) => {
          let iconName: string = 'ellipse-outline';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
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
                {route.name === 'Events' && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      backgroundColor: 'red',
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>3</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Events" component={EventDetailsScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
