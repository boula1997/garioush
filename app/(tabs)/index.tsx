import { StyleSheet, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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

  const handleServicePress = async (category: string) => {
    await playCarSound();
    router.push(`/products?category=${category}`);
  };

  const services = [
    { name: 'Oils', image: require('@/assets/oil.png'), category: 'oils' },
    { name: 'Tires', image: require('@/assets/tires.jpg'), category: 'tires' },
    { name: 'Batteries', image: require('@/assets/battery.jpg'), category: 'batteries' },
    { name: 'Spare Parts', image: require('@/assets/spare.jpg'), category: 'spare-parts' },
    { name: 'Maintenance', image: require('@/assets/body.jpg'), category: 'maintenance' },
    { name: 'Body Shop', image: require('@/assets/repairs.png'), category: 'body-shop' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.gridContainer}>
        {services.map((service, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.card}
            onPress={() => handleServicePress(service.category)}
          >
            <View style={styles.cardInner}>
              <Image source={service.image} style={styles.cardImage} resizeMode="contain" />
              <ThemedText style={styles.cardTitle}>{service.name}</ThemedText>
              <ThemedText style={styles.cardDescription}>description</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    padding: 16,
    paddingBottom: 50,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4, // Android shadow
    marginBottom: 20,
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  cardImage: {
    width: 50,
    height: 50,
    marginBottom: 12,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
  },
});
