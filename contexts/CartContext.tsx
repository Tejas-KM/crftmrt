"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"

export interface Product {
  id: number
  name: string
  category: string
  image: string
  price: number
  originalPrice?: number
  unit: string
  rating: number
  reviews: number
  badge?: string
  features: string[]
  description: string
  inStock?: boolean
  stockQuantity?: number
}

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )

        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        }
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id })
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return initialState

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}


const CartContext = createContext<{
  state: CartState
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token, sessionToken } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from backend or localStorage on mount/login
  useEffect(() => {
    async function loadCart() {
      const authHeader = sessionToken ? sessionToken : token;
      if (user && authHeader) {
        // Fetch cart from backend
        const res = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${authHeader}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Always expect cart as { items, total, itemCount }
          if (data.cart && typeof data.cart === "object" && Array.isArray(data.cart.items)) {
            const safeCart = {
              items: data.cart.items,
              total: typeof data.cart.total === "number" ? data.cart.total : 0,
              itemCount: typeof data.cart.itemCount === "number" ? data.cart.itemCount : 0,
            };
            dispatch({ type: "LOAD_CART", payload: safeCart });
          } else {
            dispatch({ type: "LOAD_CART", payload: { items: [], total: 0, itemCount: 0 } });
          }
        }
      } else {
        // Guest: load from localStorage
        const savedCart = localStorage.getItem("craftmart-cart");
        if (savedCart) {
          try {
            const cartData = JSON.parse(savedCart);
            if (cartData && Array.isArray(cartData.items)) {
              const safeCart = {
                items: cartData.items,
                total: typeof cartData.total === "number" ? cartData.total : 0,
                itemCount: typeof cartData.itemCount === "number" ? cartData.itemCount : 0,
              };
              dispatch({ type: "LOAD_CART", payload: safeCart });
            } else {
              dispatch({ type: "LOAD_CART", payload: { items: [], total: 0, itemCount: 0 } });
            }
          } catch (error) {
            console.error("Error loading cart from localStorage:", error);
          }
        } else {
          dispatch({ type: "LOAD_CART", payload: { items: [], total: 0, itemCount: 0 } });
        }
      }
    }
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  // Save cart to backend or localStorage whenever it changes
  useEffect(() => {
    const authHeader = sessionToken ? sessionToken : token;
    if (user && authHeader) {
      // Save to backend, always as { items, total, itemCount }
      fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify({ cart: { items: state.items, total: state.total, itemCount: state.itemCount } }),
      });
    } else {
      // Guest: save to localStorage, always as { items, total, itemCount }
      localStorage.setItem("craftmart-cart", JSON.stringify({ items: state.items, total: state.total, itemCount: state.itemCount }));
    }
  }, [state, user, token]);

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const removeItem = (id: number) => {
    const item = state.items.find((item) => item.id === id)
    dispatch({ type: "REMOVE_ITEM", payload: id })
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed from your cart.`,
      })
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
