"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import type { Product } from "./CartContext"

interface WishlistState {
  items: Product[]
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: WishlistState }

const initialState: WishlistState = {
  items: [],
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return state // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_WISHLIST":
      return initialState

    case "LOAD_WISHLIST":
      return action.payload

    default:
      return state
  }
}


const WishlistContext = createContext<{
  state: WishlistState
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  clearWishlist: () => void
  isInWishlist: (id: number) => boolean
} | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, token, sessionToken } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from backend or localStorage on mount/login
  useEffect(() => {
    async function loadWishlist() {
      const authHeader = sessionToken ? sessionToken : token;
      if (user && authHeader) {
        // Fetch wishlist from backend
        const res = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${authHeader}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Always expect wishlist as { items: [...] }
          if (data.wishlist && Array.isArray(data.wishlist.items)) {
            dispatch({ type: "LOAD_WISHLIST", payload: { items: data.wishlist.items } });
          } else {
            dispatch({ type: "LOAD_WISHLIST", payload: { items: [] } });
          }
        }
      } else {
        // Guest: load from localStorage
        const savedWishlist = localStorage.getItem("craftmart-wishlist");
        if (savedWishlist) {
          try {
            const wishlistData = JSON.parse(savedWishlist);
            // Defensive: always expect { items: [...] }
            if (wishlistData && Array.isArray(wishlistData.items)) {
              dispatch({ type: "LOAD_WISHLIST", payload: { items: wishlistData.items } });
            } else {
              dispatch({ type: "LOAD_WISHLIST", payload: { items: [] } });
            }
          } catch (error) {
            console.error("Error loading wishlist from localStorage:", error);
          }
        } else {
          dispatch({ type: "LOAD_WISHLIST", payload: { items: [] } });
        }
      }
    }
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, sessionToken]);


  // Save wishlist to backend or localStorage whenever it changes
  useEffect(() => {
    const authHeader = sessionToken ? sessionToken : token;
    if (user && authHeader && state.items.length > 0) {
      // Save to backend, always as { items: [...] }
      fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify({ wishlist: { items: state.items } }),
      });
    } else if (!user) {
      // Guest: save to localStorage, always as { items: [...] }
      localStorage.setItem("craftmart-wishlist", JSON.stringify({ items: state.items }));
    }
  }, [state, user, token, sessionToken]);

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  } 

  const removeItem = (id: number) => {
    const item = state.items.find((item) => item.id === id)
    dispatch({ type: "REMOVE_ITEM", payload: id })
    if (item) {
      toast({
        title: "Removed from wishlist",
        description: `${item.name} has been removed from your wishlist.`,
      })
    }
  }

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" })
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  const isInWishlist = (id: number) => {
    return state.items.some((item) => item.id === id)
  }

  return (
    <WishlistContext.Provider value={{ state, addItem, removeItem, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
