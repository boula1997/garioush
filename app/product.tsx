import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://yousab-tech.com/groshy/public/api/product/${productId}`
      );
      const json = await response.json();
      
      if (json.data?.product) {
        setProduct(json.data.product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
          onPress={() => fetchProduct(id as string)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text }]}>Product not found</Text>
      </View>
    );
  }

  // Use category image as the main product image if no specific product images are available
  const productImages = product.category?.image 
    ? [product.category.image] 
    : ['https://via.placeholder.com/150'];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <FlatList
          data={productImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          renderItem={({ item }) => (
            <Image 
              source={{ uri: item }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {productImages.length > 1 && (
          <View style={styles.pagination}>
            {productImages.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.paginationDot,
                  { 
                    backgroundColor: index === activeImageIndex ? colors.tint : '#ccc',
                    width: index === activeImageIndex ? 12 : 8,
                  }
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Product Info Section */}
      <View style={[styles.infoContainer, { backgroundColor: colors.cardBackground }]}>
        {/* Title and Brand */}
        <View style={styles.titleContainer}>
          <Text style={[styles.productTitle, { color: colors.text }]}>
            {product.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.brandText, { color: colors.textSecondary }]}>
              {product.brand ? `by ${product.brand}` : ''}
            </Text>
            <Text style={[styles.price, { color: colors.tint }]}>
              ${product.price.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Price and Add to Cart */}
        <View style={styles.actionContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[styles.quantityButton, { borderColor: colors.tint }]}
              onPress={decreaseQuantity}
            >
              <MaterialIcons name="remove" size={20} color={colors.tint} />
            </TouchableOpacity>
            
            <Text style={[styles.quantityText, { color: colors.text }]}>
              {quantity}
            </Text>
            
            <TouchableOpacity 
              style={[styles.quantityButton, { borderColor: colors.tint }]}
              onPress={increaseQuantity}
            >
              <MaterialIcons name="add" size={20} color={colors.tint} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.addToCartButton, { backgroundColor: colors.tint }]}
            onPress={() => console.log('Add to cart', { id, quantity })}
          >
            <MaterialCommunityIcons name="cart-plus" size={20} color="white" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Details Section */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
            {product.description}
          </Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Category
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
            {product.category?.title} - {product.subcategory?.title}
          </Text>
        </View>

        {/* Rating */}
        {product.rate && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Rating
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.ratingContainer}>
              <View style={styles.starContainer}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome 
                    key={i}
                    name="star" 
                    size={18} 
                    color={i < Math.floor(product.rate) ? '#FFD700' : '#DDD'} 
                  />
                ))}
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {product.rate.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Details */}
        {product.details && Object.keys(product.details).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Specifications
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {Object.entries(product.details).map(([key, value], index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialIcons 
                  name="check-circle" 
                  size={18} 
                  color={colors.tint} 
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {key}: {value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  retryButton: {
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sliderContainer: {
    height: width * 0.9,
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  productImage: {
    width: width,
    height: width * 0.9,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  infoContainer: {
    padding: 20,
    marginBottom: -20,
    borderRadius: 12,
  },
  titleContainer: {
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 16,
    opacity: 0.8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 200,
    marginTop: -6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1.5,
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsContainer: {
    padding: 20,
    marginTop: 0,
    borderRadius: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  productDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 12,
    opacity: 0.2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});