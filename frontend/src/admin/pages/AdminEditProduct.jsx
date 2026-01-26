import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import adminApi from '../services/api';
import toast from 'react-hot-toast';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    material: '',
    category: 'dresses',
    stock: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const response = await adminApi.get(`/products/${id}`);
      const product = response.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        material: product.material || '',
        category: product.category || 'dresses',
        stock: product.stock || '',
        image: null,
      });
      if (product.image) {
        const imageUrl = product.image.startsWith('products/')
          ? `/storage/${product.image}`
          : `/img/${product.image}`;
        setImagePreview(imageUrl);
      }
    } catch {
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Use POST for form data since PUT doesn't work well with FormData
      await adminApi.post(`/products/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">
            Edit Product
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Update product information
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-5 sm:space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
              >
                <option value="dresses">Dresses</option>
                <option value="robes">Robes</option>
                <option value="veils">Veils</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-11"
                placeholder="e.g., Silk, Lace"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Image
            </label>
            <div className="mt-2">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mb-4"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="sm:flex-none px-6 py-3 border border-gray-300 rounded-lg font-semibold text-slate-700 hover:bg-gray-50 transition-colors min-h-11 flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 min-h-11 flex items-center justify-center"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
