import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Image 
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SubCategoriesScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [sound, setSound] = useState<any>();
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (category) {
      fetchSubcategories(category as string);
    }
  }, [category]);

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(
        `http://oilminingshah.com/groshy/public/api/categorySubcategories?category_id=${categoryId}`,
        {
          headers: {
            'locale': i18n.language, // Only adding language header here
            'Content-Type': 'application/json',
          },
        }
      );
      const json = await response.json();
      if (json.data) {
        setSubcategories(json.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playCarSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('@/assets/car2.mp3'));
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleSubcategoryPress = async (subcategoryId: string) => {
    await playCarSound();
    router.push(`/products?subcategory=${subcategoryId}`);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.gridContainer}>
        {subcategories.map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
            onPress={() => handleSubcategoryPress(subcategory.id)}
          >
            <View style={styles.cardInner}>
              <Image source={{ uri: subcategory.image }} style={styles.cardImage} resizeMode="contain" />
              <ThemedText style={styles.cardTitle}>{subcategory.title}</ThemedText>
              <ThemedText style={styles.cardDescription}>{subcategory.description}</ThemedText>
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
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
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
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    textAlign: 'center',
  },
});