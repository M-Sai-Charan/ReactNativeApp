import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';

const dummyEvents = [
  {
    id: 'e001',
    title: 'John & Priya Wedding',
    date: '2025-08-12',
    location: 'Hyderabad',
  },
  {
    id: 'e002',
    title: 'Akash & Ananya Engagement',
    date: '2025-09-05',
    location: 'Bangalore',
  },
  {
    id: 'e003',
    title: 'Maya’s Baby Shower',
    date: '2025-10-10',
    location: 'Chennai',
  },
];

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderItem = ({ item }: { item: typeof dummyEvents[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.info}>📅 {item.date}</Text>
      <Text style={styles.info}>📍 {item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📸 Your Events</Text>
      <FlatList
        data={dummyEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    color: '#ccc',
    marginTop: 4,
    fontSize: 14,
  },
});
