import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function AuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [showPassword, setShowPassword] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);

  // Auth state
  const [authData, setAuthData] = useState({
    email: '',
    password: ''
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

  const handleAuthSubmit = () => {
    // Skip login/register condition and show car form immediately
    setShowCarForm(true);
  };

  const handleCarSubmit = () => {
    // Submit car data and go to home
    console.log('Car data:', carData);
    router.replace('/home');
  };

  if (showCarForm) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.header}>
            <ThemedText style={[styles.title, { color: themeColors.tint }]}>Register Your Car</ThemedText>
          </View>

          {/* Car Image */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {carData.image ? (
              <Image source={{ uri: carData.image }} style={styles.carImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <FontAwesome name="camera" size={24} color={themeColors.textSecondary} />
                <ThemedText style={[styles.imageText, { color: themeColors.textSecondary }]}>
                  Add Car Photo
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>

          {/* Car Details Form */}
          <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
            <FontAwesome name="car" size={20} color={themeColors.tint} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Brand (e.g. Toyota)"
              placeholderTextColor={themeColors.textSecondary}
              value={carData.brand}
              onChangeText={(text) => setCarData({ ...carData, brand: text })}
            />
          </View>

          <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
            <FontAwesome name="car" size={20} color={themeColors.tint} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Model (e.g. Camry)"
              placeholderTextColor={themeColors.textSecondary}
              value={carData.model}
              onChangeText={(text) => setCarData({ ...carData, model: text })}
            />
          </View>

          <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
            <FontAwesome name="calendar" size={20} color={themeColors.tint} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Year"
              placeholderTextColor={themeColors.textSecondary}
              keyboardType="numeric"
              value={carData.year}
              onChangeText={(text) => setCarData({ ...carData, year: text })}
            />
          </View>

          <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
            <FontAwesome name="id-card" size={20} color={themeColors.tint} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="License Plate"
              placeholderTextColor={themeColors.textSecondary}
              value={carData.licensePlate}
              onChangeText={(text) => setCarData({ ...carData, licensePlate: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.tint }]}
            onPress={handleCarSubmit}
            disabled={!carData.brand || !carData.model || !carData.year || !carData.licensePlate}
          >
            <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
              Complete Registration
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: themeColors.tint }]}>Register</ThemedText>
        <ThemedText style={styles.subtitle}>Create an account</ThemedText>
      </View>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="envelope" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Email"
            placeholderTextColor={themeColors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={authData.email}
            onChangeText={(text) => setAuthData({ ...authData, email: text })}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Password"
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showPassword}
            value={authData.password}
            onChangeText={(text) => setAuthData({ ...authData, password: text })}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? 'eye' : 'eye-slash'}
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.tint }]}
          onPress={handleAuthSubmit}
          disabled={!authData.email || !authData.password}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
            Register
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Your original styles remain unchanged
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color:"#fff",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  formContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  // New styles for car registration
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#555',
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    marginTop: 10,
    fontSize: 16,
  },
});
