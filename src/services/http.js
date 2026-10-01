const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    // 0 means the request never got a response (offline, service down).
    this.status = status
  }
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(BASE + path, {
      method,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('Network request failed', 0)
  }

  if (!res.ok) throw new ApiError(`${method} ${path} failed with ${res.status}`, res.status)

  const text = await res.text()
  return text ? JSON.parse(text) : null
}
