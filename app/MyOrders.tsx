import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';

const orders = [
  {
    id: '1',
    title: 'Synthetic Engine Oil 5W-30',
    image: 'https://i5.walmartimages.com/seo/Mobil-1-Advanced-Full-Synthetic-Motor-Oil-5W-20-5-Quart_d481d07b-e2c3-45a9-b267-86b0b1ad8f99.e7397b4ced80f22e1a104fa987dd2606.jpeg',
    status: 'Delivered',
    price: 29.99,
  },
  {
    id: '2',
    title: 'Car Air Filter',
    image: 'https://m.media-amazon.com/images/I/71SRS5E+NfL.jpg',
    status: 'Shipped',
    price: 19.99,
  },
  {
    id: '3',
    title: 'Brake Pads Set',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPVxZ2e0yDnl_gm5PEnXppTje4E92Ks9TO3Q&s',
    status: 'Processing',
    price: 49.99,
  }
];

export default function MyOrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t, i18n } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      <Text style={[styles.header, { color: colors.tint }]}>{t('my_orders')}</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.orderCard, { backgroundColor: colors.cardBackground }]}>            
            <Image source={{ uri: item.image }} style={styles.orderImage} />
            <View style={styles.orderDetails}>
              <Text style={[styles.orderTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.orderStatus, { color: colors.tint }]}>{item.status}</Text>
              <Text style={[styles.orderPrice, { color: colors.tint }]}>${item.price.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  }
});
