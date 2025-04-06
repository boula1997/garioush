import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  // Load sound effect
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load the car sound
        const { sound: carSound } = await Audio.Sound.createAsync(
          require('../assets/car2.mp3') // Make sure you have this file in your assets
        );
        await carSound.playAsync();
        
        // Small delay to let the sound play and splash screen show
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loaded && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, appIsReady]);

  if (!loaded || !appIsReady) {
    return (
      <View style={styles.container}>
        <Image 
          source={require('../assets/images/logo.png')} // Replace with your logo path
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator 
          size="large" 
          color="#FF0000" // Red color
          style={styles.spinner}
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080533', // Dark blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  spinner: {
    marginTop: 20,
  },
});