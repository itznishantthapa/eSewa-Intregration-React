import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { 
  createEsewaPaymentForm, 
  generateTransactionUuid, 
  PRODUCT_CODE 
} from '../utils/eSewaUtils';

const PaymentScreen = ({ route, navigation }) => {
  const { product, taxAmount, totalAmount } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentHtml, setPaymentHtml] = useState('');
  const [transactionUuid, setTransactionUuid] = useState('');

  useEffect(() => {
    // Generate a unique transaction ID
    const uuid = generateTransactionUuid();
    setTransactionUuid(uuid);

    // Create the payment form HTML
    const paymentDetails = {
      amount: product.price.toString(),
      taxAmount: taxAmount.toString(),
      totalAmount: totalAmount.toString(),
      transactionUuid: uuid,
      productServiceCharge: '0',
      productDeliveryCharge: '0',
      // Use absolute URLs for success and failure
      successUrl: 'https://developer.esewa.com.np/success',
      failureUrl: 'https://developer.esewa.com.np/failure'
    };

    const html = createEsewaPaymentForm(paymentDetails);
    setPaymentHtml(html);
    setLoading(false);
  }, [product, taxAmount, totalAmount]);

  const handleNavigationStateChange = (navState) => {
    // Check if the URL is the success or failure URL
    const { url } = navState;
    console.log('Navigation state changed:', url);

    if (url.includes('developer.esewa.com.np/success')) {
      // Extract the response data from the URL
      const responseData = extractResponseData(url);
      console.log('Success response data:', responseData);
      
      // Navigate to success screen with the response data
      navigation.replace('PaymentSuccess', { 
        product, 
        transactionUuid,
        responseData 
      });
    } else if (url.includes('developer.esewa.com.np/failure')) {
      console.log('Payment failed');
      // Navigate to failure screen
      navigation.replace('PaymentFailure', { 
        product, 
        transactionUuid 
      });
    }
  };

  // Helper function to extract response data from URL
  const extractResponseData = (url) => {
    try {
      // The response is in the query parameter as base64 encoded JSON
      const urlObj = new URL(url);
      const base64Data = urlObj.searchParams.get('data');
      
      if (base64Data) {
        // Decode base64 to get the JSON string
        const jsonString = atob(base64Data);
        // Parse the JSON string to get the response object
        return JSON.parse(jsonString);
      }
    } catch (error) {
      console.error('Error extracting response data:', error);
    }
    
    // Return a default response if extraction fails
    return {
      status: 'COMPLETE',
      transaction_uuid: transactionUuid,
      product_code: PRODUCT_CODE,
      total_amount: totalAmount.toString()
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5cb85c" />
        <Text style={styles.loadingText}>Preparing payment...</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ html: paymentHtml }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      renderLoading={() => (
        <View style={styles.webviewLoading}>
          <ActivityIndicator size="large" color="#5cb85c" />
          <Text style={styles.loadingText}>Loading eSewa payment...</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default PaymentScreen; 