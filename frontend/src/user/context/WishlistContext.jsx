import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Load wishlist when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
      setWishlistIds(new Set());
    }
  }, [isLoggedIn]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wishlist');
      setWishlistItems(response.data);
      // Create a set of product IDs for quick lookup
      setWishlistIds(new Set(response.data.map(item => item.product.id)));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to your wishlist');
      return false;
    }

    try {
      const response = await api.post('/wishlist', {
        product_id: product.id,
      });

      if (response.data.message === 'Product already in wishlist') {
        toast.success('Product already in your wishlist');
        return false;
      }

      // Update local state
      setWishlistItems(prev => [...prev, response.data.wishlist_item]);
      setWishlistIds(prev => new Set([...prev, product.id]));

      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      // Update local state
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });

      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  const value = {
    wishlistItems,
    wishlistIds,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};