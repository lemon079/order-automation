import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

// Helper to define local type to avoid import issues for now
interface OrderDetail {
    id: string;
    order_number: number;
    customer_name: string;
    customer_phone: string;
    pickup_address: string;
    dropoff_address: string;
    status: string;
    created_at: string;
    special_instructions?: string;
    items: { name: string; quantity: number }[];
}

export default function OrderDetails() {
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    async function fetchOrderDetails() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            Alert.alert('Error', 'Could not load order details');
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(newStatus: string) {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchOrderDetails();
            Alert.alert('Success', `Order status updated to ${newStatus}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    }

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    if (!order) {
        return <View style={styles.center}><Text>Order not found</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <View style={styles.header}>
                    <Text style={styles.title}>Order #{order.order_number}</Text>
                    <Text style={styles.statusBadge}>{order.status}</Text>
                </View>
                <Text style={styles.date}>Created: {new Date(order.created_at).toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer</Text>
                <Text style={styles.text}>{order.customer_name}</Text>
                <Text style={styles.text}>{order.customer_phone}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Locations</Text>
                <View style={styles.locationBlock}>
                    <Text style={styles.label}>Pickup</Text>
                    <Text style={styles.text}>{order.pickup_address}</Text>
                </View>
                <View style={[styles.locationBlock, { marginTop: 10 }]}>
                    <Text style={styles.label}>Dropoff</Text>
                    <Text style={styles.text}>{order.dropoff_address}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Items</Text>
                {order.items && Array.isArray(order.items) ? (
                    order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.text}>x{item.quantity}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.text}>No items listed</Text>
                )}
            </View>

            {order.special_instructions && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <Text style={styles.text}>{order.special_instructions}</Text>
                </View>
            )}

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => updateStatus('in_transit')}
                >
                    <Text style={styles.buttonText}>Start Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.successButton]}
                    onPress={() => updateStatus('delivered')}
                >
                    <Text style={styles.buttonText}>Complete Delivery</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        backgroundColor: 'white',
        padding: 16,
        marginTop: 12,
        marginHorizontal: 12,
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusBadge: {
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        overflow: 'hidden',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    date: {
        color: '#666',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    text: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    locationBlock: {
        paddingLeft: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
        paddingBottom: 4,
    },
    actions: {
        padding: 16,
        gap: 12,
        marginTop: 10,
        marginBottom: 30,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
    },
    successButton: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
