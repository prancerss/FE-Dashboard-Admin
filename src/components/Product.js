import React, { useState, useMemo } from 'react';

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  
  // Fixed items per page for better consistency
  const itemsPerPage = 6;
  const categoryItemsPerPage = 3;

  const [categories] = useState([
    { id: 1, name: 'Food'},
    { id: 2, name: 'Coffee' },
    { id: 3, name: 'Snack' },
    { id: 4, name: 'Drinks' },
    { id: 5, name: 'Milk Tea' },
    { id: 6, name: 'Cinnamon' },
  ]);

  const [products] = useState([
    { 
      id: 1, 
      name: 'Nasi Goreng', 
      category: 'Food', 
      price: 25000,
      description: 'Nasi goreng spesial dengan telur, ayam, dan sayuran segar',
      image: 'https://img.kurio.network/ewrCJ9eRNpljU-80vrqWDQkN7o4=/1200x675/filters:quality(80)/https://kurio-img.kurioapps.com/20/10/10/a7e9eaa0-1c22-42b0-a11f-0a5ad1d30126.jpeg'
    },
    { 
      id: 2, 
      name: 'Mie Goreng', 
      category: 'Food', 
      price: 23000,
      description: 'Mie goreng spesial dengan telur, ayam, dan sayuran segar',
      image: 'https://www.masakapahariini.com/wp-content/uploads/2023/11/Resep-Mie-Goreng-Telur-Untuk-Tanggal-Tua-500x300.jpg'
    },
    { 
      id: 3, 
      name: 'Ayam Goreng', 
      category: 'Food', 
      price: 28000,
      description: 'Ayam goreng dengan bumbu rempah yang kuat',
      image: 'https://www.masakapahariini.com/wp-content/uploads/2023/11/Resep-Ayam-Goreng-Lalapan.jpg'
    },
    { 
      id: 4, 
      name: 'Sate Ayam', 
      category: 'Food', 
      price: 30000,
      image: 'https://asset.kompas.com/crops/MrdYDsxogO0J3wGkWCaGFWzVFxk=/0x0:1000x667/750x500/data/photo/2021/03/27/605ed24c33816.jpg'
    },
    { 
      id: 5, 
      name: 'Gado-gado', 
      category: 'Food', 
      price: 20000,
      image: 'https://asset.kompas.com/crops/UhV4tA3mOgx-gfhVMqYLgMqZG4U=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef1f58c7c5.jpg'
    },
    { 
      id: 6, 
      name: 'Soto Ayam', 
      category: 'Food', 
      price: 25000,
      image: 'https://asset.kompas.com/crops/MaWuiv-nL8W-QUYkKqwlY9Whs28=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef31b49霰.jpg'
    },
    { 
      id: 7, 
      name: 'Rendang', 
      category: 'Food', 
      price: 35000,
      image: 'https://asset.kompas.com/crops/MrdYDsxogO0J3wGkWCaGFWzVFxk=/0x0:1000x667/750x500/data/photo/2021/03/27/605ed24c33816.jpg'
    },
    { 
      id: 8, 
      name: 'Nasi Uduk', 
      category: 'Food', 
      price: 18000,
      image: 'https://asset.kompas.com/crops/UhV4tA3mOgx-gfhVMqYLgMqZG4U=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef1f58c7c5.jpg'
    },
    { 
      id: 9, 
      name: 'Bakso', 
      category: 'Food', 
      price: 22000,
      image: 'https://asset.kompas.com/crops/MaWuiv-nL8W-QUYkKqwlY9Whs28=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef31b49霰.jpg'
    },
    { 
      id: 10, 
      name: 'Mie Ayam', 
      category: 'Food', 
      price: 23000,
      image: 'https://asset.kompas.com/crops/MrdYDsxogO0J3wGkWCaGFWzVFxk=/0x0:1000x667/750x500/data/photo/2021/03/27/605ed24c33816.jpg'
    },
    { 
      id: 11, 
      name: 'Nasi Campur', 
      category: 'Food', 
      price: 27000,
      image: 'https://asset.kompas.com/crops/UhV4tA3mOgx-gfhVMqYLgMqZG4U=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef1f58c7c5.jpg'
    },
    { 
      id: 12, 
      name: 'Sop Buntut', 
      category: 'Food', 
      price: 45000,
      image: 'https://asset.kompas.com/crops/MaWuiv-nL8W-QUYkKqwlY9Whs28=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef31b49霰.jpg'
    },
    { 
      id: 13, 
      name: 'Nasi Kuning', 
      category: 'Food', 
      price: 20000,
      image: 'https://asset.kompas.com/crops/MrdYDsxogO0J3wGkWCaGFWzVFxk=/0x0:1000x667/750x500/data/photo/2021/03/27/605ed24c33816.jpg'
    },
    { 
      id: 14, 
      name: 'Pecel Lele', 
      category: 'Food', 
      price: 25000,
      image: 'https://asset.kompas.com/crops/UhV4tA3mOgx-gfhVMqYLgMqZG4U=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef1f58c7c5.jpg'
    },
    { 
      id: 15, 
      name: 'Ikan Bakar', 
      category: 'Food', 
      price: 35000,
      image: 'https://asset.kompas.com/crops/MaWuiv-nL8W-QUYkKqwlY9Whs28=/0x0:1000x667/750x500/data/photo/2021/03/27/605ef31b49霰.jpg'
    },
    { 
      id: 16, 
      name: 'Vanila Latte', 
      category: 'Coffee', 
      price: 18000,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS21Ej18UZMNmnFAUBDb02DAhR85jFkbXUKrA&s'
    },
  ]);

  // Filter and pagination for categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchCategory.toLowerCase())
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
      ? products.filter(product => product.category === selectedCategory)
      : [];
    return categoryFiltered.filter(product =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase())
    );
  }, [products, selectedCategory, searchProduct]);

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
          <button className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCategories.map((category) => (
            <div 
              key={category.id} 
              className={`bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 ${
                selectedCategory === category.name ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="font-medium">{category.name}</span>
              <div className="flex space-x-2">
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
            <button className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mb-2">Rp {product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>
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
    </div>
  );
};

export default Product;