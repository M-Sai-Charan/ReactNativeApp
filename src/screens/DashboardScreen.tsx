import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const customer = {
  "name": "Rahul Sharma",
  "phone": "+91-9876543210",
  "email": "rahul.wedding@gmail.com",
  "bride": "sam",
  "groom": "rahul",
  "olpId": "001OLP2025",
  "events": [
    {
      "id": "e1",
      "type": "Haldi",
      "date": "2025-07-13",
      "time": "10:00 AM",
      "location": "Sharma Residence, Jaipur",
      "guests": 75,
      "invoice": {
        "amount": 12000,
        "paid": true
      },
      "team": 5,
      "status": "Upcoming",
      "eventTeams": [
        {
          "id": 1,
          "name": "Steve",
          "value": "photographer"
        },
        {
          "id": 5,
          "name": "Smith",
          "value": "editor"
        },
        {
          "id": 9,
          "name": "Ferguson",
          "value": "lightman"
        },
        {
          "id": 13,
          "name": "Archer",
          "value": "droneoperator"
        },
        {
          "id": 18,
          "name": "Charlie",
          "value": "videographer"
        }
      ]
    },
    {
      "id": "e2",
      "type": "Sangeet",
      "date": "2025-07-14",
      "time": "07:00 PM",
      "location": "Royal Banquet, Jaipur",
      "guests": 120,
      "invoice": {
        "amount": 25000,
        "paid": false
      },
      "team": 4,
      "status": "Upcoming",
      "eventTeams": [
        {
          "id": 1,
          "name": "Steve",
          "value": "photographer"
        },
        {
          "id": 9,
          "name": "Ferguson",
          "value": "lightman"
        },
        {
          "id": 13,
          "name": "Archer",
          "value": "droneoperator"
        },
        {
          "id": 18,
          "name": "Charlie",
          "value": "videographer"
        }
      ]
    },
    {
      "id": "e3",
      "type": "Reception",
      "date": "2025-07-16",
      "time": "08:00 PM",
      "location": "The Grand Palace, Jaipur",
      "guests": 200,
      "invoice": {
        "amount": 30000,
        "paid": false
      },
      "team": 2,
      "status": "Upcoming",
      "eventTeams": [
        {
          "id": 1,
          "name": "Steve",
          "value": "photographer"
        },
        {
          "id": 9,
          "name": "Ferguson",
          "value": "lightman"
        }
      ]
    }
  ]
};

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.gradient}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/76.jpg' }}
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

        {/* Personal Info */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>📇 Personal Info</Text>
          <Text style={styles.infoText}>📞 {customer.phone}</Text>
          <Text style={styles.infoText}>✉️ {customer.email}</Text>
          <Text style={styles.infoText}>
            📅 Events Booked: {customer.events.length}
          </Text>
        </View> */}

        {/* Events */}
        <Text style={styles.sectionTitle}>📋 Your Events</Text>
        {customer.events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventType}>🎉 {event.type}</Text>
              {/* <Text style={styles.statusTag}>{event.status}</Text> */}
            </View>
            <Text style={styles.eventText}>📍 {event.location}</Text>
            <Text style={styles.eventText}>
              📅 {event.date} • {event.time}
            </Text>
            <Text style={styles.eventText}>👥 Guests: {event.guests}</Text>
            <Text style={styles.eventText}>
              💸 ₹{event.invoice.amount.toLocaleString()} •{' '}
              <Text
                style={{
                  color: event.invoice.paid ? '#00e676' : '#ff5252',
                  fontWeight: '600',
                }}
              >
                {event.invoice.paid ? 'Paid' : 'Unpaid'}
              </Text>
            </Text>
            <Text style={styles.eventText}>👷 Team Members: {event.team}</Text>

            <View style={styles.actionRow}>
              <ActionButton label="Team" onPress={() => navigation.navigate('Team', { eventId: event.id })} />
              <ActionButton label="Invoice" onPress={() => navigation.navigate('Invoice', { eventId: event.id })} />
              <ActionButton label="Feedback" onPress={() => navigation.navigate('Feedback', { eventId: event.id })} />
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const ActionButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
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
    backgroundColor: '#555',
  },
  welcomeHeading: {
    fontSize: 16,
    color: '#ccc',
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#90caf9',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
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
    backgroundColor: '#1e88e5',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '600',
  },
  eventText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
