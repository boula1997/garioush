import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  const handleLogin = () => {
    // Perform login logic here
    // Then navigate back to profile
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Logo/Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: themeColors.tint }]}>Login</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome back</ThemedText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome 
            name="envelope" 
            size={20} 
            color={themeColors.tint} 
            style={styles.icon} 
          />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Email"
            placeholderTextColor={themeColors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome 
            name="lock" 
            size={20} 
            color={themeColors.tint} 
            style={styles.icon} 
          />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Password"
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry
          />
          <TouchableOpacity style={styles.eyeIcon}>
            <FontAwesome 
              name="eye-slash" 
              size={20} 
              color={themeColors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => router.push('/forgot-password')}
        >
          <ThemedText style={{ color: themeColors.tint }}>
            Forgot your password?
          </ThemedText>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: themeColors.tint }]}
          onPress={handleLogin}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
            Login
          </ThemedText>
        </TouchableOpacity>

        {/* Create Account */}
        <View style={styles.createAccountContainer}>
          <ThemedText style={{ color: themeColors.textSecondary }}>
            Don't have an account?{' '}
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <ThemedText style={{ color: themeColors.tint, fontWeight: 'bold' }}>
              Create an account
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
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
});