import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('collabuz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('collabuz_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (event, ticketType, quantity = 1) => {
    setCartItems(prev => {
      // Check if item already exists in cart for this event and ticket tier
      const existingIndex = prev.findIndex(
        item => item.eventId === event._id && item.ticketName === ticketType.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            eventId: event._id,
            eventTitle: event.title,
            collegeName: event.collegeName,
            eventDate: event.date,
            eventLocation: event.location,
            bannerUrl: event.bannerUrl,
            ticketName: ticketType.name,
            price: ticketType.price,
            quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (eventId, ticketName, newQty) => {
    if (newQty <= 0) {
      removeFromCart(eventId, ticketName);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.eventId === eventId && item.ticketName === ticketName
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (eventId, ticketName) => {
    setCartItems(prev =>
      prev.filter(item => !(item.eventId === eventId && item.ticketName === ticketName))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        totalItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
