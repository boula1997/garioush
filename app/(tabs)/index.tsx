import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; // Added MaterialCommunityIcons
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

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
      {/* <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>Our Services</ThemedText>
      </ThemedView> */}

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
                }
              ]}
              onPress={() => router.push(`/products?category=${service.category}`)}
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

      {/* <ThemedView style={[
        styles.promoBanner,
        { backgroundColor: themeColors.tint }
      ]}>
        <ThemedText style={styles.promoText}>Special Offers This Week!</ThemedText>
      </ThemedView> */}
    </ScrollView>
  );
}

// ... (keep the same StyleSheet as before)

const styles = StyleSheet.create({
  container: {
    paddingTop:100,
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