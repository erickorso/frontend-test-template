import uiReducer, {
  toggleCart,
  setCartOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  addNotification,
  removeNotification,
  clearNotifications,
} from '../src/store/slices/uiSlice'

describe('uiSlice', () => {
  const initialState = {
    isCartOpen: false,
    isMobileMenuOpen: false,
    notifications: [],
  }

  it('should return the initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('toggleCart', () => {
    it('should toggle cart from closed to open', () => {
      const action = toggleCart()
      const newState = uiReducer(initialState, action)

      expect(newState.isCartOpen).toBe(true)
    })

    it('should toggle cart from open to closed', () => {
      const stateWithCartOpen = { ...initialState, isCartOpen: true }
      const action = toggleCart()
      const newState = uiReducer(stateWithCartOpen, action)

      expect(newState.isCartOpen).toBe(false)
    })
  })

  describe('setCartOpen', () => {
    it('should set cart open to true', () => {
      const action = setCartOpen(true)
      const newState = uiReducer(initialState, action)

      expect(newState.isCartOpen).toBe(true)
    })

    it('should set cart open to false', () => {
      const stateWithCartOpen = { ...initialState, isCartOpen: true }
      const action = setCartOpen(false)
      const newState = uiReducer(stateWithCartOpen, action)

      expect(newState.isCartOpen).toBe(false)
    })
  })

  describe('toggleMobileMenu', () => {
    it('should toggle mobile menu from closed to open', () => {
      const action = toggleMobileMenu()
      const newState = uiReducer(initialState, action)

      expect(newState.isMobileMenuOpen).toBe(true)
    })

    it('should toggle mobile menu from open to closed', () => {
      const stateWithMenuOpen = { ...initialState, isMobileMenuOpen: true }
      const action = toggleMobileMenu()
      const newState = uiReducer(stateWithMenuOpen, action)

      expect(newState.isMobileMenuOpen).toBe(false)
    })
  })

  describe('setMobileMenuOpen', () => {
    it('should set mobile menu open to true', () => {
      const action = setMobileMenuOpen(true)
      const newState = uiReducer(initialState, action)

      expect(newState.isMobileMenuOpen).toBe(true)
    })

    it('should set mobile menu open to false', () => {
      const stateWithMenuOpen = { ...initialState, isMobileMenuOpen: true }
      const action = setMobileMenuOpen(false)
      const newState = uiReducer(stateWithMenuOpen, action)

      expect(newState.isMobileMenuOpen).toBe(false)
    })
  })

  describe('addNotification', () => {
    it('should add a notification with auto-generated id', () => {
      const notification = {
        type: 'success' as const,
        message: 'Test notification',
        duration: 3000,
      }
      const action = addNotification(notification)
      const newState = uiReducer(initialState, action)

      expect(newState.notifications).toHaveLength(1)
      expect(newState.notifications[0]).toMatchObject({
        type: 'success',
        message: 'Test notification',
        duration: 3000,
      })
      expect(newState.notifications[0].id).toBeDefined()
    })

    it('should add a notification with default duration', () => {
      const notification = {
        type: 'error' as const,
        message: 'Error notification',
      }
      const action = addNotification(notification)
      const newState = uiReducer(initialState, action)

      expect(newState.notifications[0].duration).toBe(5000)
    })

    it('should add multiple notifications', () => {
      const notification1 = { type: 'success' as const, message: 'First' }
      const notification2 = { type: 'error' as const, message: 'Second' }
      
      let state = uiReducer(initialState, addNotification(notification1))
      state = uiReducer(state, addNotification(notification2))

      expect(state.notifications).toHaveLength(2)
    })
  })

  describe('removeNotification', () => {
    it('should remove a specific notification', () => {
      const notification = { type: 'success' as const, message: 'Test' }
      let state = uiReducer(initialState, addNotification(notification))
      const notificationId = state.notifications[0].id

      const action = removeNotification(notificationId)
      state = uiReducer(state, action)

      expect(state.notifications).toHaveLength(0)
    })

    it('should not remove non-existent notification', () => {
      const notification = { type: 'success' as const, message: 'Test' }
      let state = uiReducer(initialState, addNotification(notification))

      const action = removeNotification('non-existent-id')
      state = uiReducer(state, action)

      expect(state.notifications).toHaveLength(1)
    })
  })

  describe('clearNotifications', () => {
    it('should clear all notifications', () => {
      const notification1 = { type: 'success' as const, message: 'First' }
      const notification2 = { type: 'error' as const, message: 'Second' }
      
      let state = uiReducer(initialState, addNotification(notification1))
      state = uiReducer(state, addNotification(notification2))
      expect(state.notifications).toHaveLength(2)

      const action = clearNotifications()
      state = uiReducer(state, action)

      expect(state.notifications).toHaveLength(0)
    })

    it('should handle clearing empty notifications', () => {
      const action = clearNotifications()
      const newState = uiReducer(initialState, action)

      expect(newState.notifications).toHaveLength(0)
    })
  })

  describe('multiple actions', () => {
    it('should handle multiple state changes', () => {
      let state = uiReducer(initialState, toggleCart())
      expect(state.isCartOpen).toBe(true)

      state = uiReducer(state, toggleMobileMenu())
      expect(state.isMobileMenuOpen).toBe(true)

      state = uiReducer(state, addNotification({ type: 'info', message: 'Test' }))
      expect(state.notifications).toHaveLength(1)

      state = uiReducer(state, setCartOpen(false))
      expect(state.isCartOpen).toBe(false)
    })
  })
})
