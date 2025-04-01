import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Image,
  FlatList 
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock product data
const PRODUCTS = {
  oils: [
    { 
      id: '1', 
      name: 'Synthetic Engine Oil 5W-30', 
      description: 'Full synthetic formula for maximum engine protection',
      price: 29.99, 
      image: 'https://example.com/oil1.jpg' 
    },
    { 
      id: '2', 
      name: 'High Mileage Oil', 
      description: 'Specially formulated for vehicles over 75,000 miles',
      price: 34.99, 
      image: 'https://example.com/oil2.jpg' 
    }
  ],
  // Add other categories...
};

export default function ProductsScreen() {
  const { category } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const filteredProducts = PRODUCTS[category]?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <FontAwesome name="search" size={16} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={`Search ${category}...`}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Sort Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.sortButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => {
            setSortOption(prev => 
              prev === 'default' ? 'price-low' : 
              prev === 'price-low' ? 'price-high' : 'default'
            );
          }}
        >
          <Text style={[styles.sortText, { color: colors.tint }]}>
            Sort: {sortOption === 'default' ? 'Default' : 
                 sortOption === 'price-low' ? 'Price Low' : 'Price High'}
          </Text>
          <MaterialIcons 
            name="arrow-drop-down" 
            size={20} 
            color={colors.tint} 
          />
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.productCard, { backgroundColor: colors.cardBackground }]}>
            {/* Product Image (Left) */}
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
            
            {/* Product Info (Middle) */}
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.productDesc, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
              <Text style={[styles.productPrice, { color: colors.tint }]}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
            
            {/* Add to Cart (Right Bottom) */}
            <TouchableOpacity 
              style={[styles.cartButton, { backgroundColor: colors.tint }]}
              onPress={() => console.log('Add to cart', item.id)}
            >
              <FontAwesome name="cart-plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.productsContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  actionRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    position: 'relative',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 13,
    marginBottom: 6,
    opacity: 0.7,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});