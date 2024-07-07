import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  fetchTopGainersLosers, 
  fetchCompanyOverview, 
  fetchTickerSearch, 
  fetchDailyTimeSeries, 
  fetchMonthlyTimeSeries, 
  fetchIntradayTimeSeries 
} from './stockAPI';

const CACHE_EXPIRATION_TIME = 40 * 60 * 1000; // 40 minutes in milliseconds

const CACHE_KEY_PREFIX = '@cachedData_';

const generateCacheKey = (endpoint: string, params?: any) => {
  const paramString = params ? JSON.stringify(params) : '';
  return `${CACHE_KEY_PREFIX}${endpoint}_${paramString}`;
};

const fetchWithCache = async (endpoint: string, params?: any) => {
  const cacheKey = generateCacheKey(endpoint, params);
  
  try {
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`Data found in cache for ${endpoint} and params ${JSON.stringify(params)}.`);
      const parsedData = JSON.parse(cachedData);
      const cachedTime = parsedData.timestamp;
      if (Date.now() - cachedTime < CACHE_EXPIRATION_TIME) {
        return parsedData.data; 
      }
    }
    const fetchData = await fetchApiData(endpoint, params);
    return fetchData;
  } catch (error) {
    console.error(`Error fetching data from cache or API for ${endpoint}:`, error);
    throw error;
  }
};

const fetchApiData = async (endpoint: string, params?: any) => {
  let data;
  switch (endpoint) {
    case 'topGainersLosers':
      data = await fetchTopGainersLosers();
      break;
    case 'companyOverview':
      const { symbol: overviewSymbol } = params;
      data = await fetchCompanyOverview(overviewSymbol);
      break;
    case 'dailyTimeSeries':
      const { symbol: dailySymbol } = params;
      data = await fetchDailyTimeSeries(dailySymbol);
      break;
    case 'monthlyTimeSeries':
      const { symbol: monthlySymbol } = params;
      data = await fetchMonthlyTimeSeries(monthlySymbol);
      break;
    case 'intradayTimeSeries':
      const { symbol: intradaySymbol, interval } = params;
      data = await fetchIntradayTimeSeries(intradaySymbol, interval);
      break;
    default:
      throw new Error(`Unsupported endpoint: ${endpoint}`);
  }

  //Saving data to cache
  const cacheKey = generateCacheKey(endpoint, params);
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  if(data===null) return data;
  await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  return data;
};

const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log('Cache cleared successfully.');
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
};

export {
  fetchWithCache,
  clearCache,
};
