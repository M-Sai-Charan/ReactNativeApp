import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Image,
    FlatList,
    StatusBar,
    Platform,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const TeamScreen = ({ route }: any) => {
    const { eventId } = route.params;
    const navigation = useNavigation();

    const teamMembers = [
        {
            name: 'Amit Mehta',
            role: 'Photographer',
            phone: '9876543211',
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
        {
            name: 'Priya Singh',
            role: 'Makeup Artist',
            phone: '9876543212',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        },
        {
            name: 'Rohan Das',
            role: 'Catering Manager',
            phone: '9876543213',
            avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        },
    ];

    const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
    const handleMessage = (phone: string) => Linking.openURL(`sms:${phone}`);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />

            {/* Custom Header */}
            <View style={styles.headerWrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                        <Ionicons name="arrow-back" size={26} color="#90caf9" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Team Assigned</Text>

                    {/* Right spacer for symmetry */}
                    <View style={{ width: 26 }} />
                </View>
            </View>

            {/* Team Members List */}
            <FlatList
                data={teamMembers}
                keyExtractor={(item) => item.phone}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item, index }) => (
                    <Animatable.View
                        animation="fadeInUp"
                        delay={index * 100}
                        style={styles.card}
                    >
                        <View style={styles.row}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.details}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>🎯 {item.role}</Text>
                                <Text style={styles.phone}>📞 {item.phone}</Text>
                            </View>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: '#4caf50' }]}
                                onPress={() => handleCall(item.phone)}
                            >
                                <MaterialIcons name="call" color="#fff" size={18} />
                                <Text style={styles.btnText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: '#2196f3' }]}
                                onPress={() => handleMessage(item.phone)}
                            >
                                <MaterialIcons name="message" color="#fff" size={18} />
                                <Text style={styles.btnText}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                )}
            />
        </SafeAreaView>
    );
};

export default TeamScreen;

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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 14,
        backgroundColor: '#333',
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    role: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 2,
    },
    phone: {
        fontSize: 13,
        color: '#bbb',
        marginTop: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 14,
    },
});
