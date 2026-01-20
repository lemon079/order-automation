import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@repo/shared';

const queryClient = createQueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Driver App</Text>
          <Text style={styles.subtitle}>Order Automation System</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Welcome Driver!</Text>
              <Text style={styles.cardDescription}>
                This is a React Native app in the Turborepo monorepo
              </Text>
            </View>
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Accept Order</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>✅ React Query Integrated</Text>
            <Text style={styles.infoText}>
              This app now has access to shared React Query hooks from @repo/shared.
              You can use useOrders(), useCreateOrder(), and other hooks just like in the web app!
            </Text>
          </View>

          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100vh' as any,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    padding: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#856404',
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});
