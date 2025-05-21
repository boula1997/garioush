import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const OrderDetailsScreen = () => {
  const route = useRoute();
  const order = JSON.parse(route.params.order);
  const { t } = useTranslation();


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('Order Details')}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{t('Order ID')}:</Text>
        <Text style={styles.value}>{t(order.id)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('Total')}:</Text>
        <Text style={styles.value}>{t(order.total)} EGP</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('Address')}:</Text>
        <Text style={styles.value}>{t(order.address)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('Created At')}:</Text>
        <Text style={styles.value}>{new Date(order.created_at).toLocaleString()}</Text>
      </View>

      <Text style={styles.subHeading}>{t('Products')}:</Text>

      {order.orderproducts.map((product, index) => (
        <View key={index} style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{t(product.title)}</Text>
            <Text style={styles.productText}>{t('Quantity')}: {t(product.count)}</Text>
            <Text style={styles.productText}>{('Subtotal')}: {t(product.total)} EGP</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  section: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default OrderDetailsScreen;
