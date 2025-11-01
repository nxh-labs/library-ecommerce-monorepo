import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AuthState, CartState, User } from '../types';

// État initial
const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  },
  cart: {
    cart: null,
    loading: false,
  },
};

// Types d'actions
type AuthAction =
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_LOGIN'; payload: { user: User; token: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_UPDATE_PROFILE'; payload: User };

type CartAction =
  | { type: 'CART_LOADING'; payload: boolean }
  | { type: 'CART_SET'; payload: any }
  | { type: 'CART_ADD_ITEM'; payload: any }
  | { type: 'CART_UPDATE_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'CART_REMOVE_ITEM'; payload: string }
  | { type: 'CART_CLEAR' }
  | { type: 'CART_UPDATE_TOTAL'; payload: number };

type AppAction = AuthAction | CartAction;

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Auth actions
    case 'AUTH_LOADING':
      return {
        ...state,
        auth: { ...state.auth, loading: action.payload },
      };

    case 'AUTH_LOGIN':
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        auth: {
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          loading: false,
        },
      };

    case 'AUTH_LOGOUT':
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return {
        ...state,
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        },
        cart: { cart: null, loading: false },
      };

    case 'AUTH_UPDATE_PROFILE':
      const updatedUser = { ...action.payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        ...state,
        auth: { ...state.auth, user: updatedUser },
      };

    // Cart actions
    case 'CART_LOADING':
      return {
        ...state,
        cart: { ...state.cart, loading: action.payload },
      };

    case 'CART_SET':
      return {
        ...state,
        cart: { cart: action.payload, loading: false },
      };

    case 'CART_ADD_ITEM':
      const currentCart = state.cart.cart;
      if (!currentCart) return state;

      const existingItemIndex = currentCart.items.findIndex(
        (item) => item.bookId === action.payload.bookId
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        updatedItems = [...currentCart.items, action.payload];
      }

      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        totalItems: updatedItems.length,
        estimatedTotalPrice: updatedItems.reduce((sum, item) => {
          const book = item.book;
          return book ? sum + (book.price * item.quantity) : sum;
        }, 0),
      };

      return {
        ...state,
        cart: { cart: updatedCart, loading: false },
      };

    case 'CART_UPDATE_ITEM':
      if (!state.cart.cart) return state;

      const updatedItems2 = state.cart.cart.items.map((item) =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const updatedCart2 = {
        ...state.cart.cart,
        items: updatedItems2,
        totalItems: updatedItems2.length,
        estimatedTotalPrice: updatedItems2.reduce((sum, item) => {
          const book = item.book;
          return book ? sum + (book.price * item.quantity) : sum;
        }, 0),
      };

      return {
        ...state,
        cart: { cart: updatedCart2, loading: false },
      };

    case 'CART_REMOVE_ITEM':
      if (!state.cart.cart) return state;

      const filteredItems = state.cart.cart.items.filter(
        (item) => item.id !== action.payload
      );

      const updatedCart3 = {
        ...state.cart.cart,
        items: filteredItems,
        totalItems: filteredItems.length,
        estimatedTotalPrice: filteredItems.reduce((sum, item) => {
          const book = item.book;
          return book ? sum + (book.price * item.quantity) : sum;
        }, 0),
      };

      return {
        ...state,
        cart: { cart: updatedCart3, loading: false },
      };

    case 'CART_CLEAR':
      return {
        ...state,
        cart: { cart: null, loading: false },
      };

    case 'CART_UPDATE_TOTAL':
      if (!state.cart.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          cart: {
            ...state.cart.cart,
            estimatedTotalPrice: action.payload,
          },
        },
      };

    default:
      return state;
  }
};

// Contexte
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restaurer l'état depuis localStorage au montage
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: 'AUTH_LOGIN',
          payload: { user, token },
        });
      } catch (error) {
        // Nettoyer les données corrompues
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personnalisé
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Hooks spécialisés
export const useAuth = () => {
  const { state, dispatch } = useApp();
  return {
    ...state.auth,
    login: (user: User, token: string) => {
      dispatch({ type: 'AUTH_LOGIN', payload: { user, token } });
    },
    logout: () => {
      dispatch({ type: 'AUTH_LOGOUT' });
    },
    updateProfile: (user: User) => {
      dispatch({ type: 'AUTH_UPDATE_PROFILE', payload: user });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: 'AUTH_LOADING', payload: loading });
    },
  };
};

export const useCart = () => {
  const { state, dispatch } = useApp();
  return {
    ...state.cart,
    setCart: (cart: any) => {
      dispatch({ type: 'CART_SET', payload: cart });
    },
    addItem: (item: any) => {
      dispatch({ type: 'CART_ADD_ITEM', payload: item });
    },
    updateItem: (itemId: string, quantity: number) => {
      dispatch({ type: 'CART_UPDATE_ITEM', payload: { itemId, quantity } });
    },
    removeItem: (itemId: string) => {
      dispatch({ type: 'CART_REMOVE_ITEM', payload: itemId });
    },
    clearCart: () => {
      dispatch({ type: 'CART_CLEAR' });
    },
    updateTotal: (total: number) => {
      dispatch({ type: 'CART_UPDATE_TOTAL', payload: total });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: 'CART_LOADING', payload: loading });
    },
  };
};