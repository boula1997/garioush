import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        console.log('Retrieved Token:', storedToken);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert(t('Error'), t('Failed to retrieve token.'));
      }
    };

    getTokenAndFetchData();
  }, []);

  const fetchProfileData = async (authToken) => {
    try {
      console.log('Fetching profile with token:', authToken);
      const response = await fetch(
        'https://yousab-tech.com/groshy/public/api/auth/user-profile',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching profile data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfileData(token);
    }
  }, [token]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.text, marginTop: 10 }}>{t('Loading...')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('Failed to load profile.')}</Text>
        <Text style={{ color: colors.text }}>{t(error)}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: profileData?.image || 'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: colors.text }]}>
          {profileData?.fullname || t('John Doe')}
        </Text>
      </View>

      {/* Profile Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/MyProfile')}>
          <MaterialIcons name="person" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('My Profile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/orders')}>
          <MaterialIcons name="shopping-cart" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('My Orders')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/MyCarInfo')}>
          <MaterialIcons name="directions-car" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('My Car Info')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/EditCarInfo')}>
          <MaterialIcons name="edit" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('Edit My Car Info')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/EditProfile')}>
          <MaterialIcons name="settings" size={24} color={colors.tint} />
          <Text style={[styles.menuText, { color: colors.text }]}>{t('Edit Profile')}</Text>
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
