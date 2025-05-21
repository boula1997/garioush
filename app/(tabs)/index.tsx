import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Image, I18nManager, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import '../../i18n';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme];
  const [sound, setSound] = useState();
  const [services, setServices] = useState([]);
  const { t } = useTranslation();
  const [langToggle, setLangToggle] = useState(false);

  const changeLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    await i18n.changeLanguage(newLang);
    I18nManager.forceRTL(newLang === 'ar');
    setLangToggle(prev => !prev);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://yousab-tech.com/groshy/public/api/categories');
      const json = await response.json();
      if (json.status === 200) {
        setServices(json.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
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

  const handleServicePress = async (category: string) => {
    await playCarSound();
    router.push(`/subcategories?category=${category}`);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={changeLanguage} style={[styles.langButton, { backgroundColor: themeColors.tint }]}>
          <Text style={[styles.langText, { color: themeColors.buttonText }]}>
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: themeColors.cardBackground, shadowColor: themeColors.shadow, borderColor: themeColors.border }]}
            onPress={() => handleServicePress(service.id)}
          >
            <View style={styles.cardInner}>
              <Image source={{ uri: service.image }} style={styles.cardImage} resizeMode="contain" />
              <ThemedText style={[styles.cardTitle, { color: themeColors.text }]}>{t(service.title)}</ThemedText>
              <ThemedText style={[styles.cardDescription, { color: themeColors.text }]}>{t(service.description)}</ThemedText>
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
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  langText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
