import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import RecentlyVisitedIcon from '../assets/history.svg';
import TrendUpIcon from '../assets/trend-up.svg'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';


interface Props {
  item: any;
  isRecentlyVisited?: boolean;
}

const SearchItem: React.FC<Props> = ({ item, isRecentlyVisited = false }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handleSearchItemPress = () => {
    navigation.navigate('Product', { symbol: "IBM" });
  };

  return (
    <TouchableOpacity onPress={handleSearchItemPress}>
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        {isRecentlyVisited ? <RecentlyVisitedIcon width={20} height={20} /> : <TrendUpIcon width={20} height={20} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.tickerSymbol, { color: theme.colors.text }]}>{item.symbol}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.assetType}>{item.assetType}</Text>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', 
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  tickerSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: 'gray',
  },
  assetType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0abb92', // Example color for asset type
  },
});

export default SearchItem;
