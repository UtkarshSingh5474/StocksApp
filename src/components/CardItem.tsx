import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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

  const formatNumber = (percentage: string) => parseFloat(percentage).toFixed(2);

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
      setLogoUrl(null); // Reset logoUrl to show default image
    }
  };

  const isPositiveChange = parseFloat(change_percentage) > 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {logoUrl ? (
        <View style={[styles.logoContainer,{backgroundColor:theme.colors.imageBackground}]}>
          <Image source={{ uri: logoUrl }} style={styles.logo} />
        </View>
      ) : (
        <View style={[styles.defaultLogoContainer,{backgroundColor:theme.colors.imageBackground}]}>
          <NoImageSVG style={styles.logo} />
          </View>
      )}
      <Text style={[styles.title, { color: theme.colors.text }]}>{ticker}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>${price}</Text>
      <Text style={[styles.subtitle, { color: isPositiveChange ? '#0abb92' : '#d55438' }]}>
        {isPositiveChange ? '+' : ''}${formatNumber(change_amount)} ({formatNumber(change_percentage)}%)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    width: 160,
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'column', // Ensures vertical alignment
  },
  logoContainer: {
    backgroundColor: 'transparent', // Ensure background color is set to avoid overlapping with the image
    borderRadius: 30,
    width: 60,
    height: 60,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultLogoContainer: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultLogoText: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default CardItem;
