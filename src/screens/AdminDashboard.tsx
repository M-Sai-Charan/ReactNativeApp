import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: '#1e1e2f',
    backgroundGradientTo: '#1e1e2f',
    decimalPlaces: 0,
    color: () => `#3b82f6`,
    labelColor: () => '#ccc',
    style: {
        borderRadius: 16,
    },
};
const eventTypes = [
    { label: 'Wedding', color: '#3b82f6', count: 170 },
    { label: 'Birthday', color: '#22c55e', count: 35 },
    { label: 'Corporate', color: '#f59e0b', count: 50 },
    { label: 'Other', color: '#a855f7', count: 20 },
];
export default function AdminDashboard() {
    const { darkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useTheme();
    const styles = getStyles(darkMode, primaryColor);
    const total = eventTypes.reduce((sum, item) => sum + item.count, 0);
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* 👋 Greeting */}
            <View style={styles.section}>
                <Text style={styles.greeting}>👋 Hello, Alex</Text>
                <Text style={styles.subGreeting}>Here’s your company overview.</Text>
            </View>

            {/* 📦 Summary Cards */}
            <View style={styles.cardRow}>
                {[
                    { title: 'Total Enquiries', value: '1,240' },
                    { title: 'Total Bookings', value: '500' },
                    { title: 'Upcoming Events', value: '85' },
                    { title: 'Completed Events', value: '1,155' },
                    { title: 'Total Revenue', value: '$2.3M' },
                    { title: 'Customer Rating', value: '4.8/5' },
                ].map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardValue}>{item.value}</Text>
                        <Text style={styles.cardLabel}>{item.title}</Text>
                    </View>
                ))}
            </View>
            {/* 📍 Events by Location */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📍 Events by Location</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        { location: 'Banglore', events: 180 },
                        { location: 'Tirupathi', events: 150 },
                        { location: 'Hyderabad', events: 90 },
                        { location: 'Chennai', events: 30 },
                    ].map((loc, idx) => (
                        <View key={idx} style={styles.horizontalCard}>
                            <Text style={styles.cardLabel}>{loc.location}</Text>
                            <Text style={styles.cardSubText}>{loc.events} Events</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* 👥 Team Performance */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>👥 Top Team Members</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        { name: 'Sarah J.', role: 'Photographer', events: 120 },
                        { name: 'Mark T.', role: 'Videographer', events: 100 },
                        { name: 'Emily D.', role: 'Editor', events: 90 },
                    ].map((person, index) => (
                        <View key={index} style={styles.teamCard}>
                            <View style={styles.avatar} >
                                <Text style={styles.avatarText}>{person.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                            <Text style={styles.cardLabel}>{person.name}</Text>
                            <Text style={styles.cardSubText}>{person.role}</Text>
                            <Text style={styles.cardHighlight}>{person.events} Events</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            {/* 🎉 Event Type Breakdown */}
            <Text style={styles.sectionTitle}>📊 Event Type Breakdown</Text>
            <View style={styles.eventBreakdownContainer}>
                {/* Horizontal stacked bar */}
                <View style={styles.breakdownBar}>
                    {eventTypes.map((item, idx, arr) => {
                        const widthPercent = `${(item.count / total) * 100}%` as const;
                        return (
                            <View
                                key={idx}
                                style={[
                                    styles.barSegment,
                                    {
                                        width: widthPercent,
                                        backgroundColor: item.color,
                                        borderTopLeftRadius: idx === 0 ? 10 : 0,
                                        borderBottomLeftRadius: idx === 0 ? 10 : 0,
                                        borderTopRightRadius: idx === arr.length - 1 ? 10 : 0,
                                        borderBottomRightRadius: idx === arr.length - 1 ? 10 : 0,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Legends */}
                <View style={styles.legendContainer}>
                    {eventTypes.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>
                                {item.label} - {item.count}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

        </ScrollView>
    );
}

const getStyles = (darkMode: boolean, primaryColor: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#121212',
            paddingTop: 20,
            paddingBottom: 20
        },
        content: {
            padding: 16,
            paddingBottom: 80,
        },
        section: {
            marginBottom: 24,
        },
        greeting: {
            color: primaryColor,
            fontSize: 22,
            fontWeight: 'bold',
        },
        subGreeting: {
            color: '#aaa',
            fontSize: 14,
            marginTop: 4,
        },
        sectionTitle: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
        },
        cardRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        card: {
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            padding: 16,
            width: '48%',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2e2e40',
        },
        cardValue: {
            color: '#fff',
            fontSize: 20,
            fontWeight: '700',
        },
        cardLabel: {
            color: '#ccc',
            fontSize: 13,
            marginTop: 6,
        },
        cardSubText: {
            color: '#888',
            fontSize: 12,
            marginTop: 2,
        },
        cardHighlight: {
            color: '#3b82f6',
            marginTop: 4,
            fontSize: 13,
        },
        horizontalCard: {
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#2e2e40',
            padding: 16,
            marginRight: 12,
            width: 160,
        },
        teamCard: {
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#2e2e40',
            padding: 16,
            marginRight: 12,
            alignItems: 'center',
            width: 160,
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: primaryColor,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
        },

        chartWrapper: {
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            padding: 10,
            borderWidth: 1,
            borderColor: '#2e2e40',
            marginBottom: 32,
        },
        eventBreakdownContainer: {
            backgroundColor: '#1a1a2e',
            padding: 16,
            borderRadius: 16,
            borderColor: '#2e2e40',
            borderWidth: 1,
        },
        breakdownBar: {
            flexDirection: 'row',
            height: 12,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: '#2e2e40',
            marginBottom: 16,
        },
        barSegment: {
            height: '100%',
        },
        legendContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            width: '48%',
        },
        legendDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: 8,
        },
        legendText: {
            color: '#ccc',
            fontSize: 14,
        },
    });
