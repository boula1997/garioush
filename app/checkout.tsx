import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart } = useLocalSearchParams();

  const parsedCart = Array.isArray(cart) ? cart[0] : cart;
  const parsedCartData = JSON.parse(parsedCart || '[]');

  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('credit');
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [token, setToken] = useState('');
  const [walletBalance, setWalletBalance] = useState(null); // For storing wallet balance

    const paymentMethods = [
    { id: 'wallet', name: 'Wallet', icon: 'wallet', iconType: FontAwesome },
    { id: 'card', name: 'Cards', icon: 'credit-card', iconType: FontAwesome },
    { id: 'stc_pay', name: 'STC Pay', icon: 'mobile', iconType: FontAwesome },
  ];

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        fetchUserProfile(storedToken); // Fetch user profile
      } else {
        Alert.alert('Error', 'User not authenticated.');
      }
    };
    loadToken();
  }, []);

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch('http://oilminingshah.com/groshy/public/api/auth/user-profile', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data) {
        console.log("data",data);
        setWalletBalance(data.balance); // Assuming `wallet_balance` is the key for wallet balance
      } else {
        console.error('Error fetching profile:', data.message || 'Unknown error');
        Alert.alert('Error', 'Failed to fetch user profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching user profile.');
    }
  };

  const calculateTotal = () => {
    return parsedCartData
      .reduce((total, item) => total + parseFloat(item.price) * (item.quantity ?? 1), 0)
      ;
  };

const handleCheckout = async () => {
  if (!address || !mobile) {
    Alert.alert('Missing Info', 'Please fill out all fields!');
    return;
  }

  try {
    const response = await fetch(
      'http://oilminingshah.com/groshy/public/api/auth/order/store',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: address,
          paymentMethod: selectedPayment,
        }),
      }
    );

    const data = await response.json();
     console.log(data);
    if (response.ok && data.order) {
      router.push({
        pathname: '/OrderDetailsScreen',
        params: { order: JSON.stringify(data.order) },
      });
    } else {
      // Check for NoEnoughBalance error
      if (data?.errors?.message === "NoEnoughBalance") {
        console.log("Insufficient Balance", "You do not have enough balance in your wallet.");
        Alert.alert("Insufficient Balance", "You do not have enough balance in your wallet.");
      } else {
        Alert.alert('Order Failed', data.success || data.message || 'Please try again.');
      }
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong.');
  }
};

  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.tint }]}>Checkout</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Please provide your shipping details and select a payment method.
      </Text>

      {/* Shipping Details */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setIsShippingOpen(!isShippingOpen)}
          style={styles.toggleButton}
        >
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>
            <MaterialIcons name="local-shipping" size={20} /> Shipping Details
          </Text>
          <MaterialIcons
            name={isShippingOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        {isShippingOpen && (
          <View>
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
        )}
      </View>

      {/* Payment Methods */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setIsPaymentOpen(!isPaymentOpen)}
          style={styles.toggleButton}
        >
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>
            <MaterialIcons name="payment" size={20} /> Payment Method
          </Text>
          <MaterialIcons
            name={isPaymentOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        {isPaymentOpen && (
          <View>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  {
                    backgroundColor:
                      selectedPayment === method.id ? colors.tintLight : colors.inputBackground,
                    borderColor: selectedPayment === method.id ? colors.tint : colors.border,
                  },
                ]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <method.iconType
                  name={method.icon}
                  size={24}
                  color={selectedPayment === method.id ? colors.tint : colors.text}
                />
                <Text
                  style={[
                    styles.paymentText,
                    { color: selectedPayment === method.id ? colors.tint : colors.text },
                  ]}
                >
                  {method.name} {method.id=="wallet"?walletBalance:""}
                </Text>
                {selectedPayment === method.id && (
                  <FontAwesome name="check-circle" size={20} color={colors.tint} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Order Summary */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.tint }]}>
          <MaterialIcons name="receipt" size={20} /> Order Summary
        </Text>

        {parsedCartData.map((item) => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.cardBackground }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
              <View style={styles.itemPriceContainer}>
                <Text style={[styles.itemQuantity, { color: colors.text }]}>
                  {item.quantity} x ${item.price.toFixed(2)}
                </Text>
                <Text style={[styles.itemTotalPrice, { color: colors.tint }]}>
                  ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: colors.tint }]}>${calculateTotal()}</Text>
        </View>
      </View>

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
    padding: 10,
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
    marginBottom: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    marginVertical: 4,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemQuantity: {
    fontSize: 16,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
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
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
