import React, { useState } from 'react';
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

const initialCart = [
  {
    id: '1',
    title: 'Synthetic Engine Oil 5W-30',
    price: 29.99,
    image: 'https://i5.walmartimages.com/seo/Mobil-1-Advanced-Full-Synthetic-Motor-Oil-5W-20-5-Quart_d481d07b-e2c3-45a9-b267-86b0b1ad8f99.e7397b4ced80f22e1a104fa987dd2606.jpeg',
    quantity: 1,
  },
  {
    id: '2',
    title: 'Air Filter',
    price: 19.99,
    image: 'https://i5.walmartimages.com/seo/Mobil-1-Advanced-Full-Synthetic-Motor-Oil-5W-20-5-Quart_d481d07b-e2c3-45a9-b267-86b0b1ad8f99.e7397b4ced80f22e1a104fa987dd2606.jpeg',
    quantity: 2,
  }
];

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [cart, setCart] = useState(initialCart);

  const increaseQuantity = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.cardBackground, borderColor:colors.border }]}>            
            <Image source={{ uri: item.image }} style={styles.image} />
            
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
                <MaterialIcons name="delete" size={24} color={colors.tint} style={{marginLeft:20,}} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      {/* Total & Checkout Section */}
      <View style={[styles.totalContainer,]}>
        <Text style={[styles.totalText, { color: colors.text }]}>Subtotal: <Text style={{ color: colors.tint }}>${calculateTotal()}</Text></Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.totalText, { color: colors.text }]}>Total: <Text style={{ color: colors.tint }}>${calculateTotal()}</Text></Text>
        <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: colors.tint }]}>
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
    marginTop:30,
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
  divider: {
    height: 1,
    // marginVertical: 16,
    opacity: 0.2,
    marginVertical:8,
  },
});
