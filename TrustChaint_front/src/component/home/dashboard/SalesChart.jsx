import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          data: [12000, 19000, 17000, 22000, 20000, 25000],
          backgroundColor: 'rgba(245, 158, 11, 0.8)',  // amber
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1,
          borderRadius: 6,
          maxBarThickness: 40,
        },
        {
          label: 'Revenue',
          data: [15000, 22000, 19500, 25000, 23000, 28000],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',  // blue
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 6,
          maxBarThickness: 40,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          padding: 12,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          displayColors: false,
          callbacks: {
            label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { borderDash: [3, 3] },
          ticks: {
            callback: (value) => '$' + value.toLocaleString(),
          },
          beginAtZero: true,
        },
      },
      animation: { duration: 1000, easing: 'easeOutQuart' },
    });
  }, []);

  return (
    <div className="w-100 mb-4" style={{ height: '300px' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default SalesChart;
