// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TeamScreen from '../screens/TeamScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from './RootStackParamList';
import ClientScreen from '../screens/ClientScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Team" component={TeamScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen
          name="ClientScreen"
          component={ClientScreen}
          options={{ headerShown: true, title: 'Client Enquiries' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
