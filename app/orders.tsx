import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  I18nManager,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

export default function UserOrdersScreen() {
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const loadTokenAndFetchOrders = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          Alert.alert(t('error'), t('not_authenticated'));
          router.push('/login');
          return;
        }

        setToken(storedToken);

        const response = await fetch(
          'https://yousab-tech.com/groshy/public/api/auth/orders?per_page=5',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Accept': 'application/json',
              'locale': i18n.language,
            },
          }
        );

        if (!response.ok) {
          throw new Error(t('fetch_orders_failed'));
        }

        const json = await response.json();
        setOrders(json.data || []);
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert(t('error'), t('load_orders_failed'));
      } finally {
        setLoading(false);
      }
    };

    loadTokenAndFetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={themeColors.tint}
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { 
          backgroundColor: themeColors.background,
          direction: isRTL ? 'rtl' : 'ltr'
        },
      ]}
    >
      <ThemedText style={[styles.title, { color: themeColors.text }]}>
        {t('my_orders')}
      </ThemedText>

      {orders.length === 0 ? (
        <ThemedText style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          {t('no_orders_found')}
        </ThemedText>
      ) : (
        orders.map((order, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                backgroundColor: themeColors.cardBackground,
                shadowColor: themeColors.shadow,
              },
            ]}
          >
            <View style={[styles.rowTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <ThemedText style={[styles.label, { color: themeColors.text }]}>
                {t('order')} #{order.id}
              </ThemedText>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/OrderDetailsScreen',
                    params: { order: JSON.stringify(order) },
                  })
                }
              >
                <Ionicons 
                  name="eye-outline" 
                  size={22} 
                  color={themeColors.tint} 
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <ThemedText style={[styles.key, { color: themeColors.textSecondary }]}>
                {t('status')}:
              </ThemedText>
              <ThemedText style={[styles.value, { color: themeColors.text }]}>
                {t(order.status.toLowerCase())}
              </ThemedText>
            </View>
            <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <ThemedText style={[styles.key, { color: themeColors.textSecondary }]}>
                {t('total')}:
              </ThemedText>
              <ThemedText style={[styles.value, { color: themeColors.text }]}>
                {order.total} {t('currency')}
              </ThemedText>
            </View>
            <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <ThemedText style={[styles.key, { color: themeColors.textSecondary }]}>
                {t('date')}:
              </ThemedText>
              <ThemedText style={[styles.value, { color: themeColors.text }]}>
                {formatDate(order.created_at)}
              </ThemedText>
            </View>
          </View>
        ))
      )}
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
    textAlign: 'left',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  rowTop: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
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