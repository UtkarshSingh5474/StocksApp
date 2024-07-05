import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import {
  fetchDailyTimeSeries,
  fetchMonthlyTimeSeries,
  fetchIntradayTimeSeries,
} from '../api/stockAPI';

type StockChartProps = {
  symbol: string;
};

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [chartData, setChartData] = useState<{ value: number, date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState('1D');

  useEffect(() => {
    fetchChartData(selectedInterval);
  }, [symbol, selectedInterval]);

  const fetchChartData = async (interval: string) => {
    try {
      setLoading(true);
      let data: any;
      switch (interval) {
        case '1D':
          data = await fetchIntradayTimeSeries(symbol, '5min');
          break;
        case '1W':
        case '1M':
          data = await fetchDailyTimeSeries(symbol);
          break;
        case '1Y':
          data = await fetchMonthlyTimeSeries(symbol);
          break;
        default:
          return;
      }
      if (data) {
        let timeSeries = data['Time Series (5min)'] || data['Time Series (Daily)'] || data['Monthly Adjusted Time Series'];

        if (interval === '1Y') {
          // Filter and slice data for last 12 months
          const dates = Object.keys(timeSeries);
          const last12MonthsDates = dates.slice(0, 12);
          timeSeries = last12MonthsDates.reduce((acc: any, date: string) => {
            acc[date] = timeSeries[date];
            return acc;
          }, {});
        } else if (interval === '1M') {
          // Filter and slice data for last 30 days
          const dates = Object.keys(timeSeries);
          const last30DaysDates = dates.slice(0, 30);
          timeSeries = last30DaysDates.reduce((acc: any, date: string) => {
            acc[date] = timeSeries[date];
            return acc;
          }, {});
        } else {
          timeSeries = Object.keys(timeSeries).slice(0, 7).reverse().reduce((acc: any, date: string) => {
            acc[date] = timeSeries[date];
            return acc;
          }, {});
        }

        const formattedData = Object.keys(timeSeries).reverse().map((date: string) => ({
          value: parseFloat(timeSeries[date]['4. close']),
          date: date
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error(`Error fetching ${interval} data for ${symbol}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const renderIntervalButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setSelectedInterval('1D')}>
          <Text style={[styles.buttonText, { color: selectedInterval === '1D' ? '#0000ff' : '#000' }]}>1D</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedInterval('1W')}>
          <Text style={[styles.buttonText, { color: selectedInterval === '1W' ? '#0000ff' : '#000' }]}>1W</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedInterval('1M')}>
          <Text style={[styles.buttonText, { color: selectedInterval === '1M' ? '#0000ff' : '#000' }]}>1M</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedInterval('1Y')}>
          <Text style={[styles.buttonText, { color: selectedInterval === '1Y' ? '#0000ff' : '#000' }]}>1Y</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" />
    );
  }

  if (!chartData.length) {
    return (
      <View>
        {renderIntervalButtons()}
        <Text>No data available for {symbol}</Text>
      </View>
    );
  }

  return (
    <View>
      {renderIntervalButtons()}
      <View style={styles.chartContainer}>

      <LineChart
          
          data={chartData}
          rotateLabel
          width={300}
          hideDataPoints
          spacing={44}
          initialSpacing={0}
          color="#00ff83"
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          noOfSections={6}
          maxValue={200}
          yAxisExtraHeight={30}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType="solid"
          rulesColor="gray"
          yAxisTextStyle={{color: 'gray'}}
          // yAxisSide='right'
          xAxisColor="lightgray"
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
                    marginLeft: -40,
                  }}>
                  <Text style={{color: 'black', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                    {items[0].date}
                  </Text>
  
                  <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                    <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                      {'$' + items[0].value + '.0'}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        /></View>
    </View>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 16,
    },
    chartContainer: {
      marginTop: 20,
      paddingHorizontal: 10,
    },
  });

export default StockChart;
