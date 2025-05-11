import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect

export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState(null);

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

  // This effect fetches the cart data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        fetchUserCart();
      }
    }, [token])
  );

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
        const updatedCart = data.cart ? Object.values(data.cart) : [];
        setCart(updatedCart);
        setTotal(data.total);
      } else {
        console.error("Failed to fetch cart: ", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart: ", error);
    }
  };

  const updateQuantity = async (hash, action) => {
    try {
      const response = await fetch(
        `https://yousab-tech.com/groshy/public/api/auth/update/item/count?action=${action}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ hash })
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchUserCart(); // Re-fetch full cart for sync
      } else {
        console.error("Failed to update quantity:", data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (hash) => {
    try {
      const response = await fetch('https://yousab-tech.com/groshy/public/api/auth/remove/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash }),
      });

      const data = await response.json();
      if (data.success) {
        fetchUserCart(); // Fetch latest cart instead of using returned cart
      } else {
        console.error("Failed to remove item:", data.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
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
              <Text style={[styles.price, { color: colors.tint }]}>${item.price}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.hash, 'decrement')}>
                  <MaterialIcons name="remove-circle-outline" size={24} color={colors.tint} />
                </TouchableOpacity>
                <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.hash, 'increment')}>
                  <MaterialIcons name="add-circle-outline" size={24} color={colors.tint} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.hash)}>
                <MaterialIcons name="delete" size={24} color={colors.tint} style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={[styles.totalText, { color: colors.text }]}>Subtotal: <Text style={{ color: colors.tint }}>${total.toFixed(2)}</Text></Text>
        <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: colors.tint }]} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
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
    borderWidth: 1,
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
