import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // Sample data - replace with actual data from your backend
  const salesData = [
    {
      id: 1,
      date: '2024-01-20 14:30:25',
      invoiceNumber: 'INV-2024-001',
      totalAmount: 150000,
      status: 'Success',
      branchName: 'Jakarta Pusat',
      paymentMethod: 'Cash',
      items: [
        { name: 'Product A', quantity: 2, price: 50000 },
        { name: 'Product B', quantity: 1, price: 50000 }
      ]
    },
    {
      id: 2,
      date: '2024-01-21 09:15:30',
      invoiceNumber: 'INV-2024-002',
      totalAmount: 300000,
      status: 'Success',
      branchName: 'Jakarta Selatan',
      paymentMethod: 'QRIS',
      items: [
        { name: 'Product C', quantity: 2, price: 150000 }
      ]
    },
    {
      id: 3,
      date: '2024-01-21 11:45:12',
      invoiceNumber: 'INV-2024-003',
      totalAmount: 175000,
      status: 'Pending',
      branchName: 'Jakarta Barat',
      paymentMethod: 'Credit Card',
      items: [
        { name: 'Product D', quantity: 1, price: 175000 }
      ]
    },
    {
      id: 4,
      date: '2024-01-22 13:20:45',
      invoiceNumber: 'INV-2024-004',
      totalAmount: 450000,
      status: 'Success',
      branchName: 'Jakarta Timur',
      paymentMethod: 'Debit Card',
      items: [
        { name: 'Product E', quantity: 3, price: 150000 }
      ]
    },
    {
      id: 5,
      date: '2024-01-22 15:30:18',
      invoiceNumber: 'INV-2024-005',
      totalAmount: 225000,
      status: 'Canceled',
      branchName: 'Jakarta Utara',
      paymentMethod: 'Cash',
      items: [
        { name: 'Product A', quantity: 3, price: 75000 }
      ]
    },
    {
      id: 6,
      date: '2024-01-23 10:05:33',
      invoiceNumber: 'INV-2024-006',
      totalAmount: 500000,
      status: 'Success',
      branchName: 'Jakarta Pusat',
      paymentMethod: 'QRIS',
      items: [
        { name: 'Product B', quantity: 4, price: 125000 }
      ]
    },
    {
      id: 7,
      date: '2024-01-23 14:25:50',
      invoiceNumber: 'INV-2024-007',
      totalAmount: 350000,
      status: 'Success',
      branchName: 'Jakarta Selatan',
      paymentMethod: 'Credit Card',
      items: [
        { name: 'Product C', quantity: 2, price: 175000 }
      ]
    },
    {
      id: 8,
      date: '2024-01-24 09:40:15',
      invoiceNumber: 'INV-2024-008',
      totalAmount: 275000,
      status: 'Pending',
      branchName: 'Jakarta Barat',
      paymentMethod: 'Debit Card',
      items: [
        { name: 'Product D', quantity: 1, price: 275000 }
      ]
    },
    {
      id: 9,
      date: '2024-01-24 11:55:28',
      invoiceNumber: 'INV-2024-009',
      totalAmount: 600000,
      status: 'Success',
      branchName: 'Jakarta Timur',
      paymentMethod: 'Cash',
      items: [
        { name: 'Product E', quantity: 4, price: 150000 }
      ]
    },
    {
      id: 10,
      date: '2024-01-25 13:10:42',
      invoiceNumber: 'INV-2024-010',
      totalAmount: 200000,
      status: 'Canceled',
      branchName: 'Jakarta Utara',
      paymentMethod: 'QRIS',
      items: [
        { name: 'Product A', quantity: 2, price: 100000 }
      ]
    },
    {
      id: 11,
      date: '2024-01-25 16:30:55',
      invoiceNumber: 'INV-2024-011',
      totalAmount: 450000,
      status: 'Success',
      branchName: 'Jakarta Pusat',
      paymentMethod: 'Credit Card',
      items: [
        { name: 'Product B', quantity: 3, price: 150000 }
      ]
    },
    {
      id: 12,
      date: '2024-01-26 10:45:20',
      invoiceNumber: 'INV-2024-012',
      totalAmount: 325000,
      status: 'Success',
      branchName: 'Jakarta Selatan',
      paymentMethod: 'Debit Card',
      items: [
        { name: 'Product C', quantity: 1, price: 325000 }
      ]
    },
    {
      id: 13,
      date: '2024-01-26 14:15:33',
      invoiceNumber: 'INV-2024-013',
      totalAmount: 550000,
      status: 'Pending',
      branchName: 'Jakarta Barat',
      paymentMethod: 'Cash',
      items: [
        { name: 'Product D', quantity: 2, price: 275000 }
      ]
    },
    {
      id: 14,
      date: '2024-01-27 09:30:48',
      invoiceNumber: 'INV-2024-014',
      totalAmount: 400000,
      status: 'Success',
      branchName: 'Jakarta Timur',
      paymentMethod: 'QRIS',
      items: [
        { name: 'Product E', quantity: 2, price: 200000 }
      ]
    },
    {
      id: 15,
      date: '2024-01-27 11:50:15',
      invoiceNumber: 'INV-2024-015',
      totalAmount: 175000,
      status: 'Canceled',
      branchName: 'Jakarta Utara',
      paymentMethod: 'Credit Card',
      items: [
        { name: 'Product A', quantity: 1, price: 175000 }
      ]
    },
    {
      id: 16,
      date: '2024-01-28 13:25:30',
      invoiceNumber: 'INV-2024-016',
      totalAmount: 625000,
      status: 'Success',
      branchName: 'Jakarta Pusat',
      paymentMethod: 'Debit Card',
      items: [
        { name: 'Product B', quantity: 5, price: 125000 }
      ]
    },
    {
      id: 17,
      date: '2024-01-28 15:40:45',
      invoiceNumber: 'INV-2024-017',
      totalAmount: 300000,
      status: 'Success',
      branchName: 'Jakarta Selatan',
      paymentMethod: 'Cash',
      items: [
        { name: 'Product C', quantity: 2, price: 150000 }
      ]
    },
    {
      id: 18,
      date: '2024-01-29 10:15:22',
      invoiceNumber: 'INV-2024-018',
      totalAmount: 475000,
      status: 'Pending',
      branchName: 'Jakarta Barat',
      paymentMethod: 'QRIS',
      items: [
        { name: 'Product D', quantity: 1, price: 475000 }
      ]
    },
    {
      id: 19,
      date: '2024-01-29 14:35:40',
      invoiceNumber: 'INV-2024-019',
      totalAmount: 350000,
      status: 'Success',
      branchName: 'Jakarta Timur',
      paymentMethod: 'Credit Card',
      items: [
        { name: 'Product E', quantity: 2, price: 175000 }
      ]
    },
    {
      id: 20,
      date: '2024-01-30 11:20:55',
      invoiceNumber: 'INV-2024-020',
      totalAmount: 250000,
      status: 'Success',
      branchName: 'Jakarta Utara',
      paymentMethod: 'Debit Card',
      items: [
        { name: 'Product A', quantity: 2, price: 125000 }
      ]
    }
  ];

  const uniqueStatuses = [...new Set(salesData.map(sale => sale.status))].sort();
  const uniqueBranches = [...new Set(salesData.map(sale => sale.branchName))].sort();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredSalesData = salesData.filter(sale => {
    const saleDate = new Date(sale.date);
    const matchesDate = (!startDate || saleDate >= startDate) &&
                       (!endDate || saleDate <= endDate);
    const matchesBranch = !selectedBranch || sale.branchName === selectedBranch;
    const matchesStatus = !selectedStatus || sale.status === selectedStatus;
    return matchesDate && matchesBranch && matchesStatus;
  });

  const formatDateRange = () => {
    if (!startDate && !endDate) return '';
    const formatDate = (date) => {
      return date ? date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '';
    };
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return formatDate(startDate || endDate);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Sales Report', 20, 20);
    
    // Add date range if selected
    const dateRange = formatDateRange();
    if (dateRange) {
      doc.setFontSize(12);
      doc.text(`Period: ${dateRange}`, 20, 30);
    }

    // Table configuration
    const startY = 40;
    const headers = ['Date', 'Invoice', 'Branch', 'Amount', 'Payment', 'Status'];
    const columnWidths = [30, 30, 40, 30, 30, 25];
    const rowHeight = 10;
    const startX = 15;
    let currentY = startY;

    // Draw table headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    // Draw header cells
    let currentX = startX;
    headers.forEach((header, i) => {
      doc.rect(currentX, currentY, columnWidths[i], rowHeight);
      doc.text(header, currentX + 2, currentY + 7);
      currentX += columnWidths[i];
    });

    currentY += rowHeight;
    doc.setFont('helvetica', 'normal');

    // Draw table content
    filteredSalesData.forEach((sale) => {
      if (currentY >= 240) { // Adjusted to leave space for product details
        doc.addPage();
        currentY = 20;
      }

      currentX = startX;
      const rowData = [
        sale.date.split(' ')[0],
        sale.invoiceNumber,
        sale.branchName,
        new Intl.NumberFormat('id-ID').format(sale.totalAmount),
        sale.paymentMethod,
        sale.status
      ];

      rowData.forEach((text, i) => {
        doc.rect(currentX, currentY, columnWidths[i], rowHeight);
        doc.text(text.toString(), currentX + 2, currentY + 7);
        currentX += columnWidths[i];
      });

      currentY += rowHeight;

      // Add product details
      if (sale.items && sale.items.length > 0) {
        currentY += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(`Products (${sale.invoiceNumber}):`, startX, currentY);
        doc.setFont('helvetica', 'normal');
        currentY += 7;

        sale.items.forEach((item) => {
          if (currentY >= 270) {
            doc.addPage();
            currentY = 20;
          }
          const itemText = `${item.name} - ${item.quantity}x @ ${formatCurrency(item.price)} = ${formatCurrency(item.quantity * item.price)}`;
          doc.text(itemText, startX + 5, currentY);
          currentY += 7;
        });
        currentY += 5;
      }
    });

    doc.save('sales-report.pdf');
  };

  const exportToExcel = () => {
    // Create a combined data array for the single sheet
    const combinedData = [];
    
    filteredSalesData.forEach(sale => {
      // For each sale, create one row per product
      sale.items.forEach(item => {
        combinedData.push({
          'Date': sale.date,
          'Invoice Number': sale.invoiceNumber,
          'Branch Name': sale.branchName,
          'Payment Method': sale.paymentMethod,
          'Status': sale.status,
          'Product Name': item.name,
          'Quantity': item.quantity,
          'Unit Price': item.price,
          'Product Total': item.quantity * item.price,
          'Transaction Total': sale.totalAmount
        });
      });
    });

    // Create worksheet from combined data
    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Sales Report</h2>
        
        {/* Search Section - Responsive Grid */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholderText="Select start date"
              />
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setSelectedStatus('');
                  setSelectedBranch('');
                }}
                className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholderText="Select end date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Branches</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Export Buttons - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={exportToPDF}
            className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Export to PDF
          </button>
          <button
            onClick={exportToExcel}
            className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Export to Excel
          </button>
        </div>
        
        {/* Responsive Table */}
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">Date</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSalesData.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{sale.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{sale.invoiceNumber}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{sale.branchName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{formatCurrency(sale.totalAmount)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleViewDetails(sale)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Invoice: {selectedOrder.invoiceNumber}</p>
                <p className="text-sm text-gray-500 mb-2">Branch: {selectedOrder.branchName}</p>
                <p className="text-sm text-gray-500 mb-2">Date: {selectedOrder.date}</p>
                <p className="text-sm text-gray-500 mb-2">Status: {selectedOrder.status}</p>
                <p className="text-sm text-gray-500 mb-4">Payment with: {selectedOrder.paymentMethod}</p>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Items:</h4>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-sm text-gray-600">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-900">
                    Total: {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;