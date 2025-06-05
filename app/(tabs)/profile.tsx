import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';

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
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        Alert.alert(t('Error'), t('Failed to retrieve token.'));
      }
    };
    getTokenAndFetchData();
  }, []);

  const fetchProfileData = async (authToken) => {
    try {
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
      setProfileData(data);
    } catch (err) {
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
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={{ marginTop: 10 }}>{t('Loading...')}</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
        ]}
      >
        <ThemedText>{t('Failed to load profile.')}</ThemedText>
        <ThemedText>{t(error)}</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              profileData?.image ||
              'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
          }}
          style={styles.profileImage}
        />
        <ThemedText style={styles.profileName}>
          {profileData?.fullname || t('John Doe')}
        </ThemedText>
      </View>

      {/* Profile Options */}
      <View style={styles.menuContainer}>
        {[
          { icon: 'person', label: 'My Profile', route: '/MyProfile' },
          { icon: 'shopping-cart', label: 'My Orders', route: '/orders' },
          { icon: 'directions-car', label: 'My Car Info', route: '/MyCarInfo' },
          { icon: 'edit', label: 'Edit My Car Info', route: '/EditCarInfo' },
          { icon: 'settings', label: 'Edit Profile', route: '/EditProfile' },
        ].map(({ icon, label, route }) => (
          <TouchableOpacity
            key={label}
            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
            onPress={() => router.push(route)}
            activeOpacity={0.7}
          >
            <MaterialIcons name={icon} size={24} color={colors.tint} />
            <ThemedText style={styles.menuText}>{t(label)}</ThemedText>
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#ccc',
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
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
