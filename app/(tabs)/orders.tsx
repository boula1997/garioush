import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function UserOrdersScreen() {
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const loadTokenAndFetchOrders = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          Alert.alert('Error', 'User not authenticated.');
          return;
        }

        setToken(storedToken);

        const response = await fetch(
          'https://yousab-tech.com/groshy/public/api/auth/orders?per_page=5',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              Accept: 'application/json',
            },
          }
        );

        console.log("boula",response);

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const json = await response.json();
        setOrders(json.data || []);
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error', 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadTokenAndFetchOrders();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#000"
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.title}>{t('My Orders')}</ThemedText>

      {orders.map((order, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.rowTop}>
            <ThemedText style={styles.label}>{t('Order')} #{order.id}</ThemedText>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/OrderDetailsScreen',
                  params: { order: JSON.stringify(order) },
                })
              }
            >
              <Ionicons name="eye-outline" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <ThemedText style={styles.key}>{t('Status')}:</ThemedText>
            <ThemedText style={styles.value}>{t(order.status)}</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.key}>{t('Total')}:</ThemedText>
            <ThemedText style={styles.value}>{t(order.total)} EGP</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.key}>{t('Date')}:</ThemedText>
            <ThemedText style={styles.value}>
              {new Date(order.created_at).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  key: {
    width: 70,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
});
