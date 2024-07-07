import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import BackArrow from '../assets/back-arrow.svg';
import SearchItem from '../components/SearchItem'; 
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTickerSearch } from '../services/stockAPI';

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedChip, setSelectedChip] = useState('All');
  const [recentlyVisitedStocks, setRecentlyVisitedStocks] = useState<any[]>([]);
  const [originalSearchData, setOriginalSearchData] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRecentlyVisitedStocks = async () => {
      try {
        const stocksString = await AsyncStorage.getItem(
          '@recentlyVisitedStocks',
        );
        if (stocksString) {
          const stocks = JSON.parse(stocksString);
          console.log('Recently visited stocks:', stocks);
          setRecentlyVisitedStocks(stocks.slice(0, 5));
          setOriginalSearchData(stocks.slice(0, 5));
          setFilteredList(stocks.slice(0, 5)); 
        } else {
          setRecentlyVisitedStocks([]);
          setOriginalSearchData([]);
          setFilteredList([]);
        }
      } catch (error) {
        console.error('Error fetching recently visited stocks:', error);
      }
    };

    fetchRecentlyVisitedStocks();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filteredData = [...originalSearchData];
      switch (selectedChip) {
        case 'All':
          break;
        case 'Stocks':
          filteredData = filteredData.filter(
            (item) => item.assetType === 'Equity'
          );
          break;
        case 'ETFs':
          filteredData = filteredData.filter(
            (item) => item.assetType === 'ETF'
          );
          break;
        case 'Mutual Funds':
          filteredData = filteredData.filter(
            (item) => item.assetType === 'Mutual Fund'
          );
          break;
        default:
          break;
      }
      setFilteredList(filteredData);
    };

    filterData();
  }, [originalSearchData, selectedChip]);

  const handleChipPress = (chip: string) => {
    setSelectedChip(chip);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearch = useCallback(
    async (keyword: string) => {
      setQuery(keyword);
      if (keyword === '') {
        console.log('Search query is empty. Displaying recently visited stocks.');
        return;
      }
      try {
        const response = await fetchTickerSearch(keyword);
        if (response.bestMatches) {
          const results = response.bestMatches.map((match: any) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            assetType: match['3. type'],
          }));
          setOriginalSearchData(results);
          setFilteredList(results);
        } else {
          setOriginalSearchData([]);
          setFilteredList([]);
        }
      } catch (error) {
        console.error('Error searching:', error);
      }
    },
    [recentlyVisitedStocks]
  );

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);

  useEffect(() => {
    debouncedHandleSearch(query);
  }, [query, debouncedHandleSearch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <BackArrow width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search..."
            placeholderTextColor={theme.colors.text}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <View style={styles.chipGroup}>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'All' && styles.chipSelected]}
            onPress={() => handleChipPress('All')}
            activeOpacity={0.7}>
            <Text style={[styles.chipText, selectedChip === 'All' && styles.chipTextSelected, { color: theme.colors.text }]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'Stocks' && styles.chipSelected]}
            onPress={() => handleChipPress('Stocks')}
            activeOpacity={0.7}>
            <Text style={[styles.chipText, selectedChip === 'Stocks' && styles.chipTextSelected, { color: theme.colors.text }]}>
              Stocks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'ETFs' && styles.chipSelected]}
            onPress={() => handleChipPress('ETFs')}
            activeOpacity={0.7}>
            <Text style={[styles.chipText, selectedChip === 'ETFs' && styles.chipTextSelected, { color: theme.colors.text }]}>
              ETFs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'Mutual Funds' && styles.chipSelected]}
            onPress={() => handleChipPress('Mutual Funds')}
            activeOpacity={0.7}>
            <Text style={[styles.chipText, selectedChip === 'Mutual Funds' && styles.chipTextSelected, { color: theme.colors.text }]}>
              Mutual Funds
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {filteredList.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, { color: theme.colors.text }]}>
            No Matching Results
          </Text>
        </View>
      )}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <SearchItem
            item={item}
            isRecentlyVisited={recentlyVisitedStocks.some((stock) => stock.symbol === item.symbol)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    margin: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: 'lightgray',
  },
  backButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  chipGroup: {
    flexDirection: 'row',
    marginTop: 24,
    alignSelf: 'flex-start',
  },
  chip: {
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 26,
    marginRight: 10,
  },
  chipSelected: {
    borderColor: '#0abb92',
    borderWidth: 1,
    borderRadius: 26,
    backgroundColor: 'rgba(10, 189, 147, 0.45)',
  },
  chipText: {
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SearchScreen;
