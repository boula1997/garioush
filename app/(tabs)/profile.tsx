import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

export default function ProfileScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg' }} style={styles.profileImage} />
        <Text style={[styles.profileName, { color: colors.text }]}>John Doe</Text>
      </View>
      
      {/* Profile Options */}
      <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/MyProfile')}>
          <MaterialIcons name="person" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>My Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/MyOrders')}>
          <MaterialIcons name="shopping-cart" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>My Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/MyCarInfo')}>
          <MaterialIcons name="directions-car" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>My Car Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/EditCarInfo')}>
          <MaterialIcons name="edit" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>Edit My Car Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <MaterialIcons name="settings" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});