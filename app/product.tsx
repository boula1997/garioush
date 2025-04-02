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

const { width } = Dimensions.get('window');

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

      {/* Product Info Section */}
      <View style={[styles.infoContainer, { backgroundColor: colors.cardBackground }]}>
        {/* Title and Brand */}
        <View style={styles.titleContainer}>
          <Text style={[styles.productTitle, { color: colors.text }]}>
            {product.title}
          </Text>
          <View style={styles.priceContainer}>
          <Text style={[styles.brandText, { color: colors.textSecondary }]}>
            by {product.brand}
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

     

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Key Features
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {product.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <MaterialIcons 
                name="check-circle" 
                size={18} 
                color={colors.tint} 
                style={styles.featureIcon}
              />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        

        {/* Ratings */}
        {/* <View style={styles.ratingContainer}>
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, i) => (
              <FontAwesome 
                key={i}
                name="star" 
                size={18} 
                color={i < Math.floor(product.rating) ? '#FFD700' : '#DDD'} 
              />
            ))}
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
            {product.reviews} reviews
          </Text>
        </View> */}
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
    height: width * 0.9, // Slightly smaller than screen width
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
    width: 16,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  infoContainer: {
    padding: 20,
    // margin: 16,
    marginBottom:-20,
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
    flex: 1,
    marginLeft: 200,
    marginTop:-6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  priceContainer:{
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
    // margin: 16,
    marginTop: 0,
    borderRadius: 12,
   
  },
  section: {
    // marginBottom: 16,
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
    // marginVertical: 16,
    opacity: 0.2,
    marginBottom:12,
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
  reviewsText: {
    fontSize: 14,
    opacity: 0.8,
  },
});