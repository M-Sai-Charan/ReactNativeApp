import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, ActivityIndicator, Linking, Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Reanimated, { FadeInDown } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New event update available!' },
    { id: 2, title: 'Invoice for Sangeet is ready.' },
  ]);

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

  const getCountdownText = (eventDate: string) => {
    const today = moment();
    const event = moment(eventDate);
    const diff = event.diff(today, 'days');
    if (diff > 1) return `${diff} days left`;
    if (diff === 1) return `Tomorrow`;
    if (diff === 0) return `Today`;
    if (diff < 0) return `Completed`;
  };

  const handleDismiss = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    Toast.show({
      type: 'success',
      text1: 'Notification Dismissed',
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7e5bef" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0f0f0f', '#1a1a1a']} style={styles.gradient}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.topRow}>
            <View style={styles.profileRow}>
              <Image source={{ uri: customer.profile }} style={styles.avatar} />
              <View>
                <Text style={styles.welcomeHeading}>👋 Welcome,</Text>
                <Text style={styles.customerName}>{customer.name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => { setModalVisible(true); setUnread(false); }}>
              <View style={styles.bellContainer}>
                <Ionicons name="notifications-outline" size={26} color="#fff" />
                {unread && <View style={styles.badgeDot} />}
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeSub}>Here’s your journey overview!</Text>
        </View>

        {/* Events */}
        {customer.events.map((event: any, index: number) => (
          <Reanimated.View key={event.id} entering={FadeInDown.delay(index * 150)}>
            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventType}>🎉 {event.type}</Text>
                <Text style={styles.countdown}>⏳ {getCountdownText(event.date)}</Text>
                <Text style={styles.statusTag}>{event.status}</Text>
              </View>
              <Text style={styles.eventText}>📍 {event.location}</Text>
              <Text style={styles.eventText}>📅 {event.date} • {event.time}</Text>
              <Text style={styles.eventText}>👥 Guests: {event.guests}</Text>
              <Text style={styles.eventText}>
                💸 ₹{event.invoice.amount.toLocaleString()} •
                <Text style={{ color: event.invoice.paid ? '#00e676' : '#ff5252', fontWeight: '600' }}>
                  {event.invoice.paid ? ' Paid' : ' Unpaid'}
                </Text>
              </Text>
              <Text style={styles.eventText}>👷 Team Members: {event.team}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Team', { eventId: event.id, eventTeams: event.eventTeams })}>
                  <Ionicons name="people-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Invoice', { eventId: event.id, invoice: event.invoice, date: event.date, type: event.type })}>
                  <Ionicons name="receipt-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Feedback', { eventId: event.id })}>
                  <Ionicons name="chatbox-ellipses-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`)}>
                  <Ionicons name="location-sharp" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Reanimated.View>
        ))}
      </ScrollView>

      {/* Notification Modal */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔔 Notifications</Text>
            {notifications.length === 0 ? (
              <Text style={styles.modalText}>You're all caught up!</Text>
            ) : (
              notifications.map((n) => (
                <Swipeable
                  key={n.id}
                  renderRightActions={() => (
                    <TouchableOpacity onPress={() => handleDismiss(n.id)} style={styles.dismissAction}>
                      <Text style={styles.dismissText}>Dismiss</Text>
                    </TouchableOpacity>
                  )}
                >
                  <View style={styles.notificationCard}>
                    <Text style={styles.modalText}>{n.title}</Text>
                  </View>
                </Swipeable>
              ))
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Toast />
    </LinearGradient>
  );
};

export default DashboardScreen;


const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
  welcomeSection: {
    marginTop: 45,
    marginBottom: 20,
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
  },
  welcomeSub: {
    marginTop: 10,
    fontSize: 14,
    color: '#bbb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bellContainer: {
    position: 'relative',
    padding: 4,
  },
  badgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff3d00',
  },
  eventCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(126, 91, 239, 0.3)',
    shadowColor: '#7e5bef',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  countdown: {
    fontSize: 13,
    color: '#00e676',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 230, 118, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  statusTag: {
    backgroundColor: '#7e5bef',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontWeight: '600',
    overflow: 'hidden',
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
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: '#7e5bef',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#7e5bef',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  modalOverlay: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 20,
    zIndex: 1000,
  },
  modalContent: {
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalText: {
    color: '#ccc',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#7e5bef',
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
  dismissAction: {
    backgroundColor: '#ff5252',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    marginVertical: 4,
  },
  dismissText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationCard: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
});

