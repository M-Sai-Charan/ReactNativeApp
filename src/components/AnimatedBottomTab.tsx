import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';

const Tab = createBottomTabNavigator();

const AnimatedBottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          elevation: 10,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Events" component={EventDetailsScreen} />
    </Tab.Navigator>
  );
};

export default AnimatedBottomTab;
