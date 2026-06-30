import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore, CartItem } from '@/lib/cart-store'

function makeItem(overrides?: Partial<CartItem>): CartItem {
  return {
    productId: 'prod-1',
    variantId: null,
    name: 'Vestido Floral',
    image: '/img/vestido.jpg',
    price: 149.9,
    quantity: 1,
    variantInfo: null,
    maxStock: 10,
    source: 'own',
    ...overrides,
  }
}

describe('cart-store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  describe('addItem', () => {
    it('adds an item to an empty cart', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem())

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].productId).toBe('prod-1')
      expect(state.items[0].quantity).toBe(1)
    })

    it('adds multiple distinct items', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1' }))
      store.addItem(makeItem({ productId: 'prod-2', name: 'Blusa' }))

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(2)
    })

    it('increments quantity when adding a duplicate item', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', quantity: 1 }))
      store.addItem(makeItem({ productId: 'prod-1', quantity: 2 }))

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3)
    })

    it('differentiates items by variantId', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', variantId: 'var-p', name: 'Vestido P' }))
      store.addItem(makeItem({ productId: 'prod-1', variantId: 'var-m', name: 'Vestido M' }))

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(2)
    })

    it('caps quantity at maxStock on duplicate add', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', quantity: 8, maxStock: 10 }))
      store.addItem(makeItem({ productId: 'prod-1', quantity: 5, maxStock: 10 }))

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(10)
    })
  })

  describe('removeItem', () => {
    it('removes an item by productId and variantId', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1' }))
      store.addItem(makeItem({ productId: 'prod-2' }))

      store.removeItem('prod-1', null)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].productId).toBe('prod-2')
    })

    it('removes the correct variant', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', variantId: 'var-p' }))
      store.addItem(makeItem({ productId: 'prod-1', variantId: 'var-m' }))

      store.removeItem('prod-1', 'var-p')

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].variantId).toBe('var-m')
    })

    it('does nothing when item is not found', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1' }))

      store.removeItem('nonexistent', null)

      expect(useCartStore.getState().items).toHaveLength(1)
    })
  })

  describe('updateQuantity', () => {
    it('updates the quantity of an item', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', quantity: 1 }))

      store.updateQuantity('prod-1', null, 5)

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(5)
    })

    it('caps quantity at maxStock', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', quantity: 1, maxStock: 3 }))

      store.updateQuantity('prod-1', null, 10)

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(3)
    })

    it('removes item when quantity is set below 1', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', quantity: 3 }))

      store.updateQuantity('prod-1', null, 0)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })

    it('updates the correct variant', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', variantId: 'var-p', quantity: 1 }))
      store.addItem(makeItem({ productId: 'prod-1', variantId: 'var-m', quantity: 1 }))

      store.updateQuantity('prod-1', 'var-p', 4)

      const state = useCartStore.getState()
      const varP = state.items.find((i) => i.variantId === 'var-p')
      const varM = state.items.find((i) => i.variantId === 'var-m')
      expect(varP?.quantity).toBe(4)
      expect(varM?.quantity).toBe(1)
    })
  })

  describe('clearCart', () => {
    it('removes all items', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1' }))
      store.addItem(makeItem({ productId: 'prod-2' }))
      store.addItem(makeItem({ productId: 'prod-3' }))

      store.clearCart()

      expect(useCartStore.getState().items).toEqual([])
    })
  })

  describe('itemCount', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().itemCount()).toBe(0)
    })

    it('sums quantities across all items', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', quantity: 2 }))
      store.addItem(makeItem({ productId: 'prod-2', quantity: 3 }))
      store.addItem(makeItem({ productId: 'prod-3', quantity: 1 }))

      expect(useCartStore.getState().itemCount()).toBe(6)
    })
  })

  describe('subtotal', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().subtotal()).toBe(0)
    })

    it('calculates price * quantity sum', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', price: 100, quantity: 2 }))
      store.addItem(makeItem({ productId: 'prod-2', price: 50, quantity: 3 }))

      expect(useCartStore.getState().subtotal()).toBe(350)
    })

    it('handles decimal prices correctly', () => {
      const store = useCartStore.getState()
      store.addItem(makeItem({ productId: 'prod-1', price: 149.9, quantity: 3 }))

      expect(useCartStore.getState().subtotal()).toBeCloseTo(449.7, 2)
    })
  })
})
