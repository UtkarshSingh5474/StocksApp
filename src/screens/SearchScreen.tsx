import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BackArrow from '../assets/back-arrow.svg';
import SearchItem from '../components/SearchItem'; // Import your custom ListItem component
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedChip, setSelectedChip] = useState('All');
  const [recentlyVisitedStocks, setRecentlyVisitedStocks] = useState<any[]>([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchRecentlyVisitedStocks = async () => {
      try {
        const stocksString = await AsyncStorage.getItem('@recentlyVisitedStocks');
        if (stocksString) {
          const stocks = JSON.parse(stocksString);
          setRecentlyVisitedStocks(stocks);
        }
      } catch (error) {
        console.error('Error fetching recently visited stocks:', error);
      }
    };

    fetchRecentlyVisitedStocks();
  }, []);

  const handleChipPress = (chip: React.SetStateAction<string>) => {
    setSelectedChip(chip);
    // Handle any further actions based on selected chip
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => handleBackPress()}>
            <BackArrow width={30} height={30} fill={theme.colors.text} />
          </TouchableOpacity>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search..."
            placeholderTextColor={theme.colors.text}
          />
        </View>
        <View style={styles.chipGroup}>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'All' && styles.chipSelected]}
            onPress={() => handleChipPress('All')}
            activeOpacity={0.7}>
            <Text
              style={[
                { color: theme.colors.text },
                styles.chipText,
                selectedChip === 'All' && styles.chipTextSelected,
              ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              selectedChip === 'Stocks' && styles.chipSelected,
            ]}
            onPress={() => handleChipPress('Stocks')}
            activeOpacity={0.7}>
            <Text
              style={[
                { color: theme.colors.text },
                styles.chipText,
                selectedChip === 'Stocks' && styles.chipTextSelected,
              ]}>
              Stocks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              selectedChip === 'ETFs' && styles.chipSelected,
            ]}
            onPress={() => handleChipPress('ETFs')}
            activeOpacity={0.7}>
            <Text
              style={[
                { color: theme.colors.text },
                styles.chipText,
                selectedChip === 'ETFs' && styles.chipTextSelected,
              ]}>
              ETFs
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={recentlyVisitedStocks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SearchItem item={item} />}
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
  backButtonText: {
    fontSize: 16,
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
    marginRight: 10, // Add space between chips
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
    color: '#fff', // Example of selected chip text color
  },
});

export default SearchScreen;
