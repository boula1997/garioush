import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyCarInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [carInfo, setCarInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      fetch('http://oilminingshah.com/groshy/public/api/auth/carProfile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("boula", data);
          setCarInfo(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!carInfo) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Failed to load car information.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Car Image */}
      <View style={styles.carImageContainer}>
        <Image source={{ uri: 'https://ymimg1.b8cdn.com/uploads/car_model/10892/pictures/13615159/Toyota-Camry-2025-Exterior-1.jpg' }} style={styles.carImage} />
      </View>

      {/* Car Details */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.carDetailsTitle, { color: colors.tint }]}>Car Details</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {Object.entries(carInfo).map(([key, value]) => (
          <View style={styles.detailItem} key={key}>
            <MaterialIcons name="info" size={20} color={colors.tint} />
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailTitle, { color: colors.tint }]}>{key}</Text>
              <Text style={[styles.detailText, { color: colors.text }]}>{value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  carImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  carImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  carDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 10,
    opacity: 0.2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 16,
  },
});
