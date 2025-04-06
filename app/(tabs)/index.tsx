import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av'; // Import Audio from expo-av
import { useEffect, useState } from 'react'; // Import useState and useEffect

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [sound, setSound] = useState(); // State for sound object

  // Load and unload sound effect
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Function to play the car sound
  const playCarSound = async () => {
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

  // Modified navigation handler with sound
  const handleServicePress = async (category) => {
    await playCarSound();
    router.push(`/products?category=${category}`);
  };

  const services = [
    { name: 'Oils', icon: 'tint', iconSet: FontAwesome, category: 'oils' },
    { name: 'Tires', icon: 'tire', iconSet: MaterialCommunityIcons, category: 'tires' },
    { name: 'Batteries', icon: 'bolt', iconSet: FontAwesome, category: 'batteries' },
    { name: 'Spare Parts', icon: 'cog', iconSet: FontAwesome, category: 'spare-parts' },
    { name: 'Maintenance', icon: 'wrench', iconSet: FontAwesome, category: 'maintenance' },
    { name: 'Body Shop', icon: 'car', iconSet: FontAwesome, category: 'body-shop' },
  ];

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.gridContainer}>
        {services.map((service, index) => {
          const IconComponent = service.iconSet;
          return (
            <TouchableOpacity 
              key={index}
              style={[
                styles.serviceCard, 
                { 
                  backgroundColor: themeColors.cardBackground,
                  borderColor: themeColors.border,
                },
                index !== 0 && styles.firstServiceCard
              ]}
              onPress={() => handleServicePress(service.category)}
            >
              <IconComponent 
                name={service.icon} 
                size={40} 
                color={themeColors.tint} 
                style={styles.icon}
              />
              <ThemedText style={styles.serviceText}>{service.name}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    padding: 16,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  serviceCard: {
    width: '45%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 8,
  },
  firstServiceCard: {
    paddingBottom: 27,
  },
  icon: {
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  promoBanner: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  promoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});