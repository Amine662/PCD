import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // holds { product, quantity, seller_id }
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    if (items.length > 0) {
      fetchCartDetails();
    } else {
      setCartDetails([]);
    }
  }, [items]);

  const fetchCartDetails = async () => {
    try {
      const productIds = items.map(item => item.product); // only IDs
      console.log('Product IDs to fetch:', productIds);

      const response = await axios.post('http://localhost:8001/api/products/cart-products', productIds);
      const fetchedProducts = response.data;

      // Combine fetched product details with local quantity and seller_id
      const mergedCart = fetchedProducts.map(product => {
        const matchedItem = items.find(item => item.product.id === product.id);
        return {
          ...product,
          quantity: matchedItem?.quantity || 1,
          seller_id: matchedItem?.seller_id || null
        };
      });

      setCartDetails(mergedCart);
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };

  const addToCart = (product, quantity = 1, seller_id) => {
    console.log('Adding to cart:', {
      product,
      quantity,
      seller_id
    });
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        console.log("helloooooooooooooooooooooo");
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity, seller_id }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.product !== productId));
    console.log('Removed from cart:', productId);
  };
  
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartDetails,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
