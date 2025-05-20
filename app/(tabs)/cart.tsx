import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState(null); // State to store the token
   const { t } = useTranslation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          console.log('Token retrieved:', storedToken);
          setToken(storedToken); // Save token to state
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserCart();
    }
  }, [token]); // Re-run when the token is set

  const fetchUserCart = async () => {
    try {
      const response = await fetch("https://yousab-tech.com/groshy/public/api/auth/cart", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        setTotal(data.total);
      } else {
        console.error("Failed to fetch cart: ", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart: ", error);
    }
  };

  const increaseQuantity = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    router.push(`/checkout?cart=${JSON.stringify(cart)}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.hash}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Image source={{ uri: item.image || "https://via.placeholder.com/70" }} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.price, { color: colors.tint }]}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                  <MaterialIcons name="remove-circle-outline" size={24} color={colors.tint} />
                </TouchableOpacity>
                <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                  <MaterialIcons name="add-circle-outline" size={24} color={colors.tint} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <MaterialIcons name="delete" size={24} color={colors.tint} style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={[styles.totalText, { color: colors.text }]}>{t('Subtotal:')} <Text style={{ color: colors.tint }}>${total.toFixed(2)}</Text></Text>
        <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: colors.tint }]} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>{t('Proceed to Checkout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  totalContainer: {
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkoutButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
