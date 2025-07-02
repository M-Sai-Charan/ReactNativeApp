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
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

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

  const handleDownload = async (id: string, item: any) => {
    try {
      const asset = Asset.fromModule(require('../assets/olp-logo.png'));
      await asset.downloadAsync();

      const logoBase64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; color: #222; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { width: 80px; height: 80px; border-radius: 40px; margin-bottom: 10px; }
              .section { margin-bottom: 10px; }
              .label { font-weight: bold; color: #7e5bef; }
              .value { margin-left: 6px; }
              .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <img class="logo" src="data:image/png;base64,${logoBase64}" />
              <h2>One Look Photography</h2>
              <p><strong>Invoice ID:</strong> ${id}</p>
            </div>

            <div class="section"><span class="label">Event:</span><span class="value">${item.eventType}</span></div>
            <div class="section"><span class="label">Date:</span><span class="value">${item.date}</span></div>
            <div class="section"><span class="label">Amount:</span><span class="value">₹${item.amount.toLocaleString()}</span></div>
            <div class="section"><span class="label">Status:</span><span class="value">${item.status}</span></div>
            ${item.status === 'Paid'
          ? `<div class="section"><span class="label">Paid On:</span><span class="value">${item.paidOn}</span></div>
                   <div class="section"><span class="label">Mode:</span><span class="value">${item.mode}</span></div>`
          : ''
        }

            <div class="footer">
              Thank you for choosing One Look Photography. <br/>
              This is a system-generated invoice.
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Invoice Download Error:', error);
      Alert.alert('Error', 'Failed to generate invoice.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Ionicons name="arrow-back" size={26} color="#7dcfff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💼 Your Invoices</Text>
          <View style={{ width: 26 }} />
        </View>
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
            style={[
              styles.card,
              item.status === 'Paid' && styles.cardPaidGlow,
              item.status === 'Unpaid' && styles.cardUnPaidGlow,
            ]}
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
            <Text style={styles.text}>💸 Amount: ₹{item.amount.toLocaleString()}</Text>
            {item.status === 'Paid' && (
              <>
                <Text style={styles.text}>✅ Paid On: {item.paidOn}</Text>
                <Text style={styles.text}>💳 Mode: {item.mode}</Text>
                <TouchableOpacity onPress={() => handleDownload(item.id, item)}>
                  <LinearGradient
                    colors={['#7e5bef', '#55c4f5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.downloadBtn}
                  >
                    <MaterialIcons name="file-download" color="#fff" size={20} />
                    <Text style={styles.downloadText}>Download Invoice</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
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
    backgroundColor: '#0a0a0a',
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardPaidGlow: {
    borderColor: '#00e676',
    shadowColor: '#00e676',
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  cardUnPaidGlow: {
    borderColor: '#ff7043',
    shadowColor: '#ff7043',
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
  },
  text: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 6,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#7e5bef',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 10,
  },
});
