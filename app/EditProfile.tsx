import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();

  // State to manage form inputs and image
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState('https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        console.log('Retrieved Token:', storedToken); // Log token
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
      console.log('Fetched profile data:', data);
      setProfileData(data); // Assuming 'data' contains the required profile details
      console.log(profileData);
    } catch (err) {
      console.error('Error fetching profile data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfileData(token);
      console.log("profileData", profileData);

    }
  }, [token]);

  const handleSave = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // Create a FormData object to handle both text and file data
      const formData = new FormData();
      formData.append('fullname', name);
      formData.append('email', email);
      formData.append('phone', phone);
      if (profileImage) {
        const filename = profileImage.split('/').pop();
        const type = `image/${filename.split('.').pop()}`;
        formData.append('image', {
          uri: profileImage,
          name: filename,
          type: type,
        });
      }
      if (password) {
        formData.append('password', password);
      }

      const response = await fetch('https://yousab-tech.com/groshy/public/api/auth/profile/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Do not include 'Content-Type' when using FormData; the browser sets it automatically
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error updating profile');
      }

      alert(responseData.message || 'Profile updated successfully');
      console.log('Updated profile data:', responseData.data);

      // Optionally update local state with the updated profile data
      setProfileData(responseData.data);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
  if (profileData) {
    setName(profileData.fullname || '');
    setEmail(profileData.email || '');
    setPhone(profileData.phone || '');
  }
}, [profileData]);



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
            <Image source={{ uri: profileData?.image }} style={styles.profileImage} />
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <MaterialIcons name="cloud-upload" size={30} color={colors.tint} />
              <Text style={[styles.uploadButtonText, { color: colors.tint }]}>{t('Upload')}</Text>
            </TouchableOpacity>
          </View>

          {/* Editable Profile Details */}
          <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.profileDetailsTitle, { color: colors.tint }]}>{t('Edit Profile')}</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={name} // Use `name` instead of `profileData?.fullname`
              onChangeText={setName}
              placeholder={t('Name')}
              placeholderTextColor={colors.tint}
            />

            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={email} // Use `email` instead of `profileData?.email`
              onChangeText={setEmail}
              placeholder={t('Email')}
              keyboardType="email-address"
              placeholderTextColor={colors.tint}
            />

            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={phone} // Use `phone` instead of `profileData?.phone`
              onChangeText={setPhone}
              placeholder={t('Phone')}
              keyboardType="phone-pad"
              placeholderTextColor={colors.tint}
            />


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
