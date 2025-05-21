import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
   const { t } = useTranslation();

  // State to manage form inputs and image
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [profileImage, setProfileImage] = useState('https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Logic to save the updated profile information
    console.log('Profile info saved:', { name, email, phone, password });
  };

  const handleImageUpload = () => {
    // Logic for uploading a new profile image (open image picker, etc.)
    console.log('Upload new profile image');
    setProfileImage('https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg'); // For demo purposes, updating with a new image URL
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <MaterialIcons name="cloud-upload" size={30} color={colors.tint} />
              <Text style={[styles.uploadButtonText, { color: colors.tint }]}>{t('Upload')}</Text>
            </TouchableOpacity>
          </View>

          {/* Editable Profile Details */}
          <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.profileDetailsTitle, { color: colors.tint }]}>{t('Edit Profile')}</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Name */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="person" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>{t('Name')}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder={t('Name')}
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Email */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="email" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>{t('Email')}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder={t('Email')}
                keyboardType="email-address"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="phone" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>{t('Phone')}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder={t('Phone')}
                keyboardType="phone-pad"
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Password */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="lock" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>{t('Password')}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder={t('Password')}
                secureTextEntry
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputItem}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="lock" size={20} color={colors.tint} />
                <Text style={[styles.label, { color: colors.tint }]}>{t('Confirm Password')}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('Confirm Password')}
                secureTextEntry
                placeholderTextColor={colors.tint}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.tint }]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('Save')}</Text>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  profileDetailsTitle: {
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
