import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  // Calculate tax (13% VAT)
  const taxAmount = product.price * 0.13;
  const totalAmount = product.price + taxAmount;

  const handleBuyNow = () => {
    navigation.navigate('Payment', {
      product,
      taxAmount,
      totalAmount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>Rs. {product.price.toLocaleString()}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
        
        <View style={styles.priceBreakdown}>
          <Text style={styles.breakdownTitle}>Price Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Product Price:</Text>
            <Text style={styles.breakdownValue}>Rs. {product.price.toLocaleString()}</Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>VAT (13%):</Text>
            <Text style={styles.breakdownValue}>Rs. {taxAmount.toLocaleString()}</Text>
          </View>
          
          <View style={[styles.breakdownRow, styles.totalRow]}>
            <Text style={[styles.breakdownLabel, styles.totalLabel]}>Total:</Text>
            <Text style={[styles.breakdownValue, styles.totalValue]}>
              Rs. {totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy Now with eSewa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#5cb85c',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  priceBreakdown: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 80, // Add space for the footer
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#555',
  },
  breakdownValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    borderBottomWidth: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5cb85c',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buyButton: {
    backgroundColor: '#5cb85c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen; 