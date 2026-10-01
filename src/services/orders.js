import { request } from './http'

// order-service. Placing an order takes no body: it converts the user's
// current cart into an order and empties the cart.
export const placeOrder = (userId) => request(`/orders/${userId}`, { method: 'POST' })
export const getOrder = (id, signal) => request(`/orders/${id}`, { signal })
export const getOrdersForUser = (userId, signal) => request(`/orders/user/${userId}`, { signal })
