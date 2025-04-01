import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, SafeAreaView, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Custom Header with Text Logo */}
      <View style={[
        styles.header,
        { 
          backgroundColor: themeColors.headerBackground,
          borderBottomColor: themeColors.border,
        }
      ]}>
        <View style={styles.logoContainer}>
          <ThemedText style={[
            styles.logoText,
            { 
              color: themeColors.tint,
              textShadowColor: themeColors.shadow,
            }
          ]}>
            GARIOUSH
          </ThemedText>
          <View style={[
            styles.logoUnderline,
            { backgroundColor: themeColors.tint }
          ]} />
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
            {
              borderTopColor: themeColors.border,
              backgroundColor: themeColors.tabBarBackground,
            },
            Platform.select({
              ios: { position: 'absolute' },
              android: { elevation: 8 }
            })
          ],
          tabBarLabelStyle: styles.tabLabel,
        }}>
        
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="shopping-cart" size={24} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="bell" size={24} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }}
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
});