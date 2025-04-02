import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Cashier = () => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCashiers();
  }, []);

  const fetchCashiers = async () => {
    try {
      const response = await axios.get('https://test.klveen.com/cashier');
      setCashiers(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}` : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error fetching cashiers:', err);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCashier, setCurrentCashier] = useState(null);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    branchCashier: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCashier = () => {
    setCurrentCashier(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      branchCashier: '',
      merchantId: 1
    });
    setIsModalOpen(true);
  };

  const handleEditCashier = (cashier) => {
    setCurrentCashier(cashier);
    setFormData({
      name: cashier.name,
      password: cashier.password,
      email: cashier.email,
      phone: cashier.phone,
      branchCashier: cashier.branchCashier
    });
    setIsModalOpen(true);
  };

  const handleDeleteCashier = async (id) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      setLoading(true);
      try {
        await axios.put(`https://test.klveen.com/cashier/softDelete/detail?id=${id}`);
        // Update local state immediately after successful deletion
        setCashiers(prevCashiers => prevCashiers.filter(cashier => cashier.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete cashier');
        console.error('Error deleting cashier:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentCashier) {
        // Edit existing cashier
        const response = await axios.put(`https://test.klveen.com/cashier/detail/?id=${currentCashier.id}`, formData);
        console.log('Update response:', response.data);
      } else {
        // Add new cashier
        const response = await axios.post('https://test.klveen.com/cashier/create', formData);
        console.log('Create response:', response.data);
      }
      await fetchCashiers();
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error saving cashier:', {
        error: err,
        response: err.response?.data,
        formData: formData
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Cashier Management</h2>
          <button
            onClick={handleAddCashier}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            Add New Cashier
          </button>
        </div>

        {/* Responsive Table */}
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Branch</th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cashiers.map((cashier) => (
                    <tr key={cashier.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{cashier.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                        <div className="flex items-center">
                          <span>{showPasswordMap[cashier.id] ? cashier.password : '••••••'}</span>
                          <button
                            onClick={() => setShowPasswordMap(prev => ({
                              ...prev,
                              [cashier.id]: !prev[cashier.id]
                            }))}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswordMap[cashier.id] ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">{cashier.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">{cashier.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">{cashier.branchCashier}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEditCashier(cashier)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCashier(cashier.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Responsive Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                    {currentCashier ? 'Edit Cashier' : 'Add New Cashier'}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Branch Cashier</label>
                      <input
                        type="text"
                        name="branchCashier"
                        value={formData.branchCashier}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        {currentCashier ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cashier;