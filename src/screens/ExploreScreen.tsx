// src/screens/ExploreScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg'; 
import CardItem from '../components/CardItem';
import { fetchTopGainersLosers } from '../api/stockAPI';
import { useTheme } from '../theme/ThemeProvider';
import SearchIcon from '../assets/search.svg'; 

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
  
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { top_gainers, top_losers } = await fetchTopGainersLosers();
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

  const handleCardPress = (ticker: string) => {
    navigation.navigate('Product', { symbol: "IBM" });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton} onPress={() => {/* Handle search icon press */}}>
          <SearchIcon width={24} height={24} fill={theme.colors.text}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d={theme.dark ? "M12 18a6 6 0 0 1 0-12v12z" : "M12 18a6 6 0 0 1 0-12v12z"} fill={theme.colors.text} />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'gainers' ? (
        <FlatList
          data={topGainers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item.ticker)}>
              <CardItem data={item} />
            </TouchableOpacity>
          )}
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
          keyExtractor={(item) => item.ticker}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      {/* Tab Buttons */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'gainers' && styles.activeTabButton, { backgroundColor: activeTab === 'gainers' ? theme.colors.primary : theme.colors.background }]}
          onPress={() => setActiveTab('gainers')}
        >
          <Text style={[styles.tabButtonText, { color: theme.colors.text }]}>Top Gainers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'losers' && styles.activeTabButton, { backgroundColor: activeTab === 'losers' ? theme.colors.primary : theme.colors.background }]}
          onPress={() => setActiveTab('losers')}
        >
          <Text style={[styles.tabButtonText, { color: theme.colors.text }]}>Top Losers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 70, // Adjusted for bottom tab height
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
  searchButton: {
    padding: 10,
  },
  themeToggleButton: {
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#007bff',
  },
  tabButtonText: {
    fontSize: 16,
  },
  grid: {
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default ExploreScreen;
