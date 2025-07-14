import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserOrdersScreen() {
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Detect system color scheme
  const colorScheme = useColorScheme();

  // Define colors for light and dark mode
  const colors = {
    light: {
      background: '#f9f9f9',
      cardBackground: '#fff',
      shadowColor: '#000',
      titleColor: '#333',
      labelColor: '#000',
      keyColor: '#555',
      valueColor: '#333',
      iconColor: '#555',
      activityIndicator: '#000',
    },
    dark: {
      background: '#121212',
      cardBackground: '#1e1e1e',
      shadowColor: '#000',
      titleColor: '#eee',
      labelColor: '#fff',
      keyColor: '#bbb',
      valueColor: '#ccc',
      iconColor: '#ccc',
      activityIndicator: '#eee',
    },
  };

  const themeColors = colors[colorScheme] || colors.light;

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
          'http://oilminingshah.com/groshy/public/api/auth/orders?per_page=5',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              Accept: 'application/json',
            },
          }
        );

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
        color={themeColors.activityIndicator}
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ThemedText style={[styles.title, { color: themeColors.titleColor }]}>
        My Orders
      </ThemedText>

      {orders.map((order, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: themeColors.cardBackground,
              shadowColor: themeColors.shadowColor,
              elevation: themeColors.shadowColor ? 3 : 0,
            },
          ]}
        >
          <View style={styles.rowTop}>
            <ThemedText style={[styles.label, { color: themeColors.labelColor }]}>
              Order #{order.id}
            </ThemedText>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/OrderDetailsScreen',
                  params: { order: JSON.stringify(order) },
                })
              }
            >
              <Ionicons name="eye-outline" size={22} color={themeColors.iconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <ThemedText style={[styles.key, { color: themeColors.keyColor }]}>
              Status:
            </ThemedText>
            <ThemedText style={[styles.value, { color: themeColors.valueColor }]}>
              {order.status}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={[styles.key, { color: themeColors.keyColor }]}>
              Total:
            </ThemedText>
            <ThemedText style={[styles.value, { color: themeColors.valueColor }]}>
              {order.total} EGP
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={[styles.key, { color: themeColors.keyColor }]}>
              Date:
            </ThemedText>
            <ThemedText style={[styles.value, { color: themeColors.valueColor }]}>
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  key: {
    width: 70,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
});
