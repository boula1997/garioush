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
  Alert,
  I18nManager
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';

export default function ProductsScreen() {
  const router = useRouter();
  const { subcategory } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    last_page: 1,
    total_items: 0
  });
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (subcategory) {
      fetchProducts(subcategory as string);
    }
  }, [subcategory]);

  const fetchProducts = async (subcategoryId: string, page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://oilminingshah.com/groshy/public/api/subcategoryProducts?subcategory_id=${subcategoryId}&per_page=${pagination.per_page}&page=${page}`,
        {
          headers: {
            'locale': i18n.language,
            'Content-Type': 'application/json',
          },
        }
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
        Alert.alert(t('error'), t('login_first'));
        return;
      }

      const response = await fetch('http://oilminingshah.com/groshy/public/api/auth/add/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'locale': i18n.language,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: productId })
      });

      const json = await response.json();
      if (json.success) {
        Alert.alert(t('product_added'), `${t('total')}: ${json.total} ${t('currency')}`);
      } else {
        Alert.alert(t('error'), t('add_to_cart_failed'));
      }
    } catch (err) {
      Alert.alert(t('connection_error'), err.message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    return 0;
  });

  const loadMoreProducts = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchProducts(subcategory as string, pagination.current_page + 1);
    }
  };

  const getSortText = () => {
    switch(sortOption) {
      case 'default': return t('sort_default');
      case 'price-low': return t('sort_price_low');
      case 'price-high': return t('sort_price_high');
      default: return t('sort_default');
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
        <Text style={{ color: colors.text }}>{t('error_occurred')}: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        direction: isRTL ? 'rtl' : 'ltr' 
      }
    ]}>
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: colors.cardBackground,
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }
      ]}>
        <FontAwesome 
          name="search" 
          size={16} 
          color={colors.text} 
          style={isRTL ? styles.searchIconRTL : styles.searchIcon} 
        />
        <TextInput
          style={[
            styles.searchInput, 
            { 
              color: colors.text,
              textAlign: isRTL ? 'right' : 'left'
            }
          ]}
          placeholder={t('search_products')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={[
        styles.actionRow,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity
          style={[
            styles.actionButton, 
            { 
              backgroundColor: colors.cardBackground,
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }
          ]}
          onPress={() => {
            setSortOption(prev =>
              prev === 'default' ? 'price-low' :
                prev === 'price-low' ? 'price-high' :
                  'default'
            );
          }}
        >
          <MaterialIcons name="sort" size={18} color={colors.tint} />
          <ThemedText style={[
            styles.actionText, 
            { 
              color: colors.tint,
              marginLeft: isRTL ? 0 : 8,
              marginRight: isRTL ? 8 : 0
            }
          ]}>
            {t('sort')}: {getSortText()}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.productCard, 
              { 
                backgroundColor: colors.cardBackground,
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }
            ]}
            onPress={() => router.push(`/product?id=${item.id}`)}
          >
            <Image
              source={{ uri: item.subcategory?.category?.image || 'https://via.placeholder.com/150' }}
              style={[
                styles.productImage,
                { marginRight: isRTL ? 0 : 16, marginLeft: isRTL ? 40 : 0 }
              ]}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <ThemedText style={[
                styles.productName, 
                { 
                  color: colors.text,
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}>
                {item.title}
              </ThemedText>
              <ThemedText style={[
                styles.productDesc, 
                { 
                  color: colors.textSecondary,
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}>
                {item.description}
              </ThemedText>
              <ThemedText style={[
                styles.productPrice, 
                { 
                  color: colors.tint,
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}>
                ${item.price.toFixed(2)}
              </ThemedText>
              {item.details?.noOfKilos && (
                <ThemedText style={{ 
                  color: colors.textSecondary,
                  textAlign: isRTL ? 'right' : 'left'
                }}>
                  {t('size')}: {item.details.noOfKilos} kg
                </ThemedText>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.cartButton, 
                { 
                  backgroundColor: colors.tint,
                  [isRTL ? 'left' : 'right']: 10
                }
              ]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 16 
  },
  searchContainer: {
    alignItems: 'center', 
    borderRadius: 8,
    paddingHorizontal: 16, 
    marginHorizontal: 16, 
    marginBottom: 12, 
    height: 48
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchIconRTL: {
    marginLeft: 8
  },
  searchInput: { 
    flex: 1, 
    height: '100%', 
    fontSize: 16 
  },
  actionRow: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    marginBottom: 12 
  },
  actionButton: { 
    alignItems: 'center', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8 
  },
  actionText: { 
    fontWeight: '600', 
    fontSize: 14 
  },
  productsContainer: { 
    paddingHorizontal: 16, 
    paddingBottom: 20 
  },
  productCard: { 
    borderRadius: 12, 
    marginBottom: 16, 
    padding: 12, 
    position: 'relative' 
  },
  productImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 8 
  },
  productInfo: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  productName: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  productDesc: { 
    fontSize: 14 
  },
  productPrice: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  cartButton: {
    position: 'absolute', 
    bottom: 10,
    padding: 8, 
    borderRadius: 20
  },
  loadingMoreContainer: { 
    paddingVertical: 12, 
    alignItems: 'center' 
  },
});