import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      const parsed = JSON.parse(storedCart);
      if (parsed && Array.isArray(parsed.cartItems)) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage');
    }
  }
  return { 
    cartItems: [], 
    shippingAddress: {}, 
    paymentMethod: 'PayPal',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  };
};

const initialState = getInitialState();

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // Calculate items price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0)
      );

      // Calculate shipping price (If order is > ₹1000 then free, else ₹100 shipping)
      state.shippingPrice = state.itemsPrice > 1000 ? 0 : 100;

      // Calculate tax price (15% tax)
      state.taxPrice = addDecimals(Number((0.15 * Number(state.itemsPrice)).toFixed(2)));

      // Calculate total price
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Recalculate prices
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0)
      );
      state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 10);
      state.taxPrice = addDecimals(Number((0.15 * Number(state.itemsPrice)).toFixed(2)));
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveAddressToBook: (state, action) => {
      if (!state.savedAddresses) {
        state.savedAddresses = [];
      }
      state.savedAddresses.push(action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  saveAddressToBook,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
