import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  I18nManager,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import axios from 'axios';

export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState(null);
  const { t } = useTranslation();

  const isRTL = I18nManager.isRTL;

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  const fetchUserCart = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('http://oilminingshah.com/groshy/public/api/auth/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          locale: i18n.language // ✅ Language header
        }
      });
      const data = await response.json();
      if (data.success) {
        const updatedCart = data.cart ? Object.values(data.cart) : [];
        setCart(updatedCart);
        setTotal(data.total ?? 0);
      } else {
        console.error('Failed to fetch cart:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchUserCart();
    }, [fetchUserCart])
  );

  const updateQuantity = async (hash, action) => {
    // alert(action);
    // alert(hash);
    if (!token) return;
    try {
      const response = await fetch(
        `http://oilminingshah.com/groshy/public/api/auth/update/item/count?action=${action}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            // locale: i18n.language
          },
          body: JSON.stringify({ hash })
        }
      );
      const data = await response.json();
      axios.post('https://yousab-tech.com/workspace/public/api/track', { data: response, label: "label", time: new Date().toISOString(), }).catch((err) => { alert('Failed to send debug log'); });

      if (data.success) {
        fetchUserCart();
      } else {
        console.error('Failed to update quantity:', data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (hash) => {
    if (!token) return;
    try {
      const response = await fetch(
        'http://oilminingshah.com/groshy/public/api/auth/remove/cart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            locale: i18n.language
          },
          body: JSON.stringify({ hash })
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchUserCart();
      } else {
        console.error('Failed to remove item:', data.message);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    router.push({
      pathname: '/checkout',
      params: { cart: JSON.stringify(cart) }
    });
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.cartItem,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/70' }}
        style={[styles.image, { marginLeft: isRTL ? 12 : 0, marginRight: isRTL ? 0 : 12 }]}
      />
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.price, { color: colors.tint }]}>
          ${item.price}
        </Text>
      </View>
      <View
        style={[
          styles.actionsContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row', marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }
        ]}
      >
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.hash, 'decrement')}>
            <MaterialIcons name="remove-circle-outline" size={24} color={colors.tint} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity onPress={() => updateQuantity(item.hash, 'increment')}>
            <MaterialIcons name="add-circle-outline" size={24} color={colors.tint} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.hash)}>
          <MaterialIcons
            name="delete"
            size={24}
            color={colors.tint}
            style={{ marginHorizontal: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.hash}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 40 }}>
            {t('Your cart is empty.')}
          </Text>
        }
      />
      <View
        style={[
          styles.totalContainer,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            shadowColor: colors.shadow
          }
        ]}
      >
        <Text style={[styles.totalText, { color: colors.text }]}>
          {t('Subtotal')}{' '}
          <Text style={{ color: colors.tint }}>${total.toFixed(2)}</Text>
        </Text>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: colors.tint }]}
          onPress={handleCheckout}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutText}>{t('Proceed to Checkout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  cartItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5
      },
      android: {
        elevation: 3
      }
    })
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8
  },
  detailsContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 14,
    marginTop: 4
  },
  actionsContainer: {
    alignItems: 'center'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10
  },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5
      },
      android: {
        elevation: 10
      }
    })
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  checkoutButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
