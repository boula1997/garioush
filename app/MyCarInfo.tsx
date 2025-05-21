import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function MyCarInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
   const { t } = useTranslation();


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      {/* Car Image */}
      <View style={styles.carImageContainer}>
        <Image source={{ uri: 'https://ymimg1.b8cdn.com/uploads/car_model/10892/pictures/13615159/Toyota-Camry-2025-Exterior-1.jpg' }} style={styles.carImage} />
      </View>
      
      {/* Car Details */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
        {/* Car Title */}
        <Text style={[styles.carDetailsTitle, { color: colors.tint }]}>{t('Car Details')}</Text>
        
        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        {/* Detail Items */}
        <View style={styles.detailItem}>
          <MaterialIcons name="directions-car" size={20} color={colors.tint} />
          <View style={styles.detailTextContainer}>
            <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('Make')}</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>{t('Toyota')}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialIcons name="directions-car" size={20} color={colors.tint} />
          <View style={styles.detailTextContainer}>
            <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('Model')}</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>{t('Camry')}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialIcons name="event" size={20} color={colors.tint} />
          <View style={styles.detailTextContainer}>
            <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('Year')}</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>2022</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialIcons name="confirmation-number" size={20} color={colors.tint} />
          <View style={styles.detailTextContainer}>
            <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('License Plate')}</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>XYZ-1234</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialIcons name="fingerprint" size={20} color={colors.tint} />
          <View style={styles.detailTextContainer}>
            <Text style={[styles.detailTitle, { color: colors.tint }]}>{t('VIN')}</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>1HGCM82633A123456</Text>
          </View>
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

