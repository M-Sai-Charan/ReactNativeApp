import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const InvoiceScreen = ({ route }: any) => {
  const { eventId } = route.params;
  const navigation = useNavigation();

  const invoiceList = [
    {
      id: 'INV001',
      eventType: 'Haldi',
      date: '2025-07-13',
      amount: 12000,
      status: 'Paid',
      paidOn: '2025-07-05',
      mode: 'UPI',
    },
    {
      id: 'INV002',
      eventType: 'Sangeet',
      date: '2025-07-14',
      amount: 25000,
      status: 'Unpaid',
      paidOn: null,
      mode: null,
    },
    {
      id: 'INV003',
      eventType: 'Reception',
      date: '2025-07-16',
      amount: 30000,
      status: 'Unpaid',
      paidOn: null,
      mode: null,
    },
  ];

  const handleDownload = (id: string) => {
    Alert.alert('Download', `Invoice ${id} download started.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Ionicons name="arrow-back" size={26} color="#90caf9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Invoices</Text>
          <View style={{ width: 26 }} />
        </View>
        <Text style={styles.subheading}>Event ID: {eventId}</Text>
      </View>

      <FlatList
        data={invoiceList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            delay={index * 100}
            style={styles.card}
          >
            <View style={styles.cardTop}>
              <Text style={styles.eventType}>🎉 {item.eventType}</Text>
              <Text
                style={[
                  styles.status,
                  { color: item.status === 'Paid' ? '#00e676' : '#ff7043' },
                ]}
              >
                {item.status}
              </Text>
            </View>
            <Text style={styles.text}>📅 {item.date}</Text>
            <Text style={styles.text}>🧾 Invoice ID: {item.id}</Text>
            <Text style={styles.text}>
              💸 Amount: ₹{item.amount.toLocaleString()}
            </Text>
            {item.status === 'Paid' && (
              <>
                <Text style={styles.text}>✅ Paid On: {item.paidOn}</Text>
                <Text style={styles.text}>💳 Mode: {item.mode}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleDownload(item.id)}
            >
              <MaterialIcons name="file-download" color="#fff" size={20} />
              <Text style={styles.downloadText}>Download Invoice</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />
    </SafeAreaView>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 12,
    paddingBottom: 12,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 6,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3949ab',
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});
