import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductsScreen() {
  const router = useRouter();
  const { subcategory } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    last_page: 1,
    total_items: 0
  });

  useEffect(() => {
    if (subcategory) {
      fetchProducts(subcategory as string);
    }
  }, [subcategory]);

  const fetchProducts = async (subcategoryId: string, page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://yousab-tech.com/groshy/public/api/subcategoryProducts?subcategory_id=${subcategoryId}&per_page=${pagination.per_page}&page=${page}`
      );
      const json = await response.json();

      if (json.data) {
        setProducts(page === 1 ? json.data : [...products, ...json.data]);
        setPagination(json.pagination);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('خطأ', 'الرجاء تسجيل الدخول أولاً');
        return;
      }

      const response = await fetch('https://yousab-tech.com/groshy/public/api/auth/add/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      const json = await response.json();
       
      if (json.success) {
        Alert.alert('تم إضافة المنتج إلى العربة', `الإجمالي: ${json.total} جنيه`);
      } else {
        Alert.alert('خطأ', 'تعذر إضافة المنتج إلى العربة');
      }
    } catch (err) {
      Alert.alert('خطأ في الاتصال', err.message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'rating') return b.rate - a.rate;
    return 0;
  });

  const loadMoreProducts = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchProducts(subcategory as string, pagination.current_page + 1);
    }
  };

  if (loading && pagination.current_page === 1) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>حدث خطأ: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <FontAwesome name="search" size={16} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons name="filter-list" size={18} color={colors.tint} />
          <Text style={[styles.actionText, { color: colors.tint }]}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => {
            setSortOption(prev =>
              prev === 'default' ? 'price-low' :
                prev === 'price-low' ? 'price-high' :
                  prev === 'price-high' ? 'rating' : 'default'
            );
          }}
        >
          <MaterialIcons name="sort" size={18} color={colors.tint} />
          <Text style={[styles.actionText, { color: colors.tint }]}>
            Sort: {sortOption === 'default' ? 'Default' :
              sortOption === 'price-low' ? 'Price Low' :
                sortOption === 'price-high' ? 'Price High' : 'Rating'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.productCard, { backgroundColor: colors.cardBackground }]}
            onPress={() => router.push(`/product?id=${item.id}`)}
          >
            <Image
              source={{ uri: item.subcategory?.category?.image || 'https://via.placeholder.com/150' }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.productDesc, { color: colors.textSecondary }]}>{item.description}</Text>
              <View style={styles.priceRatingContainer}>
                <Text style={[styles.productPrice, { color: colors.tint }]}>
                  ${item.price.toFixed(2)}
                </Text>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={14} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                    {item.rate.toFixed(1)}
                  </Text>
                </View>
              </View>
              {item.details?.noOfKilos && (
                <Text style={{ color: colors.textSecondary }}>
                  Size: {item.details.noOfKilos} kg
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.cartButton, { backgroundColor: colors.tint }]}
              onPress={() => handleAddToCart(item.id)}
            >
              <MaterialCommunityIcons name="cart-plus" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.productsContainer}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          pagination.current_page < pagination.last_page ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={colors.tint} />
            </View>
          ) : null
        }
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilters(false)}
      >
        {/* Filters UI Goes Here */}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 8,
    paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 12, height: 48
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: '100%', fontSize: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { marginLeft: 8, fontWeight: '600', fontSize: 14 },
  productsContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  productCard: { flexDirection: 'row', borderRadius: 12, marginBottom: 16, padding: 12, position: 'relative' },
  productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  productInfo: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productDesc: { fontSize: 14 },
  priceRatingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 4, fontSize: 14 },
  cartButton: {
    position: 'absolute', right: 10, bottom: 10,
    padding: 8, borderRadius: 20
  },
  loadingMoreContainer: { paddingVertical: 12, alignItems: 'center' },
});
