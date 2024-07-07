import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ThemeProvider } from './src/theme/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      Alert.alert(
        'No Internet Connection',
        'Please check your network settings and try again.',
        [{ text: 'OK', onPress: () => {} }]
      );
    }
  }, [isConnected]);

  if (isConnected === null) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
