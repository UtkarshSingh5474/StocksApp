import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../theme/ThemeProvider';
import NoImageSVG from '../assets/no-image.svg';

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
        setLogoUrl(null); // Reset logoUrl to show default image
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      setLogoUrl(null);
    }
  };

  const isPositiveChange = parseFloat(change_percentage) > 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {logoUrl ? (
        <FastImage
          style={styles.logo}
          source={{ uri: logoUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View style={[styles.defaultLogoContainer, { backgroundColor: theme.colors.imageBackground }]}>
          <NoImageSVG style={styles.defaultLogo} fill={theme.colors.text} />
        </View>
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
  defaultLogo: {
    width: 40,
    height: 40,
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
