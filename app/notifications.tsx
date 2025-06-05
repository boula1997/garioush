import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';

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
  },
];

export default function NotificationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    notificationItem: {
      backgroundColor: colors.cardBackground,
      shadowColor: colorScheme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: colorScheme === 'light' ? 0.1 : 0.3,
      shadowRadius: 3,
      elevation: colorScheme === 'light' ? 2 : 6, // for Android shadow
    },
    description: {
      color: colors.textSecondary,
      opacity: colorScheme === 'light' ? 0.8 : 0.6,
    },
    time: {
      color: colors.textSecondary,
      opacity: colorScheme === 'light' ? 0.6 : 0.5,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.7} style={[styles.notificationItem, dynamicStyles.notificationItem]}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
              // optional: add a background color placeholder for images
              defaultSource={'@/assets/imagePlaceholder.png'} // if you have one
            />
            <View style={styles.textContainer}>
              <ThemedText style={[styles.title, { color: colors.text }]}>{t(item.title)}</ThemedText>
              <ThemedText style={[styles.description, dynamicStyles.description, { color: colors.text }]}>{t(item.description)}</ThemedText>
              <ThemedText style={[styles.time, dynamicStyles.time, { color: colors.text }]}>{t(item.time)}</ThemedText>
            </View>
          </TouchableOpacity>
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
    backgroundColor: 'transparent',
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
  },
});
