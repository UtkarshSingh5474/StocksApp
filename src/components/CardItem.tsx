import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const formatPercentage = (percentage: string) => parseFloat(percentage).toFixed(2);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/image-stock/${ticker}.png`);
      if (response.ok) {
        setLogoUrl(`https://financialmodelingprep.com/image-stock/${ticker}.png`);
      } else {
        setLogoUrl(require('../assets/no-image.png'));
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      setLogoUrl(require('../assets/no-image.png'));
    }
  };

  const isPositiveChange = parseFloat(change_percentage) > 0;

  return (
    <View style={styles.card}>
      {logoUrl && <Image source={typeof logoUrl === 'string' ? { uri: logoUrl } : logoUrl} style={styles.logo} />}
      <Text style={styles.title}>{ticker}</Text>
      <Text style={styles.subtitle}>${price}</Text>
      <Text style={[styles.subtitle, { color: isPositiveChange ? 'green' : 'red' }]}>
        ${change_amount} ({formatPercentage(change_percentage)}%)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    width: 160,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 30,
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
