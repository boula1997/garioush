import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
  I18nManager,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useEffect, useState, useCallback } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import * as Updates from 'expo-updates';
import '../../i18n';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme];
  const [sound, setSound] = useState<Audio.Sound>();
  const [services, setServices] = useState<any[]>([]);
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);
  const [oldLang, setIOldLang] = useState("");

  // Memoized fetch function that always uses current language
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching with language:', currentLang);
      // const response = await fetch('https://oilminingshah.com/groshy/public/api/categories', {
       const response = await fetch('https://oilminingshah.com/groshy/public/api/categories', {
      headers: {
          'locale': currentLang, // Using only 'locale' since that works
          'Content-Type': 'application/json',
        },
      });
      
      const json = await response.json();
      console.log('API Response:', json);
      
      if (json.status === 200) {
        setServices(json.data.categories);
      }

      setIOldLang(currentLang=="ar"?"en":"ar");

    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentLang]); // Recreates when currentLang changes

  const changeLanguage = async () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    const isRTL = newLang === 'ar';

    try {
      // Update i18n first
      await i18nInstance.changeLanguage(newLang);
      // Then update state
      setCurrentLang(newLang);
      
      // For RTL changes, reload needed
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        // Alert.alert(
        //   t('restart_required'),
        //   t('restart_message'),
        //   [
        //     {
        //       text: t('ok'),
        //       onPress: async () => {
        //         await Updates.reloadAsync();
        //       },
        //     },
        //   ]
        // );
      }
      
      // Fetch data with new language
      await fetchCategories();
      
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Cleanup sound
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(error => {
          console.error('Error unloading sound:', error);
        });
      }
    };
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
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={changeLanguage}
          style={[styles.langButton, { backgroundColor: themeColors.tint }]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={themeColors.buttonText} />
          ) : (
            <Text style={[styles.langText, { color: themeColors.buttonText }]}>
              {oldLang.toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              {
                backgroundColor: themeColors.cardBackground,
                shadowColor: themeColors.shadow,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => handleServicePress(service.id)}
            disabled={isLoading}
          >
            <View style={styles.cardInner}>
              <Image
                source={{ uri: service.image }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <ThemedText style={[styles.cardTitle, { color: themeColors.text }]}>
                {service.title}
              </ThemedText>
              <ThemedText style={[styles.cardDescription, { color: themeColors.text }]}>
                {service.description}
              </ThemedText>
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
    borderRadius: 20,
    padding: 6,
    marginBottom: 20,
    borderWidth: 0,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android Elevation
    elevation: 4,
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