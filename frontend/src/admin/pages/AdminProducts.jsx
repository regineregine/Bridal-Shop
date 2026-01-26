import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await adminApi.get('/products', { params });
      setProducts(response.data);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminApi.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/img/p-1.webp';
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
      return imageName;
    }
    if (imageName.startsWith('products/')) {
      return `/storage/${imageName}`;
    }
    return `/img/${imageName}`;
  };

  // Mobile card component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-hidden">
      <div className="flex gap-4">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-20 h-20 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 truncate mt-0.5">
            {product.material}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-medium capitalize whitespace-nowrap">
              {product.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                product.stock > 10
                  ? 'bg-green-100 text-green-700'
                  : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {product.stock} in stock
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="font-semibold text-slate-900">
          ₱{Number(product.price).toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-11 min-h-11 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9a2 2 0 112 2 2 2 0 01-2-2z"
              />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(product.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-11 min-h-11 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">
              Products
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage your product inventory
            </p>
          </div>
          <Link
            to="/admin/products/add"
            className="bg-pink-500 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 min-h-11"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Filter Products</h3>
              <p className="text-sm text-slate-600">Filter products by category to manage your inventory</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Products', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
                { value: 'dresses', label: 'Dresses', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
                { value: 'robes', label: 'Robes', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
                { value: 'veils', label: 'Veils', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
                { value: 'accessories', label: 'Accessories', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-pink-500 text-white shadow-md'
                      : category.color
                  }`}
                >
                  {category.label}
                  {selectedCategory === category.value && (
                    <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="flex items-center justify-between">
              <p className="text-slate-600 text-sm">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && (
                  <span className="font-medium text-pink-600 ml-1">
                    in {selectedCategory}
                  </span>
                )}
              </p>
            </div>

            {/* Mobile: Card layout */}
            <div className="lg:hidden space-y-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No products found
                </div>
              )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-slate-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {product.material}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium capitalize whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₱{Number(product.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-700'
                                : product.stock > 0
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9a2 2 0 112 2 2 2 0 01-2-2z"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
