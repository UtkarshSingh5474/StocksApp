import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchItem = ({ item }:any) => {
  return (
    <View style={styles.itemContainer}>
      {/* Rounded Icon (Assuming you have an icon component or image here) */}
      <View style={styles.icon}></View>
      {/* Ticker Symbol and Name */}
      <View style={styles.textContainer}>
        <Text style={styles.tickerSymbol}>{item.tickerSymbol}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      {/* Asset Type */}
      <Text style={styles.assetType}>{item.assetType}</Text>
    </View>
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
    backgroundColor: '#ccc', // Placeholder for icon background color
    marginRight: 12,
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
