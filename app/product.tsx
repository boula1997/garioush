import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image,
  FlatList,
  Dimensions
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams } from 'expo-router';

// Mock product data
const PRODUCTS = {
  '1': {
    id: '1',
    title: 'Synthetic Engine Oil 5W-30',
    brand: 'Mobil',
    price: 29.99,
    description: 'Premium full synthetic engine oil designed to provide outstanding engine protection and performance. Formulated with advanced synthetic technology to help extend engine life.',
    features: [
      'Provides excellent engine cleanliness',
      'Enhanced wear protection',
      'Improved fuel economy',
      'Works in extreme temperatures'
    ],
    images: [
      'https://i5.walmartimages.com/seo/Mobil-1-Advanced-Full-Synthetic-Motor-Oil-5W-20-5-Quart_d481d07b-e2c3-45a9-b267-86b0b1ad8f99.e7397b4ced80f22e1a104fa987dd2606.jpeg',
      'https://scene7.samsclub.com/is/image/samsclub/0007192444975_A',
      'https://www.mobil.com/lubricants/-/media/project/wep/mobil/mobil-row-us-1/for-personal-vehicles/auto-care/all-about-oil/aug-20-updates/5w-20-oil-viscosity-mobil-2020/5w-20-oil-viscosity-mobil-2020-fb-og.jpg'
    ],
    rating: 4.5,
    reviews: 128,
    inStock: true
  }
};

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const product = PRODUCTS[id];
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text }]}>Product not found</Text>
      </View>
    );
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <FlatList
          data={product.images}
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
        <View style={styles.pagination}>
          {product.images.map((_, index) => (
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
      </View>

      {/* Price and Add to Cart */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.productTitle, { color: colors.text }]}>
          {product.title}
        </Text>
        </View>
      <View style={[styles.priceContainer, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.price, { color: colors.tint }]}>
          ${product.price.toFixed(2)}
        </Text>
        </View>
      <View style={[styles.priceCartContainer, { backgroundColor: colors.cardBackground }]}>
        
        
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

      {/* Product Details */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardBackground }]}>
       
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Description
        </Text>
        <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
          {product.description}
        </Text>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Features
        </Text>
        {product.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <MaterialIcons 
              name="check-circle" 
              size={16} 
              color={colors.tint} 
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              {feature}
            </Text>
          </View>
        ))}
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.ratingContainer}>
          <View style={styles.starContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
            ({product.reviews} reviews)
          </Text>
        </View>
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
  sliderContainer: {
    height: 300,
    position: 'relative',
  },
  productImage: {
    width: width,
    height: 300,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  priceCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  priceContainer:{
    paddingLeft: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsContainer: {
    // margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    // marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
  },
});