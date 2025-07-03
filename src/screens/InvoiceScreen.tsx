import React, { useEffect, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const InvoiceScreen = ({ route }: any) => {
  const { eventId } = route.params;
  const navigation = useNavigation();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetch('https://mocki.io/v1/f61267e5-512d-4feb-a3ea-96401ebf5d04')
      .then(res => res.json())
      .then(data => {
        const foundEvent = data.events.find((e: any) => e.id === eventId);
        setEvent(foundEvent);
      })
      .catch(error => {
        console.error('Error fetching invoice:', error);
        Alert.alert('Error', 'Unable to load invoice.');
      });
  }, [eventId]);

  const handleDownload = async () => {
    if (!event) return;

    try {
      const asset = Asset.fromModule(require('../assets/olp-logo.png'));
      await asset.downloadAsync();

      const logoBase64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const html = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <img src="data:image/png;base64,${logoBase64}" style="width: 80px; height: 80px; border-radius: 40px;" />
            <h2>One Look Photography - Invoice</h2>
            <p><strong>Event:</strong> ${event.type}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Amount:</strong> ₹${event.invoice.amount}</p>
            <p><strong>Status:</strong> ${event.invoice.paid ? 'Paid' : 'Unpaid'}</p>
            ${event.invoice.paid ? '<p><strong>Mode:</strong> UPI</p><p><strong>Paid On:</strong> 2025-07-05</p>' : ''}
            <p style="margin-top:40px;font-size:12px;color:#666">Thank you for your business!</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Download failed.');
    }
  };

  if (!event) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#7dcfff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice - {event.type}</Text>
          <View style={{ width: 26 }} />
        </View>
      </View>

      <Animatable.View animation="fadeInUp" delay={100} style={styles.card}>
        <Text style={styles.label}>📅 Date: <Text style={styles.value}>{event.date}</Text></Text>
        <Text style={styles.label}>📍 Location: <Text style={styles.value}>{event.location}</Text></Text>
        <Text style={styles.label}>💸 Amount: <Text style={styles.value}>₹{event.invoice.amount}</Text></Text>
        <Text style={styles.label}>
          ✅ Status: <Text style={{ color: event.invoice.paid ? '#00e676' : '#ff5252' }}>{event.invoice.paid ? 'Paid' : 'Unpaid'}</Text>
        </Text>
        {event.invoice.paid && (
          <>
            <Text style={styles.label}>💳 Mode: <Text style={styles.value}>UPI</Text></Text>
            <Text style={styles.label}>📆 Paid On: <Text style={styles.value}>2025-07-05</Text></Text>
          </>
        )}

        {event.invoice.paid && (
          <TouchableOpacity onPress={handleDownload}>
            <LinearGradient colors={['#7e5bef', '#55c4f5']} style={styles.downloadBtn}>
              <MaterialIcons name="file-download" color="#fff" size={20} />
              <Text style={styles.downloadText}>Download Invoice</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animatable.View>
    </SafeAreaView>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontWeight: '600',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  downloadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
});
