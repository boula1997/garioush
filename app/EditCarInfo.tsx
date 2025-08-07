import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function EditCarInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t, i18n } = useTranslation();

  const [carData, setCarData] = useState({
    carBrand: '',
    carModel: '',
    manufactureYear: '',
    mileage: '',
    belt_changed_at: '',
    brake_pad_changed_at: '',
    disc_changed_at: '',
    tire_changed_at: '',
    alignment_at: '',
    battery_status: '',
    engine_oil_status: '',
    brake_oil_status: '',
    power_oil_status: '',
    transmission_oil_status: '',
    transmission_type: '',
  });

  const [loading, setLoading] = useState(false);

  // Fetch car data from API
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
          Alert.alert('Error', 'No auth token found.');
          return;
        }

        const response = await axios.get(
          'https://oilminingshah.com/groshy/public/api/auth/carProfile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCarData(response.data?.data || carData);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch car data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  // Save updated car data to API
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('Error', 'No auth token found.');
        return;
      }

      const response = await axios.post(
        'https://oilminingshah.com/groshy/public/api/auth/carProfile/store',
        carData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', response.data?.message || 'Car info updated.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save car data.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ marginTop: 10 }}>Loading car info...</Text>
      </View>
    );
  }

  // Map keys to nicer labels (optional)
  const labels: Record<string, string> = {
    carBrand: 'Car Brand',
    carModel: 'Car Model',
    manufactureYear: 'Manufacture Year',
    mileage: 'Mileage',
    belt_changed_at: 'Belt Changed At',
    brake_pad_changed_at: 'Brake Pad Changed At',
    disc_changed_at: 'Disc Changed At',
    tire_changed_at: 'Tire Changed At',
    alignment_at: 'Alignment At',
    battery_status: 'Battery Status',
    engine_oil_status: 'Engine Oil Status',
    brake_oil_status: 'Brake Oil Status',
    power_oil_status: 'Power Oil Status',
    transmission_oil_status: 'Transmission Oil Status',
    transmission_type: 'Transmission Type',
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Editable Car Details */}
          <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.carDetailsTitle, { color: colors.tint }]}>
              {t("Edit Car Details")}
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {Object.keys(carData).map((key) => (
              <View key={key} style={styles.inputItem}>
                <Text style={[styles.label, { color: colors.tint }]}>{labels[key] || key}</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={carData[key] ? carData[key].toString() : ''}
                  onChangeText={(value) =>
                    setCarData((prev) => ({ ...prev, [key]: value }))
                  }
                  placeholder={labels[key] || key}
                  placeholderTextColor={colors.tint}
                />
              </View>
            ))}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.tint }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>{t("Save")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: { flexGrow: 1 },
  container: { flex: 1, padding: 16 },
  detailsContainer: { padding: 16, borderRadius: 10, marginTop: 10 },
  carDetailsTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  divider: { height: 1, marginVertical: 10, opacity: 0.2, marginBottom: 20 },
  inputItem: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
