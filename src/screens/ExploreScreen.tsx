import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CardItem from '../components/CardItem';
import {fetchTopGainersLosers} from '../api/stockAPI';
import {useTheme} from '../theme/ThemeProvider';
import SearchIcon from '../assets/search.svg';
import AppLogo from '../assets/appLogo.svg';
import SunSVG from '../assets/sun.svg';

interface StockItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

const ExploreScreen = () => {
  const navigation = useNavigation<any>();
  const [topGainers, setTopGainers] = useState<StockItem[]>([]);
  const [topLosers, setTopLosers] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const {theme, toggleTheme} = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {top_gainers, top_losers} = await fetchTopGainersLosers();
        setTopGainers(top_gainers);
        setTopLosers(top_losers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardPress = (
    ticker: string,
    current_price: string,
    change_amount: string,
    change_percentage: string,
  ) => {
    navigation.navigate('Product', {
      symbol: 'IBM',
      current_price,
      change_amount,
      change_percentage,
    });
  };

  const handleSearchIconPress = async () => {
    navigation.navigate('Search');
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        {/* App Logo and Name */}
        <View style={styles.appLogoContainer}>
          <AppLogo style={styles.appLogo} />
          <Text style={[styles.appName, {color: theme.colors.text}]}>
            Stocks App
          </Text>
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchIconPress}>
            <SearchIcon width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={toggleTheme}>
            <SunSVG width={30} height={30} fill={theme.colors.themeColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'gainers' ? (
        <FlatList
          data={topGainers}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                handleCardPress(
                  item.ticker,
                  item.price,
                  item.change_amount,
                  item.change_percentage,
                )
              }>
              <CardItem data={item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.ticker}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
        />
      ) : (
        <FlatList
          data={topLosers}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                handleCardPress(
                  item.ticker,
                  item.price,
                  item.change_amount,
                  item.change_percentage,
                )
              }>
              <CardItem data={item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.ticker}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
        />
      )}

      {/* Tab Buttons */}
      <View
        style={[
          styles.tabsContainer,
          styles.shadow,
          {backgroundColor: theme.colors.background},
        ]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'gainers' && styles.activeTabButton,
            {backgroundColor: theme.colors.background},
          ]}
          onPress={() => setActiveTab('gainers')}>
          <Text style={[styles.tabButtonText, {color: theme.colors.text}]}>
            Top Gainers
          </Text>
          {activeTab === 'gainers' && (
            <View style={[styles.underline, {backgroundColor: '#0abb92'}]} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'losers' && styles.activeTabButton,
            {backgroundColor: theme.colors.background},
          ]}
          onPress={() => setActiveTab('losers')}>
          <Text style={[styles.tabButtonText, {color: theme.colors.text}]}>
            Top Losers
          </Text>
          {activeTab === 'losers' && (
            <View style={[styles.underline, {backgroundColor: '#d55438'}]} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333', // Adjust color as needed
  },
  searchButton: {
    padding: 10,
  },
  themeToggleButton: {
    padding: 10,
  },
  tabsContainer: {
    margin: 6,
    borderWidth: 0.4,
    borderColor: 'gray',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderRadius: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
  activeTabButton: {},
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
  underline: {
    marginTop: 8,
    height: 6,
    width: '100%',
    borderRadius: 2,
  },
  grid: {
    paddingBottom: 60, // Adjusted to account for the height of the tab buttons
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ExploreScreen;
