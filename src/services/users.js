import { ApiError, request } from './http'

// user-service
export const getUser = (id, signal) => request(`/users/${id}`, { signal })
export const createUser = ({ name, email }) => request('/users', { method: 'POST', body: { name, email } })
export const updateUser = (id, { name, email }) => request(`/users/${id}`, { method: 'PUT', body: { name, email } })

// user-service has no lookup-by-email endpoint, so the match is done here
// against the full user list.
export async function findUserByEmail(email) {
  const wanted = email.trim().toLowerCase()
  const users = await request('/users')
  return users.find((u) => u.email?.trim().toLowerCase() === wanted) ?? null
}

// Resolves to null when the user has not saved an address yet (the API's 404).
export async function getAddress(userId, signal) {
  try {
    return await request(`/users/${userId}/address`, { signal })
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

export const saveAddress = (userId, address) => request(`/users/${userId}/address`, { method: 'PUT', body: address })
