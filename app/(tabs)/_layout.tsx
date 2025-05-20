import React, { useState, useEffect } from 'react';
import { Platform, View, SafeAreaView, StyleSheet, Image } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [sound, setSound] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  // Load the sound effect
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/car2.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleTabPress = async (routeName) => {
    await playSound();
    return { routeName };
  };

  const handleProfileTabPress = async (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      await playSound();
      router.push('/login');
    } else {
      await playSound();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Custom Header */}
      <View style={[
        styles.header,
        { backgroundColor: themeColors.headerBackground, borderBottomColor: themeColors.border }
      ]}>
        <View style={styles.logoContainer}>
          <ThemedText style={[styles.logoText, { color: themeColors.tint, textShadowColor: themeColors.shadow }]}>
           {t('GARIOUSH')}
          </ThemedText>
          <View style={[styles.logoUnderline, { backgroundColor: themeColors.tint }]} />
        </View>
      </View>

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: themeColors.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: [
            styles.tabBar,
            { borderTopColor: themeColors.border, backgroundColor: themeColors.tabBarBackground },
            Platform.select({ ios: { position: 'absolute' }, android: { elevation: 8 } })
          ],
          tabBarLabelStyle: styles.tabLabel,
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title:  t('Home'),
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: async (e) => {
              await playSound();
              navigation.navigate('index');
            },
          })}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: t('Cart'),
            tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={24} color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: async (e) => {
              await playSound();
              navigation.navigate('cart');
            },
          })}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            title: t('Notifications'),
            tabBarIcon: ({ color }) => <FontAwesome name="bell" size={24} color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: async (e) => {
              await playSound();
              navigation.navigate('notifications');
            },
          })}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: t('Profile'),
            tabBarIcon: ({ color }) =>
              isLoggedIn ? (
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }}
                  style={styles.profileAvatar}
                />
              ) : (
                <FontAwesome name="user" size={24} color={color} />
              ),
          }}
          listeners={({ navigation }) => ({
            tabPress: async (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                await playSound();
                router.push(t('/login'));

              } else {
                await playSound();
                navigation.navigate('profile');
              }
            },
          })}
        />
        
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: Platform.OS === 'android' ? 60 : 0,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  logoUnderline: {
    height: 3,
    width: '40%',
    marginTop: 6,
    borderRadius: 3,
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Platform.OS === 'ios' ? 0 : 5,
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});