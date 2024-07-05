import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import StockChart from '../components/StockChart';
import { fetchCompanyOverview } from '../api/stockAPI';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

type Props = {
  route: ProductScreenRouteProp;
};

const ProductScreen: React.FC<Props> = ({ route }) => {
  const { symbol } = route.params;
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    fetchCompanyData(symbol);
  }, [symbol]);

  const fetchCompanyData = async (symbol: string) => {
    const data = await fetchCompanyOverview(symbol);
    setCompanyInfo(data);
  };

  if (!companyInfo) {
    return null; // You might want to show a loading indicator here
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

  // Placeholder values for currentPrice and priceChange
  const currentPrice = 100; // Replace with actual logic to fetch price
  const priceChange = 5; // Replace with actual logic to fetch change

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo and Chips */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCard}>
          <Image
            source={{
              uri: `https://financialmodelingprep.com/image-stock/${symbol}.png`,
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.chipsContainer}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Symbol: {symbol}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Type: {AssetType}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Sector: {Sector}</Text>
          </View>
        </View>
      </View>

      {/* Stock Price with Change */}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${currentPrice}</Text>
        <Text style={[styles.change, { color: priceChange >= 0 ? 'green' : 'red' }]}>
          {priceChange >= 0 ? `+${priceChange}` : `${priceChange}`}
        </Text>
      </View>

      {/* Stock Chart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stock Chart</Text>
        <StockChart symbol={symbol} />
      </View>

      {/* Company Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <Text>{Description}</Text>
        <Text style={styles.address}>{Address}</Text>
      </View>

      {/* Stock Metrics */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stock Metrics</Text>
        <View style={styles.metricsContainer}>
          <Text style={styles.metric}>Market Cap: {MarketCapitalization}</Text>
          <Text style={styles.metric}>P/E Ratio: {TrailingPE}</Text>
          <Text style={styles.metric}>P/E Growth Ratio: {PEGRatio}</Text>
          <Text style={styles.metric}>Beta: {Beta}</Text>
          <Text style={styles.metric}>52-Week High: {WeekHigh52}</Text>
          <Text style={styles.metric}>52-Week Low: {WeekLow52}</Text>
          <Text style={styles.metric}>50-Day Moving Avg: {MovingAvg50}</Text>
          <Text style={styles.metric}>200-Day Moving Avg: {MovingAvg200}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCard: {
    backgroundColor: '#C0C0C0',
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
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  chipText: {
    fontSize: 12,
    color: '#333333',
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
    backgroundColor: '#ffffff',
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
    color: '#333333',
  },
  address: {
    marginTop: 10,
    color: '#666666',
  },
  metricsContainer: {
    marginTop: 10,
  },
  metric: {
    marginBottom: 5,
    color: '#666666',
  },
});

export default ProductScreen;
