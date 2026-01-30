import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'expo-router';
import { List } from 'lucide-react-native';

export default function Dashboard() {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(false);
    const router = useRouter();

    const toggleSwitch = () => setIsOnline(previousState => !previousState);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, Driver!</Text>
                <Text style={styles.subtext}>{user?.email}</Text>
            </View>

            <View style={[styles.card, { marginTop: 20 }]}>
                <View style={styles.statusRow}>
                    <Text style={styles.cardTitle}>Status</Text>
                    <View style={[styles.badge, { backgroundColor: isOnline ? '#34C759' : '#888' }]}>
                        <Text style={styles.badgeText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
                    </View>
                </View>
                <Text style={styles.description}>
                    {isOnline
                        ? "You are available to receive new orders."
                        : "Go online to start receiving orders."}
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={isOnline ? "#fff" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={isOnline}
                    style={{ marginTop: 10, alignSelf: 'flex-start' }}
                />
            </View>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(protected)/orders/')}>
                <View style={styles.iconCircle}>
                    <List size={24} color="#007AFF" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>View Active Orders</Text>
                    <Text style={styles.description}>Check your current assignments</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 10,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtext: {
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    actionCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 16,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eff6ff', // Light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
});
