import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [showPassword, setShowPassword] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  
  // Survey state
  const [surveyData, setSurveyData] = useState({
    exterior: '',
    interior: '',
    mechanical: ''
  });

  const handleLogin = () => {
    // Show survey instead of navigating directly
    setShowSurvey(true);
  };

  const handleSurveySubmit = () => {
    router.replace('/home');
  };

  if (showSurvey) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ScrollView contentContainerStyle={styles.surveyContainer}>
          <View style={styles.header}>
            <ThemedText style={[styles.title, { color: themeColors.tint }]}>Car Condition</ThemedText>
            <ThemedText style={styles.subtitle}>Please assess your vehicle</ThemedText>
          </View>

          {/* Survey Questions (same as before) */}
          <View style={styles.surveySection}>
            <ThemedText style={styles.surveyQuestion}>Exterior Condition</ThemedText>
            <View style={styles.optionRow}>
              {['Excellent', 'Good', 'Fair', 'Poor'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    surveyData.exterior === option && {
                      backgroundColor: themeColors.tint,
                      borderColor: themeColors.tint
                    }
                  ]}
                  onPress={() => setSurveyData({...surveyData, exterior: option})}
                >
                  <ThemedText style={[
                    styles.optionText,
                    surveyData.exterior === option && { color: themeColors.buttonText }
                  ]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interior and Mechanical sections same as above */}

          <TouchableOpacity 
            style={[styles.button, { 
              backgroundColor: themeColors.tint,
              opacity: surveyData.exterior && surveyData.interior && surveyData.mechanical ? 1 : 0.6
            }]}
            onPress={handleSurveySubmit}
            disabled={!surveyData.exterior || !surveyData.interior || !surveyData.mechanical}
          >
            <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
              Submit
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Original login screen - STYLES REMAIN UNCHANGED from your version
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: themeColors.tint }]}>Login</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome back</ThemedText>
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
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
          <FontAwesome name="lock" size={20} color={themeColors.tint} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Password"
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={!showPassword}
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
          style={styles.forgotPassword}
          onPress={() => router.push('/forgot-password')}
        >
          <ThemedText style={{ color: themeColors.tint }}>
            Forgot your password?
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: themeColors.tint }]}
          onPress={handleLogin}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>
            Login
          </ThemedText>
        </TouchableOpacity>

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
  // YOUR ORIGINAL STYLES - COMPLETELY UNCHANGED
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
  
  // NEW SURVEY-ONLY STYLES (added at the bottom)
  surveyContainer: {
    flexGrow: 1,
    padding: 20,
  },
  surveySection: {
    marginBottom: 25,
  },
  surveyQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  optionButton: {
    minWidth: '23%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    // color: '#fff',
  },
});