import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootStackParamList';

type EventRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

const dummyEventDetails: Record<string, any> = {
  '1': {
    title: 'Wedding at Goa',
    date: '2025-07-10',
    location: 'Goa Beach Resort',
    invoiceStatus: 'Generated',
    team: ['Sai', 'Nikhil', 'Rahul'],
  },
  '2': {
    title: 'Pre-wedding in Hyderabad',
    date: '2025-07-15',
    location: 'Shilparamam',
    invoiceStatus: 'Pending',
    team: ['Upendra', 'Charan'],
  },
  '3': {
    title: 'Birthday at Resort',
    date: '2025-07-20',
    location: 'Leonia Resorts',
    invoiceStatus: 'Paid',
    team: ['Naveen', 'Mahesh'],
  },
};

export default function EventDetailsScreen() {
  const route = useRoute<EventRouteProp>();
  const { eventId } = route.params;
  const event = dummyEventDetails[eventId];

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Event not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.label}>📅 Date:</Text>
      <Text style={styles.value}>{event.date}</Text>

      <Text style={styles.label}>📍 Location:</Text>
      <Text style={styles.value}>{event.location}</Text>

      <Text style={styles.label}>📄 Invoice Status:</Text>
      <Text style={[styles.value, { color: event.invoiceStatus === 'Paid' ? '#4caf50' : '#fdd835' }]}>
        {event.invoiceStatus}
      </Text>

      <Text style={styles.label}>👥 Assigned Team:</Text>
      {event.team.map((member: string, index: number) => (
        <Text key={index} style={styles.value}>• {member}</Text>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>📥 Download Invoice</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#7e5bef',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
