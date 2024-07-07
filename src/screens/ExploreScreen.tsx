import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import CardItem from '../components/CardItem';
import { useTheme } from '../theme/ThemeProvider';
import SearchIcon from '../assets/search.svg';
import AppLogo from '../assets/appLogo.svg';
import SunSVG from '../assets/sun.svg';
import MenuSVG from '../assets/menu.svg';
import { clearCache, fetchWithCache } from '../services/dataService';
import apiConstants from '../utils/API';
import colors from '../constants/Colors';

interface StockItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

const ExploreScreen = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); // Hook to determine if the screen is focused
  const [topGainers, setTopGainers] = useState<StockItem[]>([]);
  const [topLosers, setTopLosers] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const { theme, toggleTheme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const { top_gainers, top_losers } = await fetchWithCache("topGainersLosers");
      setTopGainers(top_gainers);
      setTopLosers(top_losers);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handleCardPress = async (ticker: string) => {
    const currentApiKey = await apiConstants.getApiKey();
    console.log('currentApiKey:', currentApiKey);
    if (currentApiKey === 'demo' || currentApiKey === null) {
      navigation.navigate('Product', { symbol: 'IBM' });
    } else {
      navigation.navigate('Product', { symbol: ticker });
    }
  };

  const handleSearchIconPress = async () => {
    navigation.navigate('Search');
  };

  const handleCacheClearPress = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the API cache?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            clearCache();
          },
        },
      ],
      { cancelable: false }
    );
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleModalOptionPress = (option: string) => {
    if (option === 'API KEY') {
      toggleModal();
      navigation.navigate('ChangeApiKey');
    } else if (option === 'Clear API Cache') {
      toggleModal();
      handleCacheClearPress();
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header */}
      <View style={styles.header}>
        {/* App Logo and Name */}
        <View style={styles.appLogoContainer}>
          <AppLogo style={styles.appLogo} />
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            Stocks App
          </Text>
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={handleSearchIconPress}>
            <SearchIcon width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={toggleTheme}>
            <SunSVG width={30} height={30} fill={theme.colors.themeColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={toggleModal}>
            <MenuSVG width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={colors.green} />
      </View></View>
    );
  }

  const noDataMessage = (
    <View style={styles.noDataContainer}>
      <Text style={[styles.noDataText, { color: theme.colors.text }]}>
        No data available. Try changing the API key Or Activate Demo mode from the Explore menu.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        {/* App Logo and Name */}
        <View style={styles.appLogoContainer}>
          <AppLogo style={styles.appLogo} />
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            Stocks App
          </Text>
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={handleSearchIconPress}>
            <SearchIcon width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={toggleTheme}>
            <SunSVG width={30} height={30} fill={theme.colors.themeColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeToggleButton}
            onPress={toggleModal}>
            <MenuSVG width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {error || (activeTab === 'gainers' ? topGainers.length === 0 : topLosers.length === 0) ? (
        noDataMessage
      ) : activeTab === 'gainers' ? (
        <FlatList
          data={topGainers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item.ticker)}>
              <CardItem data={item} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.ticker}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      ) : (
        <FlatList
          data={topLosers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item.ticker)}>
              <CardItem data={item} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.ticker}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      {/* Tab Buttons */}
      <View style={[styles.tabsContainer, styles.shadow, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'gainers' && styles.activeTabButton, { backgroundColor: theme.colors.background }]}
          onPress={() => setActiveTab('gainers')}>
          <Text style={[styles.tabButtonText, { color: theme.colors.text }]}>
            Top Gainers
          </Text>
          {activeTab === 'gainers' && (
            <View style={[styles.underline, { backgroundColor: '#0abb92' }]} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'losers' && styles.activeTabButton, { backgroundColor: theme.colors.background }]}
          onPress={() => setActiveTab('losers')}>
          <Text style={[styles.tabButtonText, { color: theme.colors.text }]}>
            Top Losers
          </Text>
          {activeTab === 'losers' && (
            <View style={[styles.underline, { backgroundColor: '#d55438' }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={[styles.modalContainer,{backgroundColor:theme.colors.background}]}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleModalOptionPress('Clear API Cache')}>
            <Text style={[styles.modalOptionText,{color:theme.colors.text}]}>Clear API Cache</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleModalOptionPress('API KEY')}>
            <Text style={[styles.modalOptionText,{color:theme.colors.text}]}>API KEY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={toggleModal}>
            <Text style={[styles.modalOptionText,{color:theme.colors.text}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    width: 40, 
    height: 40, 
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333', 
  },
  themeToggleButton: {
    padding: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsContainer: {
    marginHorizontal: 10,
    marginVertical: 6,
    borderWidth: 0.4,
    borderColor: 'gray',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'white', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  activeTabButton: {},
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  underline: {
    marginTop: 8,
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
  grid: {
    paddingBottom: 80,
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 18,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExploreScreen;
