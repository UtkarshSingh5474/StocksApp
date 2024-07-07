//I know this is not a good practice to expose the API key in the client side insted of environment variables.
//But due to the api limits i have implemented a solution to change api key in the client side.
//That's why i have implemented a screen to change the api key.
// There are 2 modes. 
// 1.Demo mode('demo' api key which has only certain example endpoints but with no limits) 
// 2. Custom mode(You can enter your own api key) but it has limits.

import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey='2Z60PPZFWUTTEQAD';
const STORAGE_KEY = 'apiKey';

const getApiKey = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

const setApiKey = async (apiKey: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, apiKey);
  } catch (error) {
    console.error('Error setting API key:', error);
  }
};

const resetToDemoApiKey = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'demo');
  } catch (error) {
    console.error('Error resetting to demo API key:', error);
  }
};

export default {
  getApiKey,
  setApiKey,
  resetToDemoApiKey,
  apiKey,
};
