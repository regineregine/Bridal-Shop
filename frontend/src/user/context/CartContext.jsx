import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const cartKey = `cart_${userId}`;

  const [cartItems, setCartItems] = useState(() => {
    // Initialize with empty array, will load from localStorage in useEffect
    return [];
  });

  // Load cart from localStorage when user changes
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    const items = savedCart ? JSON.parse(savedCart) : [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(
      items.map((item) => ({
        ...item,
        selected: item.selected !== undefined ? item.selected : true,
      }))
    );
  }, [cartKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem(cartKey)) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, size, quantity, selected: true }];
      }
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeSelectedItems = () => {
    setCartItems((prevItems) => prevItems.filter((item) => !item.selected));
  };

  const toggleItemSelection = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getSelectedCartTotal = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedCartItems = () => {
    return cartItems.filter((item) => item.selected);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getSelectedCartCount = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        removeSelectedItems,
        toggleItemSelection,
        getCartTotal,
        getSelectedCartTotal,
        getSelectedCartItems,
        getCartCount,
        getSelectedCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
