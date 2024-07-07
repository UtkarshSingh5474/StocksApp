import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { fetchWithCache } from '../api/dataService';
import { useTheme } from '../theme/ThemeProvider';
import colors from '../constants/Colors';

type StockChartProps = {
  symbol: string;
};

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<{ value: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState('1D');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [changePercentage, setChangePercentage] = useState<number | null>(null);
  const [maxChartValue, setMaxChartValue] = useState<number>(200); 
  useEffect(() => {
    fetchChartData(selectedInterval);
  }, [symbol, selectedInterval]);

  const fetchChartData = async (interval: string) => {
    try {
      setLoading(true);
      let data: any;
      switch (interval) {
        case '1D':
          data = await fetchWithCache('intradayTimeSeries', {
            symbol: symbol,
            interval: '5min',
          });
          if (data && data['Time Series (5min)']) {
            const intradaySeries = data['Time Series (5min)'];
            const latestTimestamp = Object.keys(intradaySeries)[0];
            setCurrentPrice(
              parseFloat(intradaySeries[latestTimestamp]['4. close']),
            );
          }
          break;
        case '1W':
        case '1M':
          data = await fetchWithCache('dailyTimeSeries', { symbol: symbol });
          break;
        case '1Y':
          data = await fetchWithCache('monthlyTimeSeries', { symbol: symbol });
          break;
        default:
          return;
      }

      if (data) {
        let timeSeries =
          data['Time Series (5min)'] ||
          data['Time Series (Daily)'] ||
          data['Monthly Adjusted Time Series'];

        if (interval !== '1D') {
          const dates = Object.keys(timeSeries);
          const latestDate = dates[0];
          setCurrentPrice(parseFloat(timeSeries[latestDate]['4. close']));
        }

        if (timeSeries) {
          const dates = Object.keys(timeSeries);
          const firstDate = dates[dates.length - 1];
          const lastDate = dates[0];
          const firstClose = parseFloat(timeSeries[firstDate]['4. close']);
          const lastClose = parseFloat(timeSeries[lastDate]['4. close']);
          setPriceChange(lastClose - firstClose);
          setChangePercentage(((lastClose - firstClose) / firstClose) * 100);
        }

        if (timeSeries) {
          let formattedData = Object.keys(timeSeries)
            .reverse()
            .map((date: string) => ({
              value: parseFloat(timeSeries[date]['4. close']),
              date: date,
            }));
          setChartData(formattedData);

          // max value
          const maxVal = Math.max(...formattedData.map(item => item.value));
          setMaxChartValue(maxVal);
        }
      }else{
        setChartData([]);
      }
    } catch (error) {
      console.error(`Error fetching ${interval} data for ${symbol}:`, error);
    } finally {
      setLoading(false);
    }
  };

  function getWidth(): number | undefined {
    const windowWidth = Dimensions.get('window').width;
    const chartContainerWidth = windowWidth - 100;
    return chartContainerWidth;
  }
  const renderIntervalButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setSelectedInterval('1D')}>
          <Text
            style={[
              styles.buttonText,
              { color: selectedInterval === '1D' ? '#0abb92' : theme.colors.text },
            ]}>
            1D
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedInterval('1W')}>
          <Text
            style={[
              styles.buttonText,
              { color: selectedInterval === '1W' ? '#0abb92' : theme.colors.text },
            ]}>
            1W
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedInterval('1M')}>
          <Text
            style={[
              styles.buttonText,
              { color: selectedInterval === '1M' ? '#0abb92' : theme.colors.text },
            ]}>
            1M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedInterval('1Y')}>
          <Text
            style={[
              styles.buttonText,
              { color: selectedInterval === '1Y' ? '#0abb92' : theme.colors.text },
            ]}>
            1Y
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} />;
  }

  if (!chartData.length) {
    return (
      <View>
        <Text style={{color:theme.colors.text}}>No data available for {symbol}</Text>
        {renderIntervalButtons()}

      </View>
    );
  }

  const priceChangeColor =
    priceChange !== null && priceChange >= 0 ? '#0abb92' : '#d55438';

  return (
    <View>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: theme.colors.text }]}>${currentPrice}</Text>
        {priceChange !== null && changePercentage !== null && (
          <Text style={[styles.change, { color: priceChangeColor }]}>
            ${priceChange.toFixed(2)} ({changePercentage.toFixed(2)}%)
          </Text>
        )}
      </View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Stock Chart</Text>

      <View style={styles.chartContainer}>
        <LineChart
          xAxisLabelTexts={chartData.map(item => getFormattedDate(item.date, selectedInterval))}
          xAxisLabelTextStyle={{ color: theme.colors.text, fontSize: 10 }}
          areaChart
          data={chartData}
          spacing={44}
          initialSpacing={0}
          color="#00ff83"
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          noOfSections={6}
          maxValue={maxChartValue}
          yAxisExtraHeight={30}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType="solid"
          rulesColor="gray"
          yAxisTextStyle={{ color: 'gray' }}
          xAxisColor="#0abb92"
          xAxisLength={getWidth()}
          rulesLength={getWidth()}
          dataPointsColor={theme.colors.text}
          scrollToEnd
          showXAxisIndices
          
          adjustToWidth
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items: {
              date: ReactNode; value: string;
            }[]) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: 'center',
                    marginTop: -30,
                    marginLeft: -80,
                  }}>
                  <Text style={{ color: theme.colors.text, fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                    {items[0].date}
                  </Text>

                  <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>
                      {'$' + items[0].value + '.0'}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
        {renderIntervalButtons()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  change: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
  },
  chartContainer: {
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: 'black',
  },
});

const getFormattedDate = (dateString: string, interval: string): string => {
  const date = new Date(dateString);
  if (interval === '1D') {
    return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
  } else {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${day}/${month}`;
  }
};

export default StockChart;
