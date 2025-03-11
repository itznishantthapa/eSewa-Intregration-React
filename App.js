import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

// Ignore specific warnings that might be related to WebView
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'WebView has been extracted from react-native core',
]);

export default function App() {
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
