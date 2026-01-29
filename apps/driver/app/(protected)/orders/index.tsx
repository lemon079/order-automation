import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'expo-router';
// Local types used below

// Preliminary simplified type if import fails or as a fallback
interface SimpleOrder {
    id: string;
    order_number: number;
    customer_name: string;
    pickup_address: string;
    dropoff_address: string;
    status: string;
    created_at: string;
}

export default function OrdersList() {
    const [orders, setOrders] = useState<SimpleOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const renderItem = ({ item }: { item: SimpleOrder }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(protected)/orders/${item.id}`)}
        >
            <View style={styles.header}>
                <Text style={styles.orderNumber}>#{item.order_number}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>
            <Text style={styles.customer}>{item.customer_name}</Text>
            <View style={styles.locationContainer}>
                <Text style={styles.label}>Pickup:</Text>
                <Text style={styles.address} numberOfLines={1}>{item.pickup_address}</Text>
            </View>
            <View style={styles.locationContainer}>
                <Text style={styles.label}>Dropoff:</Text>
                <Text style={styles.address} numberOfLines={1}>{item.dropoff_address}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No orders found</Text> : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    customer: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    locationContainer: {
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    address: {
        fontSize: 14,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
    },
});
