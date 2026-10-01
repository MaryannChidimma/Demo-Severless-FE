import { request } from './http'

// product-service
export const getProducts = (signal) => request('/products', { signal })
export const getProduct = (id, signal) => request(`/products/${encodeURIComponent(id)}`, { signal })
