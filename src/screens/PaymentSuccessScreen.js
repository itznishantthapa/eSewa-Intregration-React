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
import { checkPaymentStatus, PRODUCT_CODE, verifySignature } from '../utils/eSewaUtils';

const PaymentSuccessScreen = ({ route, navigation }) => {
  const { product, transactionUuid, responseData } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    // Log the response data for debugging
    console.log('Response data in success screen:', responseData);
    
    // Verify the signature from the response if available
    let isSignatureValid = false;
    if (responseData && responseData.signature) {
      try {
        isSignatureValid = verifySignature(responseData);
        console.log('Signature verification result:', isSignatureValid);
      } catch (error) {
        console.error('Error verifying signature:', error);
      }
    }
    setVerificationResult(isSignatureValid);

    // Check payment status from eSewa API
    const verifyPayment = async () => {
      try {
        const totalAmount = responseData?.total_amount || (product.price * 1.13).toString();
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
        setPaymentStatus(status);
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Use response data as fallback if API call fails
        setPaymentStatus(responseData || { status: 'UNKNOWN' });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [product, transactionUuid, responseData]);

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5cb85c" />
        <Text style={styles.loadingText}>Verifying payment...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your payment for {product.name} has been processed successfully.
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[
              styles.detailValue, 
              { color: paymentStatus?.status === 'COMPLETE' ? '#5cb85c' : '#f0ad4e' }
            ]}>
              {paymentStatus?.status || 'COMPLETE'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID:</Text>
            <Text style={styles.detailValue}>{transactionUuid}</Text>
          </View>
          
          {paymentStatus?.ref_id && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference ID:</Text>
              <Text style={styles.detailValue}>{paymentStatus.ref_id}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>
              Rs. {parseFloat(paymentStatus?.total_amount || (product.price * 1.13)).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Product:</Text>
            <Text style={styles.detailValue}>{product.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Signature Verification:</Text>
            <Text style={[
              styles.detailValue, 
              { color: verificationResult ? '#5cb85c' : '#d9534f' }
            ]}>
              {verificationResult ? 'Valid' : 'Not Verified'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleBackToHome}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
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
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5cb85c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
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
    marginBottom: 30,
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
  button: {
    backgroundColor: '#5cb85c',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentSuccessScreen; 