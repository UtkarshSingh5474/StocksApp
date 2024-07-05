import Config from "react-native-config";

const BASE_URL = 'https://www.alphavantage.co';
const API_KEY = "demo"; // Read API key from environment variable or fallback to demo

const endpoints = {
  topGainersLosers: `${BASE_URL}/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`,
  companyOverview: (symbol: string) => `${BASE_URL}/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`,
  tickerSearch: (keywords: string) => `${BASE_URL}/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`,
  dailyTimeSeries: (symbol: string) => `${BASE_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`,
  monthlyTimeSeries: (symbol: string) => `${BASE_URL}/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`,
  intradayTimeSeries: (symbol: string, interval: string = '5min') => `${BASE_URL}/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`,
};

const fetchTopGainersLosers = async () => {
  try {
    const response = await fetch(endpoints.topGainersLosers);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top gainers/losers:', error);
    throw error;
  }
};

const fetchCompanyOverview = async (symbol: string) => {
  try {
    const response = await fetch(endpoints.companyOverview(symbol));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching company overview for ${symbol}:`, error);
    throw error;
  }
};

const fetchTickerSearch = async (keywords: string) => {
  try {
    const response = await fetch(endpoints.tickerSearch(keywords));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ticker search for ${keywords}:`, error);
    throw error;
  }
};

const fetchDailyTimeSeries = async (symbol: string) => {
  try {
    const response = await fetch(endpoints.dailyTimeSeries(symbol));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching daily time series for ${symbol}:`, error);
    throw error;
  }
};


const fetchMonthlyTimeSeries = async (symbol: string) => {
  try {
    const response = await fetch(endpoints.monthlyTimeSeries(symbol));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching monthly time series for ${symbol}:`, error);
    throw error;
  }
};

const fetchIntradayTimeSeries = async (symbol: string, interval: string = '5min') => {
  try {
    const response = await fetch(endpoints.intradayTimeSeries(symbol, interval));
    const data = await response.json();
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
