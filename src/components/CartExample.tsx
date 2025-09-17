import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  setCartLoading, 
  setCartError, 
  setCartItems,
  setCartSummary 
} from '../store/slices/cartSlice'
import { addNotification } from '../store/slices/uiSlice'
import { cartService } from '../services/cartService'
import { Game } from '../utils/endpoint'

const CartExample: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, summary, isLoading, error } = useAppSelector((state) => state.cart)
  const { notifications } = useAppSelector((state) => state.ui)

  // Ejemplo de side effect: Cargar carrito
  const loadCart = async () => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      // Simular llamada a API
      const cartItems = await cartService.getCartItems()
      const cartSummary = await cartService.getCartSummary()
      
      dispatch(setCartItems(cartItems))
      dispatch(setCartSummary(cartSummary))
      
      dispatch(addNotification({
        type: 'success',
        message: 'Cart loaded successfully!',
        duration: 3000
      }))
    } catch (err) {
      dispatch(setCartError('Failed to load cart'))
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load cart',
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }

  // Ejemplo de side effect: Agregar al carrito
  const addToCart = async (game: Game) => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      await cartService.addToCart(game)
      const cartItems = await cartService.getCartItems()
      const cartSummary = await cartService.getCartSummary()
      
      dispatch(setCartItems(cartItems))
      dispatch(setCartSummary(cartSummary))
      
      dispatch(addNotification({
        type: 'success',
        message: `${game.name} added to cart!`,
        duration: 3000
      }))
    } catch (err) {
      dispatch(setCartError('Failed to add to cart'))
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to add item to cart',
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cart Example with Side Effects</h2>
      
      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-100 p-3 rounded mb-4">
          <p className="text-blue-800">Loading...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 p-3 rounded mb-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-3 rounded mb-2 ${
                notification.type === 'success' ? 'bg-green-100 text-green-800' :
                notification.type === 'error' ? 'bg-red-100 text-red-800' :
                notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}
      
      {/* Cart Summary */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-semibold">Cart Summary</h3>
        <p>Items: {summary.totalItems}</p>
        <p>Total: ${summary.totalPrice.toFixed(2)}</p>
      </div>
      
      {/* Actions */}
      <div className="space-x-2">
        <button 
          onClick={loadCart}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Load Cart
        </button>
        
        <button 
          onClick={() => addToCart({
            id: '1',
            name: 'Test Game',
            price: 59.99,
            genre: 'Action',
            image: '/test.jpg',
            description: 'Test game',
            isNew: true
          })}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add Test Game
        </button>
      </div>
    </div>
  )
}

export default CartExample
