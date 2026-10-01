import { request } from './http'

// order-service: every call returns the full, re-priced cart.
export const getCart = (userId, signal) => request(`/carts/${userId}`, { signal })

export const addItem = (userId, productId, quantity) =>
  request(`/carts/${userId}/items`, { method: 'POST', body: { productId, quantity } })

export const removeItem = (userId, itemId) => request(`/carts/${userId}/items/${itemId}`, { method: 'DELETE' })
