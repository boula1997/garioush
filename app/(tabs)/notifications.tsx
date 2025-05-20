import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';

const notifications = [
  {
    id: '1',
    title: 'Order Shipped',
    description: 'Your order #12345 has been shipped.',
    time: '2 hours ago',
    image: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  },
  {
    id: '2',
    title: 'New Discount Available',
    description: 'Get 20% off on your next purchase!',
    time: '5 hours ago',
    image: 'https://cdn-icons-png.flaticon.com/512/6337/6337806.png',
  },
  {
    id: '3',
    title: 'Payment Received',
    description: 'Your payment for order #12345 has been received.',
    time: '1 day ago',
    image: 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png',
  }
];

export default function NotificationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationItem, { backgroundColor: colors.cardBackground }]}>            
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{t(item.title)}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>{t(item.description)}</Text>
              <Text style={[styles.time, { color: colors.textSecondary }]}>{t(item.time)}</Text>
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});