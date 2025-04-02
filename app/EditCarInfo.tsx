import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditCarInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State to manage form inputs and image
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Camry');
  const [year, setYear] = useState('2022');
  const [licensePlate, setLicensePlate] = useState('XYZ-1234');
  const [vin, setVin] = useState('1HGCM82633A123456');
  const [carImage, setCarImage] = useState('https://ymimg1.b8cdn.com/uploads/car_model/10892/pictures/13615159/Toyota-Camry-2025-Exterior-1.jpg');

  const handleSave = () => {
    // Logic to save the updated car information
    console.log('Car info saved:', { make, model, year, licensePlate, vin });
  };

  const handleImageUpload = () => {
    // Logic for uploading a new image (open image picker, etc.)
    console.log('Upload new car image');
    // Here, you would normally open a file picker to allow the user to choose a new image
    setCarImage('https://ymimg1.b8cdn.com/uploads/car_model/10892/pictures/13615159/Toyota-Camry-2025-Exterior-1.jpg'); // For demo purposes, updating with a new image URL
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Car Image */}
          <View style={styles.carImageContainer}>
            <Image source={{ uri: carImage }} style={styles.carImage} />
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <MaterialIcons name="cloud-upload" size={30} color={colors.tint} />
              <Text style={[styles.uploadButtonText, { color: colors.tint }]}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* Editable Car Details */}
          <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.carDetailsTitle, { color: colors.tint }]}>Edit Car Details</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Make */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="directions-car" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>Make</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={make}
                onChangeText={setMake}
                placeholder="Make"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Model */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="directions-car" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>Model</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={model}
                onChangeText={setModel}
                placeholder="Model"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Year */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="event" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>Year</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={year}
                onChangeText={setYear}
                placeholder="Year"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* License Plate */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="confirmation-number" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>License Plate</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder="License Plate"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* VIN */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="fingerprint" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>VIN</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={vin}
                onChangeText={setVin}
                placeholder="VIN"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.tint }]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom:20,
  },
  inputItem: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
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
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
