import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart } = useLocalSearchParams();

  // Parse the cart, ensure it's a valid string
  const parsedCart = Array.isArray(cart) ? cart[0] : cart;
  const parsedCartData = JSON.parse(parsedCart || '[]');

  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [isCreditCardSelected, setIsCreditCardSelected] = useState(false);

  // Calculate the total amount
  const calculateTotal = () => {
    return parsedCartData.reduce(
      (total, item) => total + (parseFloat(item.price) * (item.quantity ?? 1)),
      0
    ).toFixed(2);
  };

  const handleCheckout = () => {
    if (address && mobile) {
      console.log('Proceed to payment');
    } else {
      console.log('Please fill out all fields!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Please provide your shipping details and select a payment method.
      </Text>

      {/* Address Input */}
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        placeholder="Enter your address"
        placeholderTextColor={colors.textSecondary}
        value={address}
        onChangeText={setAddress}
      />

      {/* Mobile Input */}
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        placeholder="Enter your mobile number"
        placeholderTextColor={colors.textSecondary}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      {/* Custom Checkbox for Credit Card */}
      <TouchableOpacity
        style={[styles.checkboxContainer, { backgroundColor: isCreditCardSelected ? colors.tint : colors.cardBackground }]}
        onPress={() => setIsCreditCardSelected(!isCreditCardSelected)}
      >
        <View style={styles.checkbox}>
          {isCreditCardSelected && <View style={styles.checked} />}
        </View>
        <Text style={[styles.checkboxText, { color: colors.text }]}>Credit Card</Text>
      </TouchableOpacity>

      {/* Order Summary */}
      <View style={styles.orderSummaryContainer}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
        {parsedCartData.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={[styles.summaryText, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.summaryText, { color: colors.text }]}>
              {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * parseFloat(item.price)).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <Text style={[styles.totalText, { color: colors.text }]}>
          Total: <Text style={{ color: colors.tint }}>${calculateTotal()}</Text>
        </Text>
      </View>

      {/* Proceed to Payment Button */}
      <TouchableOpacity
        style={[styles.confirmButton, { backgroundColor: colors.tint }]}
        onPress={handleCheckout}
      >
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: 'green', // or your tint color
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 8,
  },
  orderSummaryContainer: {
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryItem: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
