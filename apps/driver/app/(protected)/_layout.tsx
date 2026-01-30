import { Tabs } from 'expo-router';
import { Chrome as Home, List, User } from 'lucide-react-native';

export default function ProtectedLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#000' }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    headerShown: false,
                    title: 'Orders',
                    tabBarIcon: ({ color }) => <List size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
