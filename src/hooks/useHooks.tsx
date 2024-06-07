import { useContext } from 'react'
import { CartContext } from '../context/CarritoContext'

export const useCarrito = () => {
  const context = useContext(CartContext)

  // console.log(context)

  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro del ambito de un CartProvider')
  }

  return context
}
