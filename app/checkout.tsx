import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart } = useLocalSearchParams();

  // Parse the cart
  const parsedCart = Array.isArray(cart) ? cart[0] : cart;
  const parsedCartData = JSON.parse(parsedCart || '[]');

  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('credit');

  const paymentMethods = [
    { id: 'credit', name: 'Credit Card', icon: 'credit-card', iconType: FontAwesome },
    { id: 'paypal', name: 'PayPal', icon: 'paypal', iconType: FontAwesome },
    { id: 'apple', name: 'Apple Pay', icon: 'apple', iconType: FontAwesome },
    { id: 'google', name: 'Google Pay', icon: 'google-wallet', iconType: FontAwesome },
    { id: 'cash', name: 'Cash on Delivery', icon: 'money', iconType: FontAwesome },
  ];

  const calculateTotal = () => {
    return parsedCartData.reduce(
      (total, item) => total + (parseFloat(item.price) * (item.quantity ?? 1)),
      0
    ).toFixed(2);
  };

  const handleCheckout = () => {
    if (address && mobile) {
      console.log('Proceeding to payment with method:', selectedPayment);
      router.push('/payment-confirmation');
    } else {
      alert('Please fill out all fields!');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Please provide your shipping details and select a payment method.
      </Text>

      {/* Shipping Details Section */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.tint }]}>
          <MaterialIcons name="local-shipping" size={20} /> Shipping Details
        </Text>
        
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
          placeholder="Enter your address"
          placeholderTextColor={colors.textSecondary}
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
          placeholder="Enter your mobile number"
          placeholderTextColor={colors.textSecondary}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* Payment Methods Section */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.tint }]}>
          <MaterialIcons name="payment" size={20} /> Payment Method
        </Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              { 
                backgroundColor: selectedPayment === method.id ? colors.tintLight : colors.inputBackground,
                borderColor: selectedPayment === method.id ? colors.tint : colors.border 
              }
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <method.iconType 
              name={method.icon} 
              size={24} 
              color={selectedPayment === method.id ? colors.tint : colors.text} 
            />
            <Text style={[
              styles.paymentText, 
              { color: selectedPayment === method.id ? colors.tint : colors.text }
            ]}>
              {method.name}
            </Text>
            {selectedPayment === method.id && (
              <FontAwesome name="check-circle" size={20} color={colors.tint} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order Summary Section */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.tint }]}>
          <MaterialIcons name="receipt" size={20} /> Order Summary
        </Text>
        
        {parsedCartData.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={[styles.summaryText, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.summaryText, { color: colors.text }]}>
              {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * parseFloat(item.price)).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: colors.tint }]}>${calculateTotal()}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        style={[styles.confirmButton, { backgroundColor: colors.tint }]}
        onPress={handleCheckout}
        disabled={!address || !mobile}
      >
        <Text style={styles.buttonText}>Complete Purchase</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});