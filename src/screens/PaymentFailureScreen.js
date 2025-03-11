import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { checkPaymentStatus, PRODUCT_CODE } from '../utils/eSewaUtils';

const PaymentFailureScreen = ({ route, navigation }) => {
  const { product, transactionUuid } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('Payment failure screen - Transaction UUID:', transactionUuid);
    
    // Check payment status from eSewa API to confirm failure
    const verifyPayment = async () => {
      try {
        const totalAmount = (product.price * 1.13).toString();
        console.log('Checking payment status with:', {
          productCode: PRODUCT_CODE,
          transactionUuid,
          totalAmount
        });
        
        const status = await checkPaymentStatus(
          PRODUCT_CODE,
          transactionUuid,
          totalAmount
        );
        console.log('Payment status response:', status);
        
        if (status.code && status.message) {
          // This is an error response
          setErrorMessage(status.message);
          setPaymentStatus({ status: 'FAILED' });
        } else {
          setPaymentStatus(status);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setErrorMessage('Could not verify payment status');
        setPaymentStatus({ status: 'NOT_FOUND' });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [product, transactionUuid]);

  const handleTryAgain = () => {
    // Navigate back to product details to try payment again
    navigation.navigate('ProductDetails', { product });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d9534f" />
        <Text style={styles.loadingText}>Checking payment status...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.failureIconContainer}>
          <Text style={styles.failureIcon}>✕</Text>
        </View>
        
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          Your payment for {product.name} could not be processed.
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, { color: '#d9534f' }]}>
              {paymentStatus?.status || 'FAILED'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID:</Text>
            <Text style={styles.detailValue}>{transactionUuid}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>
              Rs. {(product.price * 1.13).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Product:</Text>
            <Text style={styles.detailValue}>{product.name}</Text>
          </View>
          
          {errorMessage && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Error:</Text>
              <Text style={[styles.detailValue, { color: '#d9534f' }]}>
                {errorMessage}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Possible Reasons for Failure:</Text>
          <Text style={styles.messageItem}>• Insufficient balance in eSewa account</Text>
          <Text style={styles.messageItem}>• Transaction timed out</Text>
          <Text style={styles.messageItem}>• Payment was cancelled</Text>
          <Text style={styles.messageItem}>• Technical issue with eSewa service</Text>
          <Text style={styles.messageItem}>• Invalid signature in the request</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  failureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  failureIcon: {
    fontSize: 50,
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  messageCard: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 10,
  },
  messageItem: {
    fontSize: 14,
    color: '#721c24',
    marginBottom: 5,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: '#5cb85c',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentFailureScreen; 