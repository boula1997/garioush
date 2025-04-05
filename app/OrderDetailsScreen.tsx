import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function OrderDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Static order details
  const orderDetails = {
    cartItems: [
      {
        id: 1,
        title: "Item 1",
        subtitle: "Description of Item 1",
        price: 29.99,
        quantity: 2,
        image: "data:image/jpeg;base64,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"
      },
      {
        id: 2,
        title: "Item 2",
        subtitle: "Description of Item 2",
        price: 49.99,
        quantity: 1,
        image: "https://autoparts-cdn.beforward.jp/img/page/top/most-popular-categories/suspension-assemblies.jpg"
      }
    ],
    totalAmount: 109.97,
    address: "123 Main St, City, Country",
    mobile: "+1234567890",
    paymentMethod: "Credit Card",
    orderStatus: "Shipped", // Added order status
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Order Details</Text>

      <Text style={[styles.sectionTitle, { color: colors.tint }]}>Order Summary</Text>
      {orderDetails.cartItems.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
            <View style={styles.itemPriceContainer}>
              <Text style={[styles.itemQuantity, { color: colors.text }]}>
                Quantity :  {item.quantity}
              </Text>
              <Text style={[styles.itemTotalPrice, { color: colors.tint }]}>
                ${(item.quantity * parseFloat(item.price)).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
        <Text style={[styles.totalAmount, { color: colors.tint }]}>${orderDetails.totalAmount}</Text>
      </View>
 {/* Order Status Section */}
 <Text style={[styles.sectionTitle, { color: colors.tint }]}>Order Status</Text>
      <Text style={[styles.detailsText, { color: colors.text }]}>
        Status: <Text style={{ fontWeight: 'bold', color: getStatusColor(orderDetails.orderStatus) }}>
          {orderDetails.orderStatus}
        </Text>
      </Text>
      <Text style={[styles.sectionTitle, { color: colors.tint }]}>Shipping Details</Text>
      <Text style={[styles.detailsText, { color: colors.text }]}>Address: {orderDetails.address}</Text>
      <Text style={[styles.detailsText, { color: colors.text }]}>Mobile: {orderDetails.mobile}</Text>

      <Text style={[styles.sectionTitle, { color: colors.tint }]}>Payment Method</Text>
      <Text style={[styles.detailsText, { color: colors.text }]}>
        Payment Method: {orderDetails.paymentMethod}
      </Text>

     
    </ScrollView>
  );
}

// Function to return color based on order status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return '#FFA500'; // Orange for Pending
    case 'Shipped':
      return '#1E90FF'; // Blue for Shipped
    case 'Delivered':
      return '#32CD32'; // Green for Delivered
    case 'Cancelled':
      return '#FF6347'; // Red for Cancelled
    default:
      return '#000000'; // Default to black if status not recognized
  }
};

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 16,
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 8,
  },
});
