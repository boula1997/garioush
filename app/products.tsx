import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Image,
  FlatList,
  Modal,
  Pressable,
  ScrollView
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data with filterable attributes
const PRODUCTS = {
  oils: [
    { 
      id: '1', 
      name: 'Synthetic Engine Oil 5W-30', 
      description: 'Full synthetic formula for maximum engine protection',
      price: 29.99, 
      image: 'https://i5.walmartimages.com/asr/bde5ac12-96d7-4fb4-b5b4-23e66bcb1153.0237dcc88da6d4df6165af7a754ca974.jpeg',
      brand: 'Mobil',
      viscosity: '5W-30',
      rating: 4.5
    },
    { 
      id: '2', 
      name: 'High Mileage Oil', 
      description: 'For vehicles over 75,000 miles',
      price: 34.99, 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuU8LIu1HEyBlBtRdoU_wKL8ITC_FQd-K2IA&s',
      brand: 'Castrol',
      viscosity: '10W-40',
      rating: 4.2
    }
  ],
  // Add other categories...
};

// Filter options by category
const FILTER_OPTIONS = {
  oils: [
    { 
      name: 'Brand', 
      options: ['Mobil', 'Castrol', 'Valvoline', 'Shell'],
      type: 'checkbox'
    },
    {
      name: 'Viscosity',
      options: ['5W-30', '10W-40', '0W-20', '15W-50'],
      type: 'checkbox'
    },
    {
      name: 'Rating',
      options: ['4+ stars', '3+ stars'],
      type: 'radio'
    }
  ]
};

export default function ProductsScreen() {
  const { category } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    Brand: [],
    Viscosity: [],
    Rating: ''
  });

  // Apply all filters and search
  const filteredProducts = PRODUCTS[category]?.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Brand filter
    const matchesBrand = activeFilters.Brand.length === 0 || 
                         activeFilters.Brand.includes(product.brand);
    
    // Viscosity filter
    const matchesViscosity = activeFilters.Viscosity.length === 0 || 
                            activeFilters.Viscosity.includes(product.viscosity);
    
    // Rating filter
    const matchesRating = !activeFilters.Rating || 
                         (activeFilters.Rating === '4+ stars' && product.rating >= 4) ||
                         (activeFilters.Rating === '3+ stars' && product.rating >= 3);
    
    return matchesSearch && matchesBrand && matchesViscosity && matchesRating;
  }) || [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0; // Default sorting
  });

  // Toggle filter selection
  const toggleFilter = (filterName, value, filterType) => {
    if (filterType === 'checkbox') {
      setActiveFilters(prev => ({
        ...prev,
        [filterName]: prev[filterName].includes(value)
          ? prev[filterName].filter(v => v !== value)
          : [...prev[filterName], value]
      }));
    } else {
      // Radio button behavior
      setActiveFilters(prev => ({
        ...prev,
        [filterName]: prev[filterName] === value ? '' : value
      }));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      Brand: [],
      Viscosity: [],
      Rating: ''
    });
  };

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

      {/* Action Row (Filter + Sort) */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons 
            name="filter-list" 
            size={18} 
            color={colors.tint} 
          />
          <Text style={[styles.actionText, { color: colors.tint }]}>
            Filters
            {Object.values(activeFilters).flat().length > 0 && (
              <Text style={styles.filterBadge}> •</Text>
            )}
          </Text>
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
          <MaterialIcons 
            name="sort" 
            size={18} 
            color={colors.tint} 
          />
          <Text style={[styles.actionText, { color: colors.tint }]}>
            Sort: {sortOption === 'default' ? 'Default' : 
                 sortOption === 'price-low' ? 'Price Low' : 
                 sortOption === 'price-high' ? 'Price High' : 'Rating'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Indicator */}
      {Object.values(activeFilters).flat().length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeFilters.Brand.map(brand => (
              <View key={brand} style={[styles.activeFilter, { backgroundColor: colors.tint }]}>
                <Text style={styles.activeFilterText}>Brand: {brand}</Text>
              </View>
            ))}
            {activeFilters.Viscosity.map(viscosity => (
              <View key={viscosity} style={[styles.activeFilter, { backgroundColor: colors.tint }]}>
                <Text style={styles.activeFilterText}>Viscosity: {viscosity}</Text>
              </View>
            ))}
            {activeFilters.Rating && (
              <View style={[styles.activeFilter, { backgroundColor: colors.tint }]}>
                <Text style={styles.activeFilterText}>Rating: {activeFilters.Rating}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Products List */}
      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.productCard, { backgroundColor: colors.cardBackground }]}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
            
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.productDesc, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
              <View style={styles.priceRatingContainer}>
                <Text style={[styles.productPrice, { color: colors.tint }]}>
                  ${item.price.toFixed(2)}
                </Text>
                {/* <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={14} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                    {item.rating.toFixed(1)}
                  </Text>
                </View> */}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.cartButton, { backgroundColor: colors.tint }]}
              onPress={() => console.log('Add to cart', item.id)}
            >
              <MaterialCommunityIcons name="cart-plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.productsContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={50} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No products match your filters
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterOptionsContainer}>
            {FILTER_OPTIONS[category]?.map((filter, index) => (
              <View key={index} style={styles.filterGroup}>
                <Text style={[styles.filterGroupTitle, { color: colors.text }]}>
                  {filter.name}
                </Text>
                {filter.options.map((option, i) => (
                  <Pressable
                    key={i}
                    style={styles.filterOption}
                    onPress={() => toggleFilter(filter.name, option, filter.type)}
                  >
                    {filter.type === 'checkbox' ? (
                      <MaterialIcons 
                        name={
                          activeFilters[filter.name]?.includes(option) 
                            ? 'check-box' 
                            : 'check-box-outline-blank'
                        } 
                        size={24} 
                        color={colors.tint} 
                      />
                    ) : (
                      <MaterialIcons 
                        name={
                          activeFilters[filter.name] === option 
                            ? 'radio-button-checked' 
                            : 'radio-button-unchecked'
                        } 
                        size={24} 
                        color={colors.tint} 
                      />
                    )}
                    <Text style={[styles.filterOptionText, { color: colors.text }]}>
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, { borderColor: colors.tint }]}
              onPress={clearFilters}
            >
              <Text style={[styles.modalButtonText, { color: colors.tint }]}>
                Clear All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={[styles.modalButtonText, { color: 'white' }]}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  filterBadge: {
    color: 'red',
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 32,
  },
  activeFilter: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterText: {
    color: 'white',
    fontSize: 12,
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
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  cartButton: {
    position: 'absolute',
    bottom: 5,
    right: 6,
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  // Filter Modal Styles
  modalContainer: {
    flex: 1,
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterOptionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});