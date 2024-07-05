import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../screens/ExploreScreen';
import ProductScreen from '../screens/ProductScreen';

export type RootStackParamList = {
  Explore: undefined;
  Product: { symbol: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Explore">
        <Stack.Screen 
          name="Explore" 
          component={ExploreScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Product" 
          component={ProductScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
