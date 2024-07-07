import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

interface CardItemProps {
  data: {
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  };
}

const CardItem: React.FC<CardItemProps> = ({ data }) => {
  const { ticker, price, change_amount, change_percentage } = data;
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/image-stock/${ticker}.png`);
      if (response.ok) {
        setLogoUrl(`https://financialmodelingprep.com/image-stock/${ticker}.png`);
      } else {
        setLogoUrl(null); 
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      setLogoUrl(null);
    }
  };

  const isPositiveChange = parseFloat(change_percentage) > 0;

  const generateRandomGradient = () => {
    const colors = [
      '#FF6A00',
      '#EE0979',
      '#FFB7B2',
      '#B2FEFA',
      '#B39DDB',
      '#7A5C61',
      '#6A0572',
      '#4B0082',
    ]; 
    const randomIndex = Math.floor(Math.random() * colors.length);
    return [colors[randomIndex], colors[randomIndex]];
  };

  const PlaceholderView = (
    <LinearGradient
      colors={generateRandomGradient()}
      style={styles.defaultLogoContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.defaultLogoText, { color: theme.colors.text }]} numberOfLines={2} ellipsizeMode="tail">
        {ticker.substring(0, 4).toUpperCase()}
      </Text>
    </LinearGradient>
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {logoUrl ? (
        <FastImage
          style={styles.logo}
          source={{ uri: logoUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        PlaceholderView
      )}
      <Text style={[styles.title, { color: theme.colors.text }]}>{ticker}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>${price}</Text>
      <Text style={[styles.subtitle, { color: isPositiveChange ? '#0abb92' : '#d55438' }]}>
        {isPositiveChange ? '+' : ''}${parseFloat(change_amount).toFixed(2)} ({parseFloat(change_percentage).toFixed(2)}%)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 10,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'column',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  defaultLogoContainer: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultLogoText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CardItem;
