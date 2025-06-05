import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'https://yousab-tech.com/groshy/public/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('authToken', data.token);
        router.push('/profile');
      } else {
        Alert.alert(t('Login Failed'), t('Invalid email or password.'));
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert(t('Error'), t('Something went wrong. Please try again later.'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: themeColors.tint }]}>
          {t('Login')}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          {t('Welcome back')}
        </ThemedText>
      </View>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="envelope" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t('Email')}
            placeholderTextColor={themeColors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            importantForAutofill="yes"
            autoComplete="email"
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={t('Password')}
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            importantForAutofill="yes"
            autoComplete="password"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? t('Hide password') : t('Show password')}
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
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
            {t('Login')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/register')}
          activeOpacity={0.6}
        >
          <ThemedText style={[styles.registerText, { color: themeColors.textSecondary }]}>
            {t('Do not have an account?')}{' '}
            <ThemedText style={{ color: themeColors.tint, fontWeight: 'bold' }}>
              {t('Register')}
            </ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 5 },
  form: { marginTop: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: { flex: 1, height: 40 },
  icon: { marginRight: 10 },
  eyeIcon: { paddingHorizontal: 5 },
  button: { padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  registerLink: { marginTop: 15, alignItems: 'center' },
  registerText: { fontSize: 14 },
});
