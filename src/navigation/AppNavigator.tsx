import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../screens/ExploreScreen';
import ProductScreen from '../screens/ProductScreen';
import SearchScreen from '../screens/SearchScreen';

export type RootStackParamList = {
  Explore: undefined;
  Product: { symbol: string ,current_price:string,change_amount:string,change_percentage:string};
  Search: undefined;
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
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
