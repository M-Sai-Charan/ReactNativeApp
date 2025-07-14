import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    ToastAndroid,
    ScrollView,
    Image,
    Linking,
    Platform,
} from 'react-native';
import { ViewStyle } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

type TeamMember = {
    id: number;
    name: string;
    value: string;
    number: string;
    avatar: string;
    equipments: string[];
};

type Event = {
    EventDetailsID: number;
    EnquiryID: number;
    EventName: string;
    Date: string;
    Time: string;
    Location: string;
    Guests: number;
    invoice: {
        amount: number;
        paid: boolean;
    };
    eventTeams: TeamMember[];
};

type User = {
    EnquiryID: number;
    Bride: string;
    Groom: string;
    ContactNumber: string;
    Email: string;
    comments: string;
    Location: string;
    Status: string;
    EnquirySubmissionDate: string;
    ReferredFrom: string;
    OLPID: string;
    events: Event[];
};

const ClientScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [filteredStatus, setFilteredStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [selectedEventMap, setSelectedEventMap] = useState<{ [key: number]: number }>({});

    const perPage = 3;
    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    const flatListRef = useRef<FlatList>(null);
    const { darkMode, primaryColor } = useTheme();
    const styles = getStyles(darkMode, primaryColor);

    useEffect(() => {
        axios.get('https://mocki.io/v1/a6e80c3c-456a-4a00-b0d3-4ad9450e5671')
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, []);
    const heartScale = useSharedValue(1);

    useEffect(() => {
        heartScale.value = withRepeat(
            withSequence(
                withTiming(1.3, { duration: 300, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedHeartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const handleToggle = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            setSelectedEventMap((prev) => ({ ...prev, [id]: 0 }));
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            opacity.value = withTiming(0, { duration: 200 }, () => {
                opacity.value = withTiming(1, { duration: 200 });
            });
            setPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (page * perPage < filteredUsers.length) {
            opacity.value = withTiming(0, { duration: 200 }, () => {
                opacity.value = withTiming(1, { duration: 200 });
            });
            setPage((prev) => prev + 1);
        }
    };

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.Bride} ${user.Groom}`.toLowerCase();
        const matchSearch = fullName.includes(search.toLowerCase()) || user.OLPID.includes(search);
        const matchStatus = filteredStatus === 'All' || user.Status === filteredStatus;
        return matchSearch && matchStatus;
    });

    const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

    const renderCard = ({ item }: { item: User }) => {
        const isExpanded = expandedId === item.EnquiryID;
        const selectedIndex = selectedEventMap[item.EnquiryID] || 0;
        const selectedEvent = item.events[selectedIndex];

        return (
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.rowBetween}>
                    <Text style={styles.name}>
                        {item.Bride}{' '}
                        <Animated.Text style={[styles.heartIcon, animatedHeartStyle]}>💖</Animated.Text>
                        {' '}
                        {item.Groom}
                    </Text>
                    <TouchableOpacity onPress={() => handleToggle(item.EnquiryID)}>
                        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#00f6ff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.rowBetween}>
                    <Text style={styles.olpidText}>{item.OLPID}</Text>
                    <TouchableOpacity
                        onPress={() => ToastAndroid.show('OLPID Copied!', ToastAndroid.SHORT)}
                        style={styles.olpIdRow}
                    >
                        <Icon name="copy-outline" size={16} style={styles.olpidCopy} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.info}><Icon name="call-outline" size={14} color="#888" /> {item.ContactNumber}</Text>
                <Text style={styles.info}><Icon name="mail-outline" size={14} color="#888" /> {item.Email}</Text>
                <Text style={styles.info}><Icon name="location-outline" size={14} color="#888" /> {item.Location}</Text>
                <Text style={styles.info}><Icon name="send-outline" size={14} color="#888" /> Referred: {item.ReferredFrom}</Text>

                {/* Event Section with Tabs */}
                {isExpanded && (
                    <View style={styles.eventSection}>
                        {/* Tabs */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                            {item.events.map((event, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                        setSelectedEventMap((prev) => ({ ...prev, [item.EnquiryID]: index }))
                                    }
                                    style={[
                                        styles.eventTab,
                                        selectedIndex === index && styles.activeEventTab,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.eventTabText,
                                            selectedIndex === index && styles.activeEventTabText,
                                        ]}
                                    >
                                        {event.EventName}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Selected Event Content */}
                        <View style={styles.eventCard}>
                            <Text style={styles.eventTitle}>{selectedEvent.EventName}</Text>
                            <Text style={styles.eventInfo}>📅 {selectedEvent.Date} — {selectedEvent.Time}</Text>
                            <View style={styles.locationRow}>
                                <Text style={styles.eventInfo}>📍 {selectedEvent.Location}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.Location)}`)
                                    }
                                    style={styles.mapButton}
                                >
                                    <Icon name="map-outline" size={18} color="#0ff" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.eventInfo}>👥 Guests: {selectedEvent.Guests}</Text>

                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceText}>💰 ₹{selectedEvent.invoice.amount}</Text>
                                <Text style={[
                                    styles.invoiceStatus,
                                    {
                                        backgroundColor: selectedEvent.invoice.paid ? '#16a34a33' : '#dc262633',
                                        color: selectedEvent.invoice.paid ? '#16a34a' : '#dc2626',
                                    }
                                ]}>
                                    {selectedEvent.invoice.paid ? 'Paid' : 'Unpaid'}
                                </Text>
                            </View>

                            <Text style={styles.teamHeader}>🎯 Team:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {selectedEvent.eventTeams.map((member, index) => (
                                    <View key={index} style={styles.memberCard}>
                                        <Image source={{ uri: member.avatar }} style={styles.avatar} />
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        <Text style={styles.memberRole}>{member.value}</Text>
                                        <Text style={styles.equipments}>🎒 {member.equipments.join(', ')}</Text>
                                        <TouchableOpacity
                                            style={styles.callButton}
                                            onPress={() => {
                                                if (member.number) {
                                                    Linking.openURL(`tel:${member.number}`);
                                                } else {
                                                    ToastAndroid.show('No number available', ToastAndroid.SHORT);
                                                }
                                            }}
                                        >
                                            <Icon name="call-outline" size={16} color="#0ff" />
                                            <Text style={styles.callText}>Call</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            <Text style={{ marginTop: 20 }}></Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Bride/Groom or OLPID"
                    placeholderTextColor="#888"
                    onChangeText={setSearch}
                    value={search}
                />
                <View style={styles.filterRow}>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={filteredStatus}
                            onValueChange={setFilteredStatus}
                            style={styles.picker}
                            dropdownIconColor="#fff"
                        >
                            <Picker.Item label="All" value="All" />
                            <Picker.Item label="New" value="New" />
                            <Picker.Item label="Completed" value="Completed" />
                            <Picker.Item label="Pending" value="Pending" />
                            <Picker.Item label="Cancelled" value="Cancelled" />
                        </Picker>
                    </View>
                    <View style={styles.pagination}>
                        <TouchableOpacity onPress={handlePrev} disabled={page === 1}>
                            <Icon name="chevron-back-circle" size={28} color={page === 1 ? '#444' : '#0ff'} />
                        </TouchableOpacity>
                        <Text style={{ color: '#aaa' }}>{page}</Text>
                        <TouchableOpacity onPress={handleNext} disabled={page * perPage >= filteredUsers.length}>
                            <Icon name="chevron-forward-circle" size={28} color={page * perPage >= filteredUsers.length ? '#444' : '#0ff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Animated.View style={[animatedStyle, { flex: 1 }]}>
                <FlatList
                    ref={flatListRef}
                    data={paginatedUsers}
                    keyExtractor={(item) => item.EnquiryID.toString()}
                    renderItem={renderCard}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>
        </View>
    );
};

export default ClientScreen;
const getStyles = (darkMode: boolean, primaryColor: string) =>
    StyleSheet.create({
        container: {
            padding: 16,
        },
        searchInput: {
            backgroundColor: '#1a1a2a',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
            color: '#fff',
            borderWidth: 1,
            borderColor: '#2e2e40',
            marginBottom: 12,
            fontSize: 14,
        },
        filterRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        pickerWrapper: {
            flex: 1,
            marginRight: 10,
            backgroundColor: '#1e1e2f',
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#333',
        },
        picker: {
            color: '#fff',
            height: 50,
            width: '100%',
        },
        pagination: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        card: {
            backgroundColor: 'rgba(30,30,50,0.6)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#333',
            shadowColor: '#00f6ff',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
        },
        name: {
            fontSize: 18,
            color: '#fff',
            fontWeight: '600',
            letterSpacing: 0.3,
        },
        statusText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        info: {
            color: '#ccc',
            fontSize: 13,
            marginTop: 6,
        },
        olpIdRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1a1a2a',
            paddingHorizontal: 5,
            paddingVertical: 4,
            borderRadius: 8,
            borderColor: '#333',
        },
        olpidText: {
            color: primaryColor,
            fontWeight: 'bold',
            fontSize: 12,
            letterSpacing: 2,
        },
        olpidCopy: {
            color: '#0ff',
            marginLeft: 6
        },
        rowBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
        },
        eventSection: {
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#333',
        },
        eventCard: {
            marginBottom: 16,
            backgroundColor: '#1e1e2f',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: '#2e2e40',
        },
        eventTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#00f6ff',
            marginBottom: 6,
        },
        eventInfo: {
            fontSize: 13,
            color: '#bbb',
            marginBottom: 2,
        },
        invoiceRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 6,
        },
        invoiceText: {
            fontSize: 14,
            color: '#facc15',
            fontWeight: 'bold',
        },
        invoiceStatus: {
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 'bold',
            overflow: 'hidden',
        },
        teamHeader: {
            marginTop: 12,
            color: '#0ff',
            fontWeight: 'bold',
            fontSize: 14,
        },
        memberCard: {
            width: 160,
            backgroundColor: '#292942',
            borderRadius: 10,
            padding: 10,
            marginRight: 10,
            marginTop: 8,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginBottom: 6,
            borderWidth: 1,
            borderColor: '#00f6ff',
            alignSelf: 'center',
        },
        memberName: {
            textAlign: 'center',
            fontSize: 14,
            color: '#fff',
            fontWeight: '600',
        },
        heartIcon: {
            fontSize: 20,
            marginHorizontal: 4,
            color: '#ff4d6d', // slightly glowing pink/red
            textShadowColor: '#ff4d6d99',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 4,
        },
        memberRole: {
            textAlign: 'center',
            fontSize: 12,
            color: '#999',
            marginBottom: 4,
        },
        equipments: {
            fontSize: 11,
            color: '#ccc',
            marginTop: 4,
        },
        callButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            backgroundColor: '#1a1a2a',
            paddingVertical: 6,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#00f6ff66',
        },

        callText: {
            marginLeft: 6,
            color: '#0ff',
            fontSize: 12,
            fontWeight: '600',
        },
        locationRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 2,
        },

        mapButton: {
            marginLeft: 10,
            padding: 4,
            borderRadius: 6,
            borderColor: '#00f6ff66',
            borderWidth: 1,
        },


        eventTab: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            backgroundColor: '#1e1e2f',
            borderRadius: 10,
            marginRight: 10,
            borderWidth: 1,
            borderColor: '#333',
        },
        activeEventTab: {
            backgroundColor: '#00f6ff22',
            borderColor: '#0ff',
        },
        eventTabText: {
            color: '#aaa',
            fontWeight: 'bold',
            fontSize: 13,
        },
        activeEventTabText: {
            color: '#0ff',
        },
    });

