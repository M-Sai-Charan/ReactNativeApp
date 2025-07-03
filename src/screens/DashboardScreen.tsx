import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mocki.io/v1/f61267e5-512d-4feb-a3ea-96401ebf5d04')
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('API Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7e5bef" />
      </View>
    );
  }
  const getCountdownText = (eventDate: string) => {
    const today = moment();
    const event = moment(eventDate);
    const diff = event.diff(today, 'days');

    if (diff > 1) return `${diff} days left`;
    if (diff === 1) return `Tomorrow`;
    if (diff === 0) return `Today`;
    if (diff < 0) return `Completed`;
  };

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.gradient}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: customer.profile }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeHeading}>👋 Welcome,</Text>
              <Text style={styles.customerName}>{customer.name}</Text>
            </View>
          </View>
          <Text style={styles.welcomeSub}>
            Here’s your journey overview!
          </Text>
        </View>

        {/* Events */}
        <Text style={styles.sectionTitle}>📋 Your Events</Text>
        {customer.events.map((event: any) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventType}>🎉 {event.type}</Text>
              <Text style={styles.countdown}>
                ⏳ {getCountdownText(event.date)}
              </Text>
              <Text style={styles.statusTag}>{event.status}</Text>
            </View>
            <Text style={styles.eventText}>📍 {event.location}</Text>
            <Text style={styles.eventText}>
              📅 {event.date} • {event.time}
            </Text>
            <Text style={styles.eventText}>👥 Guests: {event.guests}</Text>
            <Text style={styles.eventText}>
              💸 ₹{event.invoice.amount.toLocaleString()} •{' '}
              <Text style={{ color: event.invoice.paid ? '#00e676' : '#ff5252', fontWeight: '600' }}>
                {event.invoice.paid ? 'Paid' : 'Unpaid'}
              </Text>
            </Text>
            <Text style={styles.eventText}>👷 Team Members: {event.team}</Text>

            <View style={styles.actionRow}>
              <ActionButton label="Team" onPress={() => navigation.navigate('Team', { eventId: event.id, eventTeams: event.eventTeams })} />
              <ActionButton label="Invoice" onPress={() => navigation.navigate('Invoice', {
                eventId: event.id,
                invoice: event.invoice,
                date: event.date,
                type: event.type,
              })} />
              <ActionButton label="Feedback" onPress={() => navigation.navigate('Feedback', { eventId: event.id })} />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`)
                }
              >
                <Ionicons name="location-sharp" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const ActionButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export default DashboardScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginTop: 45,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#444',
  },
  welcomeHeading: {
    fontSize: 16,
    color: '#aaa',
  },
  customerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
  welcomeSub: {
    marginTop: 10,
    fontSize: 14,
    color: '#bbb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  eventCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statusTag: {
    backgroundColor: '#7e5bef',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontWeight: '600',
  },
  eventText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#7e5bef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  iconButton: {
    backgroundColor: '#7e5bef',
    padding: 10,
    borderRadius: 8,
  },
  countdown: {
  marginTop: 3,
  fontSize: 13,
  color: '#00e676',
  fontWeight: '600',
  textShadowColor: 'rgba(0, 230, 118, 0.3)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 6,
},
});
