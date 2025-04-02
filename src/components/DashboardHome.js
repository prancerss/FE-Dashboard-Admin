import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  // Sample data - replace with actual data from your backend
  const [salesData, setSalesData] = useState({
    todaySales: 28000000,
    todayTransactions: 85,
    monthlySales: 840000000,
    monthlyTransactions: 2550,
    yearlySales: 10080000000,
    yearlyTransactions: 30600,
    overallSales: 40320000000,
    overallTransactions: 122400
  });

  const branches = ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'];
  
  const getPeriodData = () => {
    switch(selectedPeriod) {
      case 'monthly':
        return {
          sales: salesData.monthlySales,
          transactions: salesData.monthlyTransactions,
          label: `${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
        };
      case 'yearly':
        return {
          sales: salesData.yearlySales,
          transactions: salesData.yearlyTransactions,
          label: `${new Date().getFullYear()}`
        };
      case 'overall':
        return {
          sales: salesData.overallSales,
          transactions: salesData.overallTransactions,
          label: 'Overall'
        };
      default: // daily
        return {
          sales: salesData.todaySales,
          transactions: salesData.todayTransactions,
          label: `${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
        };
    }
  };

  const currentBranchData = getPeriodData();

  const dailySalesData = {
    labels: [
      '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00',
      '20:00', '21:00'
    ],
    datasets: [{
      label: 'Hourly Sales Today',
      data: [
        1500000, 2000000, 2500000, 3000000,
        3500000, 2800000, 2200000, 2400000,
        2600000, 2300000, 2100000, 1800000,
        1200000, 900000
      ],
      fill: false,
      borderColor: '#f97316',
      tension: 0.4
    }]
  };

  const topProductsData = {
    labels: [
      'Nasi Goreng',
      'Mie Goreng',
      'Es Teh Manis',
      'Ayam Goreng',
      'Es Jeruk'
    ],
    datasets: [{
      label: 'Today\'s Product Sales',
      data: [25, 20, 18, 15, 12],
      backgroundColor: '#f97316',
      borderRadius: 5
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Sales Overview'
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Daily Product Sales'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 min-w-[300px] max-w-[1920px] mx-auto">
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Welcome to BayarCepat</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your business efficiently with our comprehensive dashboard.
            </p>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mt-2 sm:mt-2"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="overall">Overall</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6">
          <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 transform translate-x-16 -translate-y-8 bg-white/10 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-2 sm:mb-3">Today's Sales</h3>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight break-words">{formatCurrency(currentBranchData.sales)}</p>
            <div className="mt-2 sm:mt-3 text-white/80 text-xs sm:text-sm md:text-base">Sales for {currentBranchData.label}</div>
          </div>
          <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 transform translate-x-16 -translate-y-8 bg-white/10 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-2 sm:mb-3">Today's Transactions</h3>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight break-words">{currentBranchData.transactions.toLocaleString()}</p>
            <div className="mt-2 sm:mt-3 text-white/80 text-xs sm:text-sm md:text-base">Transactions for {currentBranchData.label}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm h-[250px] sm:h-[300px] lg:h-[350px]">
            <Line data={dailySalesData} options={chartOptions} />
          </div>
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Volume</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProductsData.labels.map((product, index) => {
                    const salesVolume = topProductsData.datasets[0].data[index];
                    const totalSales = topProductsData.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((salesVolume / totalSales) * 100).toFixed(1);
                    return (
                      <tr key={product} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{salesVolume.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;