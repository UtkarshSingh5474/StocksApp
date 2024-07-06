import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';
import apiConstants from '../constants/API';

const BASE_URL = 'https://www.alphavantage.co';

const getApiKey = async () => {
  const apiKey = await AsyncStorage.getItem('apiKey');
  if (!apiKey) {
    apiConstants.setApiKey("demo");
  }
  console.log('apiKey:', apiKey);
  return apiKey ? apiKey : "demo"; // Use the environment variable if no key is stored
};

const endpoints = {
  topGainersLosers: async () => `${BASE_URL}/query?function=TOP_GAINERS_LOSERS&apikey=${await getApiKey()}`,
  companyOverview: async (symbol: string) => `${BASE_URL}/query?function=OVERVIEW&symbol=${symbol}&apikey=${await getApiKey()}`,
  tickerSearch: async (keywords: string) => `${BASE_URL}/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${await getApiKey()}`,
  dailyTimeSeries: async (symbol: string) => `${BASE_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${await getApiKey()}`,
  monthlyTimeSeries: async (symbol: string) => `${BASE_URL}/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${await getApiKey()}`,
  intradayTimeSeries: async (symbol: string, interval: string = '5min') => `${BASE_URL}/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${await getApiKey()}`,
};

const handleRateLimitReached = (data: any) => {
  if (data.Information && data.Information.includes("API rate limit")) {
    Alert.alert(
      'API Limit Reached',
      'Please change your API key from Explore menu',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
    return true;
  }
  return false;
};

// Fetch function with rate limit handling
const fetchTopGainersLosers = async () => {
  try {
    const response = await fetch(await endpoints.topGainersLosers());
    const data = await response.json();

    if (handleRateLimitReached(data)) {
      return null; // or handle accordingly, e.g., return an empty array or object
    }

    return data;
  } catch (error) {
    console.error('Error fetching top gainers/losers:', error);
    throw error;
  }
};

const fetchCompanyOverview = async (symbol: string) => {
  try {
    const response = await fetch(await endpoints.companyOverview(symbol));
    const data = await response.json();

    if (handleRateLimitReached(data)) {
      return null; // or handle accordingly
    }

    return data;
  } catch (error) {
    console.error(`Error fetching company overview for ${symbol}:`, error);
    throw error;
  }
};

const fetchTickerSearch = async (keywords: string) => {
  try {
    const response = await fetch(await endpoints.tickerSearch(keywords));
    const data = await response.json();

    if (handleRateLimitReached(data)) {
      return null; // or handle accordingly
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ticker search for ${keywords}:`, error);
    throw error;
  }
};

const fetchDailyTimeSeries = async (symbol: string) => {
  try {
    const response = await fetch(await endpoints.dailyTimeSeries(symbol));
    const data = await response.json();

    if (handleRateLimitReached(data)) {
      return null; // or handle accordingly
    }

    return data;
  } catch (error) {
    console.error(`Error fetching daily time series for ${symbol}:`, error);
    throw error;
  }
};

const fetchMonthlyTimeSeries = async (symbol: string) => {
  try {
    const response = await fetch(await endpoints.monthlyTimeSeries(symbol));
    const data = await response.json();

    if (handleRateLimitReached(data)) {
      return null; // or handle accordingly
    }

    return data;
  } catch (error) {
    console.error(`Error fetching monthly time series for ${symbol}:`, error);
    throw error;
  }
};

const fetchIntradayTimeSeries = async (symbol: string, interval: string = '5min') => {
  try {
    const response = await fetch(await endpoints.intradayTimeSeries(symbol, interval));
    const data = await response.json();

    if (handleRateLimitReached(data)) {
      return null; // or handle accordingly
    }

    return data;
  } catch (error) {
    console.error(`Error fetching intraday time series for ${symbol} (${interval}):`, error);
    throw error;
  }
};

export {
  endpoints,
  fetchTopGainersLosers,
  fetchCompanyOverview,
  fetchTickerSearch,
  fetchDailyTimeSeries,
  fetchMonthlyTimeSeries,
  fetchIntradayTimeSeries,
};
