import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; 
import { useTranslation } from 'react-i18next';


export default function AuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [showPassword, setShowPassword] = useState(false);
  const [showpassword_confirmation, setShowpassword_confirmation] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const { t } = useTranslation();

  // Auth state
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    fullname: '',
    phone: '',
  });

  // Car registration state
  const [carData, setCarData] = useState({
    image: null,
    brand: '',
    model: '',
    year: '',
    licensePlate: ''
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCarData({ ...carData, image: result.assets[0].uri });
    }
  };

  const handleAuthSubmit = async () => {
    try {
      // Perform user registration logic here (e.g., API call)
      const response = await axios.post('https://yousab-tech.com/groshy/public/api/auth/register', {
        email: authData.email,
        password: authData.password,
        password_confirmation: authData.password_confirmation,
        fullname: authData.fullname,
        phone: authData.phone,
      });

      if (response.data.success) {
        console.log('User registered successfully:', response.data);
        router.push('/login')// Show the car registration form after successful registration
      } else {
        console.error('Error registering user:', response.data.message);
        alert(response.data.message); // Alert the user in case of an error
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while registering.');
    }
  };

  const handleCarSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('brand', carData.brand);
      formData.append('model', carData.model);
      formData.append('year', carData.year);
      formData.append('licensePlate', carData.licensePlate);
      if (carData.image) {
        formData.append('image', {
          uri: carData.image,
          type: 'image/jpeg', // Assuming the image is JPEG
          name: 'car_image.jpg',
        });
      }

      // Perform car registration logic here (e.g., API call)
      const response = await axios.post('https://your-api-endpoint.com/car/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('Car registered successfully:', response.data);
        router.replace('/home'); // Navigate to home after successful registration
      } else {
        console.error('Error registering car:', response.data.message);
        alert(response.data.message); // Alert the user in case of an error
      }
    } catch (error) {
      console.error('Error during car registration:', error);
      alert('An error occurred while registering the car.');
    }
  };

  // if (showCarForm) {
  //   return (
  //     <View style={[styles.container, { backgroundColor: themeColors.background }]}>
  //       <ScrollView contentContainerStyle={styles.formContainer}>
  //         <View style={styles.header}>
  //           <ThemedText style={[styles.title, { color: themeColors.tint }]}>Register Your Car</ThemedText>
  //         </View>

  //         {/* Car Details Form */}
  //         <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
  //           <FontAwesome name="car" size={20} color={themeColors.tint} style={styles.icon} />
  //           <TextInput
  //             style={[styles.input, { color: themeColors.text }]}
  //             placeholder="Brand (e.g. Toyota)"
  //             placeholderTextColor={themeColors.textSecondary}
  //             value={carData.brand}
  //             onChangeText={(text) => setCarData({ ...carData, brand: text })}
  //           />
  //         </View>

  //         <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
  //           <FontAwesome name="car" size={20} color={themeColors.tint} style={styles.icon} />
  //           <TextInput
  //             style={[styles.input, { color: themeColors.text }]}
  //             placeholder="Model (e.g. Camry)"
  //             placeholderTextColor={themeColors.textSecondary}
  //             value={carData.model}
  //             onChangeText={(text) => setCarData({ ...carData, model: text })}
  //           />
  //         </View>

  //         <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
  //           <FontAwesome name="calendar" size={20} color={themeColors.tint} style={styles.icon} />
  //           <TextInput
  //             style={[styles.input, { color: themeColors.text }]}
  //             placeholder="Year"
  //             placeholderTextColor={themeColors.textSecondary}
  //             keyboardType="numeric"
  //             value={carData.year}
  //             onChangeText={(text) => setCarData({ ...carData, year: text })}
  //           />
  //         </View>

  //         <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
  //           <FontAwesome name="id-card" size={20} color={themeColors.tint} style={styles.icon} />
  //           <TextInput
  //             style={[styles.input, { color: themeColors.text }]}
  //             placeholder="License Plate"
  //             placeholderTextColor={themeColors.textSecondary}
  //             value={carData.licensePlate}
  //             onChangeText={(text) => setCarData({ ...carData, licensePlate: text })}
  //           />
  //         </View>

  //         <TouchableOpacity
  //           style={[styles.button, { backgroundColor: themeColors.tint }]}
  //           onPress={handleCarSubmit}
  //           disabled={!carData.brand || !carData.model || !carData.year || !carData.licensePlate}
  //         >
  //           <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
  //             Complete Registration
  //           </ThemedText>
  //         </TouchableOpacity>
  //       </ScrollView>
  //     </View>
  //   );
  // }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: themeColors.tint }]}>{t('Register')}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('Create an account')}</ThemedText>
      </View>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="envelope" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t("Email")}
            placeholderTextColor={themeColors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={authData.email}
            onChangeText={(text) => setAuthData({ ...authData, email: text })}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="user" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t("Fullname")}
            placeholderTextColor={themeColors.textSecondary}
            value={authData.fullname}
            onChangeText={(text) => setAuthData({ ...authData, fullname: text })}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="phone" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t("Phone Number")}
            placeholderTextColor={themeColors.textSecondary}
            keyboardType="phone-pad"
            value={authData.phone}
            onChangeText={(text) => setAuthData({ ...authData, phone: text })}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t("Password")}
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showPassword}
            value={authData.password}
            onChangeText={(text) => setAuthData({ ...authData, password: text })}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color={themeColors.tint} />
          </TouchableOpacity>
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t("Confirm Password")}
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showpassword_confirmation}
            value={authData.password_confirmation}
            onChangeText={(text) => setAuthData({ ...authData, password_confirmation: text })}
          />
          <TouchableOpacity onPress={() => setShowpassword_confirmation(!showpassword_confirmation)}>
            <FontAwesome name={showpassword_confirmation ? 'eye-slash' : 'eye'} size={20} color={themeColors.tint} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.tint }]}
          onPress={handleAuthSubmit}
          disabled={!authData.email || !authData.password || !authData.password_confirmation}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
            {t('Register')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  formContainer: {
    paddingBottom: 20,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
