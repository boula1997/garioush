import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const OrderDetailsScreen = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const order = JSON.parse(route.params.order);

  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('orderDetails')}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{t('orderId')}:</Text>
        <Text style={styles.value}>{order.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('total')}:</Text>
        <Text style={styles.value}>{order.total} {t('egp')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('address')}:</Text>
        <Text style={styles.value}>{order.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('createdAt')}:</Text>
        <Text style={styles.value}>
          {new Date(order.created_at).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.subHeading}>{t('products')}:</Text>

      {order.orderproducts.map((product, index) => (
        <View key={index} style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productText}>
              {t('quantity')}: {product.count}
            </Text>
            <Text style={styles.productText}>
              {t('subtotal')}: {product.total} {t('egp')}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
    subHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 12,
      color: isDark ? '#fff' : '#000',
    },
    section: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    label: {
      fontWeight: 'bold',
      width: 100,
      color: isDark ? '#ddd' : '#333',
    },
    value: {
      flex: 1,
      color: isDark ? '#ccc' : '#444',
    },
    productCard: {
      flexDirection: 'row',
      padding: 12,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
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
      color: isDark ? '#fff' : '#000',
    },
    productText: {
      fontSize: 14,
      marginTop: 4,
      color: isDark ? '#ccc' : '#555',
    },
  });

export default OrderDetailsScreen;
