import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../lib/auth';

export default function Profile() {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.email?.[0].toUpperCase()}</Text>
                </View>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Account Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Help & Support</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 30,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    section: {
        marginTop: 20,
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    menuItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    signOutButton: {
        margin: 20,
        backgroundColor: '#ff3b30',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    signOutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
