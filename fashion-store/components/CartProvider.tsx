'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  slug: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      )

      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }

      return [...prevCart, item]
    })
  }

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.id === id && item.size === size && item.color === color)
    ))
  }

  const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
