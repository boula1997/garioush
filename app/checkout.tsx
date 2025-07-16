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
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const parsedCart = Array.isArray(cart) ? cart[0] : cart;
  const parsedCartData = JSON.parse(parsedCart || '[]');

  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);
  const [token, setToken] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'wallet', name: t('wallet'), icon: 'wallet', iconType: FontAwesome },
    { id: 'card', name: t('cards'), icon: 'credit-card', iconType: FontAwesome },
    { id: 'stc_pay', name: t('stc_pay'), icon: 'mobile', iconType: FontAwesome },
  ];

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          Alert.alert(t('error'), t('not_authenticated'));
          router.push('/login');
          return;
        }
        setToken(storedToken);
        fetchUserProfile(storedToken);
      } catch (error) {
        Alert.alert(t('error'), t('auth_error'));
      }
    };
    loadToken();
  }, []);

  const fetchUserProfile = async (authToken) => {
    setLoading(true);
    try {
      const response = await fetch('https://yousab-tech.com/groshy/public/api/auth/user-profile', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'locale': i18n.language
        },
      });

      const data = await response.json();
      if (response.ok) {
        setWalletBalance(data.balance || 0);
      } else {
        throw new Error(data.message || t('fetch_profile_failed'));
      }
    } catch (error) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return parsedCartData
      .reduce((total, item) => total + parseFloat(item.price) * (item.quantity ?? 1), 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (!address || !mobile) {
      Alert.alert(t('missing_info'), t('fill_all_fields'));
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        'https://yousab-tech.com/groshy/public/api/auth/order/store',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'locale': i18n.language
          },
          body: JSON.stringify({
            address: address,
            mobile: mobile,
            paymentMethod: selectedPayment,
            cart: parsedCartData
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.order) {
        router.push({
          pathname: '/OrderDetailsScreen',
          params: { order: JSON.stringify(data.order) },
        });
      } else {
        if (data?.errors?.message === "NoEnoughBalance") {
          Alert.alert(t('insufficient_balance'), t('not_enough_balance'));
        } else {
          Alert.alert(t('order_failed'), data.message || t('try_again'));
        }
      }
    } catch (error) {
      Alert.alert(t('error'), t('checkout_error'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <Text style={[styles.title, { color: colors.tint }]}>{t('checkout')}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t('checkout_description')}
      </Text>

      {/* Shipping Details */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setIsShippingOpen(!isShippingOpen)}
          style={[styles.toggleButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>
            <MaterialIcons name="local-shipping" size={20} /> {t('shipping_details')}
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
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.inputBackground, 
                  borderColor: colors.border,
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}
              placeholder={t('enter_address')}
              placeholderTextColor={colors.textSecondary}
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.inputBackground, 
                  borderColor: colors.border,
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}
              placeholder={t('enter_mobile')}
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
          style={[styles.toggleButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>
            <MaterialIcons name="payment" size={20} /> {t('payment_method')}
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
                    backgroundColor: selectedPayment === method.id ? colors.tintLight : colors.inputBackground,
                    borderColor: selectedPayment === method.id ? colors.tint : colors.border,
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                  }
                ]}
                onPress={() => setSelectedPayment(method.id)}
                disabled={method.id === 'wallet' && parseFloat(calculateTotal()) > walletBalance}
              >
                <method.iconType
                  name={method.icon}
                  size={24}
                  color={
                    selectedPayment === method.id ? colors.tint : 
                    (method.id === 'wallet' && parseFloat(calculateTotal()) > walletBalance) ? colors.textDisabled : colors.text
                  }
                />
                <Text
                  style={[
                    styles.paymentText, 
                    { 
                      color: 
                        selectedPayment === method.id ? colors.tint : 
                        (method.id === 'wallet' && parseFloat(calculateTotal()) > walletBalance) ? colors.textDisabled : colors.text,
                      [isRTL ? 'marginRight' : 'marginLeft']: 12
                    }
                  ]}
                >
                  {method.name} {method.id === "wallet" && `(${walletBalance} ${t('currency')})`}
                </Text>
                {selectedPayment === method.id && (
                  <FontAwesome 
                    name="check-circle" 
                    size={20} 
                    color={colors.tint} 
                    style={isRTL ? { marginRight: 'auto' } : { marginLeft: 'auto' }} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Order Summary */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.tint }]}>
          <MaterialIcons name="receipt" size={20} /> {t('order_summary')}
        </Text>

        {parsedCartData.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.itemCard, 
              { 
                backgroundColor: colors.cardBackground,
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.description}</Text>
              <View style={[styles.itemPriceContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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

        <View style={[styles.totalContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>{t('total')}:</Text>
          <Text style={[styles.totalAmount, { color: colors.tint }]}>${calculateTotal()}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, { 
          backgroundColor: colors.tint,
          opacity: (!address || !mobile || processing) ? 0.6 : 1 
        }]}
        onPress={handleCheckout}
        disabled={!address || !mobile || processing}
      >
        {processing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>{t('complete_purchase')}</Text>
        )}
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
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleButton: {
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
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 16,
    flex: 1,
  },
  itemCard: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginHorizontal: 16,
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