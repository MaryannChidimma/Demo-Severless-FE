const BASE = import.meta.env.VITE_API_BASE ?? '/api'

const RESTARTING = 'This part of the shop is restarting — try again in a moment.'
// 0 = no response at all; 502/503/504 = the gateway or a service is restarting.
const UNAVAILABLE = new Set([0, 502, 503, 504])
const RETRY_DELAY_MS = 800

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    // 0 means the request never got a response (offline, service down).
    this.status = status
  }
}

// The services answer errors as ProblemDetail (RFC 7807): { title, status, detail }.
async function errorMessage(res) {
  if (UNAVAILABLE.has(res.status)) return RESTARTING
  try {
    const problem = await res.json()
    return problem.detail || problem.title || 'Something went wrong. Please try again.'
  } catch {
    return 'Something went wrong. Please try again.'
  }
}

async function send(path, { method, body, signal }) {
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
    throw new ApiError(RESTARTING, 0)
  }

  if (!res.ok) throw new ApiError(await errorMessage(res), res.status)

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  try {
    return await send(path, { method, body, signal })
  } catch (err) {
    // One retry hides the moment a pod is being replaced. Reads only:
    // a POST/PUT/DELETE may already have been applied, so it is never repeated.
    const retry = method === 'GET' && err instanceof ApiError && UNAVAILABLE.has(err.status)
    if (!retry) throw err
    await wait(RETRY_DELAY_MS, signal)
    return send(path, { method, body, signal })
  }
}
