import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function MyProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg' }} style={styles.profileImage} />
        <Text style={[styles.profileName, { color: colors.tint }]}>John Doe</Text>
        <Text style={[styles.profileSubtitle, { color: colors.tint }]}>Software Engineer</Text>
      </View>
      
      {/* Profile Details */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>        
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>Email :-</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>johndoe@example.com</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>Phone :-</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>+1 234 567 890</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>Address :-</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>123 Main Street, City, Country</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>Gender :-</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>Male</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>Date of Birth :-</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>Jan 1, 1990</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>Membership :-</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>Premium</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  detailItem: {
    marginBottom: 16,
    alignItems: 'start',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
  },
});
