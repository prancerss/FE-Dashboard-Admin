import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newMerchantId, setNewMerchantId] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    price: '',
    description: '',
    image: '',
    categoryId: '',
    merchantId: ''
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('access');
      if (!accessToken) {
        setError('Authentication required. Please log in.');
        return;
      }

      const formData = new FormData();
      formData.append('productName', newProduct.productName);
      formData.append('productPrice', newProduct.price);
      formData.append('productDescription', newProduct.description);
      formData.append('image', newProduct.image);
      const categoryId = selectedCategory ? categories.find(cat => cat.categoryName === selectedCategory).id : '';
      formData.append('categoryId', categoryId);
      formData.append('merchantId', newMerchantId);

      await axios.post('https://test.klveen.com/product/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setNewProduct({
        productName: '',
        price: '',
        description: '',
        image: '',
        categoryId: '',
        merchantId: ''
      });
      setIsAddProductModalOpen(false);
      // Refresh products with the current category ID
      if (categoryId) {
        await fetchProducts(categoryId);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error adding product:', err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('access');
      if (!accessToken) {
        setError('Authentication required. Please log in.');
        return;
      }
      await axios.put(`https://test.klveen.com/category/detail?id=${editingCategory.id}`, {
        categoryName: editCategoryName,
        merchantId: newMerchantId
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setEditCategoryName('');
      await fetchCategories();
    } catch (err) {
      const errorMessage = err.response
        ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error updating category:', err);
    }
  };
  // Fixed items per page for better consistency
  const itemsPerPage = 6;
  const categoryItemsPerPage = 3;

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchProducts = async (categoryId) => {
    setProductsLoading(true);
    try {
      const accessToken = Cookies.get('access');
      if (!accessToken) {
        setError('Authentication required. Please log in.');
        return;
      }
      const response = await axios.get(`https://test.klveen.com/product/category?categoryId=${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const allProducts = response.data.data;
      const filteredProducts = categoryId
        ? allProducts.filter(product => product.categoryId === categoryId)
        : allProducts;
      setProducts(filteredProducts);
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.categoryName === selectedCategory);
      if (category) {
        fetchProducts(category.id);
      }
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      const accessToken = Cookies.get('access');
      if (!accessToken) {
        setError('Authentication required. Please log in.');
        return;
      }
      let merchantId;
      try {
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        merchantId = tokenPayload.id;
        setNewMerchantId(merchantId);
      } catch (err) {
        console.error('Error decoding access token:', err);
        return;
      }
      const response = await axios.get('https://test.klveen.com/category/getAllByMerchantId', {
        merchantId: newMerchantId,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setCategories(response.data.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category form submission
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('access');
      if (!accessToken) {
        setError('Authentication required. Please log in.');
        return;
      }
    
      await axios.post('https://test.klveen.com/category/', 
        { categoryName: newCategory,
          merchantId: newMerchantId,
         },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setNewCategory('');
      setIsModalOpen(false);
      await fetchCategories();
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : 'Network error: Unable to connect to server';
      setError(errorMessage);
      console.error('Error adding category:', err);
    }
  };
  // Filter and pagination for categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category && category.categoryName && category.categoryName.toLowerCase().includes(searchCategory.toLowerCase())
    );
  }, [categories, searchCategory]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentCategoryPage - 1) * categoryItemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + categoryItemsPerPage);
  }, [filteredCategories, currentCategoryPage, categoryItemsPerPage]);

  const totalCategoryPages = Math.ceil(filteredCategories.length / categoryItemsPerPage);

  // Filter and pagination for products
  const filteredProducts = useMemo(() => {
    const categoryFiltered = selectedCategory
      ? products.filter(product => {
          const category = categories.find(cat => cat.categoryName === selectedCategory);
          return category && product.categoryId === category.id;
        })
      : products;
    return categoryFiltered.filter(product =>
      product.productName.toLowerCase().includes(searchProduct.toLowerCase())
    );
  }, [products, selectedCategory, searchProduct, categories]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentProductPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentProductPage, itemsPerPage]);
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
            <h2 className="text-xl font-bold text-gray-900">Product Categories</h2>
            <div className="w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                value={searchCategory}
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                  setCurrentCategoryPage(1);
                }}
              />
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCategories.map((category) => (
            <div 
              key={category.id} 
              className={`bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 ${
                selectedCategory === category.categoryName ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.categoryName)}
            >
              <span className="font-medium">{category.categoryName}</span>
              <div className="flex space-x-2">
                <button onClick={(e) => {
                  e.stopPropagation();
                  setEditingCategory(category);
                  setEditCategoryName(category.categoryName);
                  setIsEditModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Category Pagination */}
        {totalCategoryPages > 1 && (
          <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => setCurrentCategoryPage(1)}
              disabled={currentCategoryPage === 1}
              className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentCategoryPage(prev => Math.max(prev - 1, 1))}
              disabled={currentCategoryPage === 1}
              className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-wrap items-center gap-1">
              {[...Array(totalCategoryPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentCategoryPage(idx + 1)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentCategoryPage === idx + 1
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentCategoryPage(prev => Math.min(prev + 1, totalCategoryPages))}
              disabled={currentCategoryPage === totalCategoryPages}
              className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentCategoryPage(totalCategoryPages)}
              disabled={currentCategoryPage === totalCategoryPages}
              className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              
              </div>
            ))}
          </div>
      </div>
      {selectedCategory && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
              <h2 className="text-xl font-bold text-gray-900">Products - {selectedCategory}</h2>
              <div className="w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  value={searchProduct}
                  onChange={(e) => {
                    setSearchProduct(e.target.value);
                    setCurrentProductPage(1);
                  }}
                />
              </div>
            </div>
            <button 
              onClick={() => setIsAddProductModalOpen(true)}
              className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="aspect-w-16 aspect-h-9 relative">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900">{product.productName}</h3>
                  <p className="text-gray-600 mb-2">Rp {product.productPrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{product.productDescription}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Pagination */}
          {totalProductPages > 1 && (
            <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
              <button
                onClick={() => setCurrentProductPage(1)}
                disabled={currentProductPage === 1}
                className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentProductPage(prev => Math.max(prev - 1, 1))}
                disabled={currentProductPage === 1}
                className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex flex-wrap items-center gap-1">
                {[...Array(totalProductPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentProductPage(idx + 1)}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      currentProductPage === idx + 1
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentProductPage(prev => Math.min(prev + 1, totalProductPages))}
                disabled={currentProductPage === totalProductPages}
                className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentProductPage(totalProductPages)}
                disabled={currentProductPage === totalProductPages}
                className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const accessToken = Cookies.get('access');
                if (!accessToken) {
                  setError('Authentication required. Please log in.');
                  return;
                }
              
                await axios.post('https://test.klveen.com/category/', 
                  { categoryName: newCategory,
                    merchantId: newMerchantId,
                   },

                  {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );
                setNewCategory('');
                setIsModalOpen(false);
                // Refresh categories and products
                const response = await axios.get(`https://test.klveen.com/category/getAllByMerchantId?merchantId=${newMerchantId}`, {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
                });
                setCategories(response.data.data);
                
                // Refresh products for the current category
                if (selectedCategory) {
                  const category = response.data.data.find(cat => cat.categoryName === selectedCategory);
                  if (category) {
                    await fetchProducts(category.id);
                  }
                }
                setError(null);
              } catch (err) {
                const errorMessage = err.response
                  ? `Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
                  : 'Network error: Unable to connect to server';
                setError(errorMessage);
                console.error('Error adding category:', err);
              }
            }}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Category</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="editCategoryName"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                    setEditCategoryName('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.files[0]})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default Product;