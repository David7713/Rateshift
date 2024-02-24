import React, { useContext, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import CurrencyContext from './CurrencyContext';
import '../src/Styles/CurrencyChart.css';

const CurrencyChart = ({ matchedTransactions }) => {
  const { leftCurrency, rightCurrency } = useContext(CurrencyContext);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Ref to hold the Chart instance

  useEffect(() => {
    const exchangeRates = {
      'usd-rub': { purchase: 91, sell: 91.6399 },
      'rub-usd': { purchase: 1 / 91, sell: 1 / 91.6399 },
      'usd-amd': { purchase: 405, sell: 402 },
      'amd-usd': { purchase: 1 / 405, sell: 1 / 402 },
      'usd-gel': { purchase: 2.66, sell: 2.36 },
      'gel-usd': { purchase: 1 / 2.66, sell: 1 / 2.36 },
      'rub-amd': { purchase: 0.22, sell: 0.19 },
      'amd-rub': { purchase: 1 / 0.22, sell: 1 / 0.19 },
      'rub-gel': { purchase: 0.029, sell: 0.026 },
      'gel-rub': { purchase: 1 / 0.029, sell: 1 / 0.026 },
      'amd-gel': { purchase: 0.0066, sell: 0.0063 },
      'gel-amd': { purchase: 1 / 0.0066, sell: 1 / 0.0063 },
    };

    const generateChartData = () => {
      const chartData = {
        labels: Array.from({ length: 100 }, (_, i) => (i + 1).toString()), // Generating labels from 1 to 100
        datasets: [
          {
            label: 'Покупка',
            data: generateRandomData('purchase'),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            type: 'line',
          },
          {
            label: 'Продажа',
            data: generateRandomData('sell'),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            type: 'line',
          },
        ],
      };

      // Update the chartData based on matchedTransactions
      matchedTransactions.forEach(transaction => {
        const datasetIndex = transaction.type === 'Purchase' ? 0 : 1; // Find the index of the dataset based on the type
        const data = chartData.datasets[datasetIndex].data;
        const lastIndex = data.length - 1;
        if (lastIndex >= 0) {
          // Update the last value of the dataset
          data[lastIndex] = transaction.price;
        }
      });

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Destroy the previous Chart instance
      }

      if (chartRef && chartRef.current) {
        chartInstanceRef.current = new Chart(chartRef.current, {
          type: 'bar',
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    };

    const generateRandomData = (rateType) => {
      const exchangeRate = exchangeRates[`${leftCurrency}-${rightCurrency}`];
      if (!exchangeRate) return []; // Check if exchange rate is undefined
      const rate = exchangeRate[rateType];
      if (typeof rate === 'undefined') return []; // Check if the rateType is undefined
      const randomData = Array.from({ length: 100 }, () => {
        return rate + (Math.random() - 0.5) * rate * 0.1; // Adding slight variation
      });
      return randomData;
    };

    generateChartData();
  }, [leftCurrency, rightCurrency, matchedTransactions]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

export default CurrencyChart;
