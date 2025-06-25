import { 
  View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function AuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    fullname: '',
    phone: '',
  });

  const handleAuthSubmit = async () => {
    try {
      const response = await axios.post(
        'https://yousab-tech.com/groshy/public/api/auth/register',
        {
          email: authData.email,
          password: authData.password,
          password_confirmation: authData.password_confirmation,
          fullname: authData.fullname,
          phone: authData.phone,
        }
      );

      if (response.data.success) {
        console.log('User registered successfully:', response.data);
        router.push('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while registering.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: themeColors.tint }]}>
          Register
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Create an account
        </ThemedText>
      </View>

      <View style={styles.form}>
        {[
          {
            icon: 'envelope',
            placeholder: 'Email',
            keyboardType: 'email-address',
            value: authData.email,
            onChange: (text: string) => setAuthData({ ...authData, email: text }),
            secureTextEntry: false,
            autoCapitalize: 'none',
          },
          {
            icon: 'user',
            placeholder: 'Fullname',
            keyboardType: 'default',
            value: authData.fullname,
            onChange: (text: string) => setAuthData({ ...authData, fullname: text }),
            secureTextEntry: false,
            autoCapitalize: 'words',
          },
          {
            icon: 'phone',
            placeholder: 'Phone Number',
            keyboardType: 'phone-pad',
            value: authData.phone,
            onChange: (text: string) => setAuthData({ ...authData, phone: text }),
            secureTextEntry: false,
            autoCapitalize: 'none',
          },
        ].map(({ icon, placeholder, keyboardType, value, onChange, secureTextEntry, autoCapitalize }, i) => (
          <View
            key={i}
            style={[styles.inputContainer, { borderColor: themeColors.border }]}
          >
            <FontAwesome name={icon} size={20} color={themeColors.tint} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder={placeholder}
              placeholderTextColor={themeColors.textSecondary}
              keyboardType={keyboardType}
              value={value}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
              textContentType="none"
            />
          </View>
        ))}

        {/* Password */}
        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Password"
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showPassword}
            value={authData.password}
            onChangeText={(text) => setAuthData({ ...authData, password: text })}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FontAwesome
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color={themeColors.tint}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Confirm Password"
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showPasswordConfirmation}
            value={authData.password_confirmation}
            onChangeText={(text) => setAuthData({ ...authData, password_confirmation: text })}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />
          <TouchableOpacity onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FontAwesome
              name={showPasswordConfirmation ? 'eye-slash' : 'eye'}
              size={20}
              color={themeColors.tint}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.tint }]}
          onPress={handleAuthSubmit}
          disabled={
            !authData.email ||
            !authData.password ||
            !authData.password_confirmation ||
            authData.password !== authData.password_confirmation
          }
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
            Register
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
  },
  form: {
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    marginBottom: 25,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  icon: {
    marginRight: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
