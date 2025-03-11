# eSewa Payment Integration Demo

This is a simple React Native Expo app that demonstrates how to integrate eSewa payment gateway in a mobile application.

## Features

- Browse sample products
- View product details
- Process payments using eSewa
- Verify payment status
- Handle payment success and failure scenarios

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```
 
3. Start the development server:
   ```
   npx expo start
   ```
  

## eSewa Integration

This app demonstrates the integration of eSewa payment gateway using the following approach:

1. **Generate HMAC Signature**: Create a signature using HMAC-SHA256 algorithm with the required parameters.
2. **Create Payment Form**: Generate an HTML form with all the necessary parameters for eSewa payment.
3. **WebView Integration**: Use React Native WebView to load the payment form and handle redirects.
4. **Verify Payment**: Check payment status using eSewa's status check API.
5. **Handle Response**: Process the response from eSewa and verify the signature.

### Important Notes on Signature Generation

The signature generation is a critical part of the eSewa integration. The signature is created using the HMAC-SHA256 algorithm with the following parameters:

- **Input String Format**: `total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST`
- **Secret Key**: `8gBm/:&EnhH.1/q` (for testing environment)
- **Output Format**: Base64 encoded string

If you encounter the error `{"code":"ES104","message":"Invalid payload signature."}`, it means the signature is not being generated correctly. Make sure:

1. The secret key is exactly as provided by eSewa (no extra characters)
2. The input string format is correct
3. The parameters are in the correct order (total_amount, transaction_uuid, product_code)
4. The signature is properly Base64 encoded

### Test Credentials

For testing purposes, you can use the following eSewa credentials:

- eSewa ID: 9806800001/2/3/4/5
- Password: Nepal@123
- MPIN: 1122 (for application only)
- Token: 123456

## Project Structure

```
src/
├── components/       # Reusable UI components
├── navigation/       # Navigation setup
├── screens/          # App screens
│   ├── HomeScreen.js             # Product listing
│   ├── ProductDetailsScreen.js    # Product details
│   ├── PaymentScreen.js          # eSewa payment handling
│   ├── PaymentSuccessScreen.js   # Payment success screen
│   └── PaymentFailureScreen.js   # Payment failure screen
└── utils/            # Utility functions
    └── eSewaUtils.js             # eSewa integration utilities
```

## Troubleshooting

### Invalid Payload Signature Error

If you encounter the "Invalid payload signature" error:

1. Check the secret key - it should be exactly `8gBm/:&EnhH.1/q` for testing
2. Verify the input string format for signature generation
3. Make sure all parameters are correctly formatted
4. Check the console logs for debugging information

### WebView Issues

If the WebView is not loading or redirecting properly:

1. Make sure `javaScriptEnabled` and `domStorageEnabled` are set to `true`
2. Check that the success and failure URLs are correctly set
3. Verify that the WebView can handle the redirects

## eSewa API Documentation

For more information about eSewa integration, visit the official documentation:
[eSewa Developer Portal](https://developer.esewa.com.np/)

## Notes

- This app uses the eSewa UAT (testing) environment.
- For production, you need to change the API URLs and obtain a production merchant code.
- The secret key used in this demo is for testing purposes only.

## License

This project is licensed under the MIT License. 
