import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import StockChart from '../components/StockChart';
import { useTheme } from '../theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithCache } from '../services/dataService';
import BackArrow from '../assets/back-arrow.svg';
import colors from '../constants/Colors';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

type Props = {
  route: ProductScreenRouteProp;
};

const STORAGE_KEY_RECENT_STOCKS = '@recentlyVisitedStocks';
const MAX_RECENT_STOCKS = 5;

const ProductScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { symbol } = route.params;
  const { theme } = useTheme();
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchCompanyData(symbol);
  }, [symbol]);

  const fetchCompanyData = async (symbol: string) => {
    try {
      const cleanedSymbol = symbol.replace(/\+$/, ''); 
      const data = await fetchWithCache('companyOverview', { symbol: cleanedSymbol });
      if (data?.AssetType === 'Common Stock') data.AssetType = 'Equity';
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyInfo) {
      saveToRecentlyVisited(symbol, companyInfo.Name, companyInfo.AssetType);
    }
  }, [companyInfo]);

  const saveToRecentlyVisited = async (symbol: string, name: string, assetType: string) => {
    if (!symbol || !name || !assetType) return;

    try {
      let recentlyVisitedStocks = await AsyncStorage.getItem(STORAGE_KEY_RECENT_STOCKS);
      let stocks: { symbol: string; name: string; assetType: string }[] = [];

      if (assetType === 'Common Stock') assetType = 'Equity';

      if (recentlyVisitedStocks) {
        stocks = JSON.parse(recentlyVisitedStocks);
      }

      stocks = stocks.filter(item => item.symbol !== symbol);
      stocks.unshift({ symbol, name, assetType });

      if (stocks.length > MAX_RECENT_STOCKS) {
        stocks = stocks.slice(0, MAX_RECENT_STOCKS);
      }

      await AsyncStorage.setItem(STORAGE_KEY_RECENT_STOCKS, JSON.stringify(stocks));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <View style={[styles.logoCard, { backgroundColor: theme.colors.imageBackground }]}>
          <Text style={styles.symbolText}>{symbol.slice(0, 4)}</Text>
        </View>
      );
    } else {
      const cleanedSymbol = symbol.replace(/\+$/, ''); 
      return (
        <View style={[styles.logoCard, { backgroundColor: theme.colors.imageBackground }]}>
          <Image
            source={{ uri: `https://financialmodelingprep.com/image-stock/${cleanedSymbol}.png` }}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <BackArrow width={24} height={24} fill={theme.colors.text} />
        </TouchableOpacity>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      </View>
    );
  }

  if (!companyInfo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <BackArrow width={24} height={24} fill={theme.colors.text} />
        </TouchableOpacity>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={{ color: theme.colors.text }}>No data available. Try changing the API key or activate Demo mode from the Explore Screen's Menu.</Text>
        </View>
      </View>
    );
  }

  const {
    Name,
    Description,
    Address,
    MarketCapitalization,
    PEGRatio,
    TrailingPE,
    Beta,
    '52WeekHigh': WeekHigh52,
    '52WeekLow': WeekLow52,
    '50DayMovingAverage': MovingAvg50,
    '200DayMovingAverage': MovingAvg200,
    AssetType,
    Sector,
  } = companyInfo;

  const renderMetric = (label: string, value: any) => (
    <View style={styles.metricRow} key={label}>
      <Text style={[styles.metricLabel, { color: theme.colors.text }]}>{label}:</Text>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value ?? 'N/A'}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <BackArrow width={24} height={24} fill={theme.colors.text} />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        {renderImage()}
        <View style={styles.headerInfo}>
          <Text style={[styles.companyName, { color: theme.colors.text }]}>{Name ?? 'N/A'}</Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {symbol} | {AssetType ?? 'N/A'} | {Sector ?? 'N/A'}
          </Text>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <StockChart symbol={symbol} />
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Company Information</Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>{Description ?? 'No description available.'}</Text>
        <Text style={[styles.subSectionTitle, { color: theme.colors.text }]}>Address</Text>
        <Text style={[styles.address, { color: theme.colors.text }]}>{Address ?? 'No address available.'}</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Metrics</Text>
        <View style={styles.metricsContainer}>
          {renderMetric('Market Cap', MarketCapitalization)}
          {renderMetric('P/E Ratio', TrailingPE)}
          {renderMetric('P/E Growth', PEGRatio)}
          {renderMetric('Beta', Beta)}
          {renderMetric('52-Week High', WeekHigh52)}
          {renderMetric('52-Week Low', WeekLow52)}
          {renderMetric('50-Day Avg', MovingAvg50)}
          {renderMetric('200-Day Avg', MovingAvg200)}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCard: {
    borderRadius: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  address: {
    fontSize: 16,
    lineHeight: 24,
  },
  metricsContainer: {
    marginTop: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 16,
  },
  symbolText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
});

export default ProductScreen;
