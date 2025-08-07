import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function MyProfileScreen() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [token, setToken] = useState(null);
  const { t, i18n } = useTranslation();

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
      }
    };

    getTokenAndFetchData();
  }, []);

  const fetchProfileData = async (authToken) => {
    try {
      console.log('Fetching profile with token:', authToken);
      const response = await fetch(
        'https://oilminingshah.com/groshy/public/api/auth/user-profile',
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>
        {t('error_fetching_profile')} {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: profileData?.image }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: colors.tint }]}>
          {profileData?.fullname || 'No Name'}
        </Text>
        <Text style={[styles.profileSubtitle, { color: colors.tint }]}>
        {t('user')}
        </Text>
      </View>

      {/* Profile Details */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('email')}</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            {profileData?.email || 'Not Provided'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('phone')}</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            {profileData?.phone || 'Not Provided'}
          </Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    alignItems: 'flex-start',
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
