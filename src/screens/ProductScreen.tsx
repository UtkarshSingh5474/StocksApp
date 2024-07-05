import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import StockChart from '../components/StockChart';
import { fetchCompanyOverview } from '../api/stockAPI';
import { useTheme } from '../theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

type Props = {
  route: ProductScreenRouteProp;
};

const STORAGE_KEY_RECENT_STOCKS = '@recentlyVisitedStocks';
const MAX_RECENT_STOCKS = 5; // Maximum number of recently visited stocks to store

const ProductScreen: React.FC<Props> = ({ route }) => {
  const { symbol, current_price, change_amount, change_percentage } = route.params;
  const { theme } = useTheme();
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    fetchCompanyData(symbol);
  }, [symbol]);


  const fetchCompanyData = async (symbol: string) => {
    const data = await fetchCompanyOverview(symbol);
    setCompanyInfo(data);
  };

  useEffect(() => {    saveToRecentlyVisited(symbol, Name, AssetType);
  }, [companyInfo]);
  const saveToRecentlyVisited = async (symbol: string, name: string, assetType: string) => {
    try {
      let recentlyVisitedStocks = await AsyncStorage.getItem(STORAGE_KEY_RECENT_STOCKS);
      let stocks: { symbol: string; name: string; assetType: string }[] = [];
      
      if (recentlyVisitedStocks) {
        stocks = JSON.parse(recentlyVisitedStocks);
      }
  
      stocks = stocks.filter((item) => item.symbol !== symbol);
  
      stocks.unshift({ symbol, name, assetType });
  
      if (stocks.length > MAX_RECENT_STOCKS) {
        stocks = stocks.slice(0, MAX_RECENT_STOCKS);
      }
  
      await AsyncStorage.setItem(STORAGE_KEY_RECENT_STOCKS, JSON.stringify(stocks));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  if (!companyInfo) {
    return null; 
  }

  const {
    Name,
    Description,
    Address,
    MarketCapitalization,
    PEGRatio,
    TrailingPE,
    PriceToBookRatio,
    Beta,
    '52WeekHigh': WeekHigh52,
    '52WeekLow': WeekLow52,
    '50DayMovingAverage': MovingAvg50,
    '200DayMovingAverage': MovingAvg200,
    AssetType,
    Sector,
  } = companyInfo;

  const currentPrice = current_price;
  const priceChange = parseFloat(change_amount);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logo and Chips */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoCard, { backgroundColor: theme.colors.imageBackground }]}>
          <Image
            source={{
              uri: `https://financialmodelingprep.com/image-stock/${symbol}.png`,
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.chipsContainer}>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }}>{Name}</Text>
          <View style={[styles.chip, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.chipText, { color: theme.colors.text }]}>Symbol: {symbol}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.chipText, { color: theme.colors.text }]}>Type: {AssetType}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.chipText, { color: theme.colors.text }]}>Sector: {Sector}</Text>
          </View>
        </View>
      </View>

      {/* Stock Price with Change */}
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: theme.colors.text }]}>${currentPrice}</Text>
        <Text style={[styles.change, { color: priceChange >= 0 ? '#0abb92' : '#d55438' }]}>
          {priceChange >= 0 ? `+${priceChange}` : `${priceChange}`} ({change_percentage})
        </Text>
      </View>

      {/* Stock Chart */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Stock Chart</Text>
        <StockChart symbol={symbol} />
      </View>

      {/* Company Information */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Company Information</Text>
        <Text style={{ color: theme.colors.text }}>{Description}</Text>
        <Text style={[styles.address, { color: theme.colors.text }]}>{Address}</Text>
      </View>

      {/* Stock Metrics */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Stock Metrics</Text>
        <View style={styles.metricsContainer}>
          <Text style={[styles.metric, { color: theme.colors.text }]}>Market Cap: {MarketCapitalization}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>P/E Ratio: {TrailingPE}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>P/E Growth Ratio: {PEGRatio}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>Beta: {Beta}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>52-Week High: {WeekHigh52}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>52-Week Low: {WeekLow52}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>50-Day Moving Avg: {MovingAvg50}</Text>
          <Text style={[styles.metric, { color: theme.colors.text }]}>200-Day Moving Avg: {MovingAvg200}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCard: {
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    elevation: 3, // For Android
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  logo: {
    width: 80,
    height: 80,
  },
  chipsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  chip: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  chipText: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  change: {
    fontSize: 18,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3, // For Android
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    marginTop: 10,
  },
  metricsContainer: {
    marginTop: 10,
  },
  metric: {
    marginBottom: 5,
  },
});

export default ProductScreen;
