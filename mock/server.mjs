// MOCK API — development only. Not used by `npm run dev` or by any build.
//
// An in-memory stand-in for user-service, product-service and order-service,
// following the same routes and response shapes as the Spring Boot
// controllers, so the storefront can be worked on without Docker running.
// Products come from seed/products.json; everything is lost on restart.
//
//   npm run dev:mock

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'

const PORT = Number(process.env.MOCK_PORT || 8090)
const seed = JSON.parse(await readFile(new URL('../seed/products.json', import.meta.url)))

// Mongo-style ids: the first 8 hex chars are a creation timestamp, which is
// what the storefront uses to order "new arrivals".
const now = Math.floor(Date.now() / 1000)
const objectId = (i, total) =>
  (now - (total - i) * 86400).toString(16).padStart(8, '0') + i.toString(16).padStart(16, '0')

const products = seed.map((p, i) => ({ id: objectId(i, seed.length), ...p }))
const users = []
const addresses = new Map()
const carts = new Map()
const orders = []
let userSeq = 1
let cartItemSeq = 1
let orderSeq = 1

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
const notFound = () => new HttpError(404)
// The real services throw RuntimeException, which Spring reports as a 500.
const serverError = (message) => new HttpError(500, message)

const findProduct = (id) => products.find((p) => p.id === id)
const findUser = (id) => users.find((u) => u.id === id)

function cartDto(userId) {
  const cart = carts.get(userId)
  const items = cart.items.map((i) => {
    const product = findProduct(i.productId)
    if (!product) throw serverError(`Product not found: ${i.productId}`)
    return { id: i.id, productId: i.productId, productName: product.name, quantity: i.quantity, price: product.price }
  })
  const totalPrice = Number(items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2))
  return { id: cart.id, userId, items, totalPrice }
}

function getOrCreateCart(userId) {
  if (!carts.has(userId)) {
    if (!findUser(userId)) throw serverError(`User not found: ${userId}`)
    carts.set(userId, { id: carts.size + 1, items: [] })
  }
  return carts.get(userId)
}

const routes = [
  ['GET', /^\/products$/, () => products],
  ['GET', /^\/products\/([^/]+)$/, (id) => findProduct(id) ?? Promise.reject(notFound())],

  ['GET', /^\/users$/, () => users],
  [
    'POST',
    /^\/users$/,
    (body) => {
      const user = { id: userSeq++, name: body.name, email: body.email }
      users.push(user)
      return [201, user]
    },
  ],
  ['GET', /^\/users\/(\d+)$/, (id) => findUser(Number(id)) ?? Promise.reject(notFound())],
  [
    'PUT',
    /^\/users\/(\d+)$/,
    (id, body) => {
      const user = findUser(Number(id))
      if (!user) throw notFound()
      user.name = body.name
      user.email = body.email
      return user
    },
  ],
  ['GET', /^\/users\/(\d+)\/address$/, (id) => addresses.get(Number(id)) ?? Promise.reject(notFound())],
  [
    'PUT',
    /^\/users\/(\d+)\/address$/,
    (id, body) => {
      const userId = Number(id)
      if (!findUser(userId)) throw serverError('User not found')
      const { street, city, state, zipCode, country } = body
      const address = { id: addresses.get(userId)?.id ?? addresses.size + 1, street, city, state, zipCode, country }
      addresses.set(userId, address)
      return address
    },
  ],

  [
    'GET',
    /^\/carts\/(\d+)$/,
    (id) => {
      getOrCreateCart(Number(id))
      return cartDto(Number(id))
    },
  ],
  [
    'POST',
    /^\/carts\/(\d+)\/items$/,
    (id, body) => {
      const userId = Number(id)
      const cart = getOrCreateCart(userId)
      const productId = String(body.productId)
      const quantity = Number(body.quantity)
      if (!findProduct(productId)) throw serverError(`Product not found: ${productId}`)
      const existing = cart.items.find((i) => i.productId === productId)
      if (existing) existing.quantity += quantity
      else cart.items.push({ id: cartItemSeq++, productId, quantity })
      return cartDto(userId)
    },
  ],
  [
    'DELETE',
    /^\/carts\/(\d+)\/items\/(\d+)$/,
    (id, itemId) => {
      const userId = Number(id)
      const cart = getOrCreateCart(userId)
      cart.items = cart.items.filter((i) => i.id !== Number(itemId))
      return cartDto(userId)
    },
  ],

  [
    'POST',
    /^\/orders\/(\d+)$/,
    (id) => {
      const userId = Number(id)
      if (!findUser(userId)) throw serverError(`User not found: ${userId}`)
      const cart = carts.get(userId)
      if (!cart) throw serverError('Cart not found')
      if (cart.items.length === 0) throw serverError('Cannot place an order with an empty cart')
      const items = cart.items.map((i) => {
        const product = findProduct(i.productId)
        return {
          productId: i.productId,
          productName: product.name,
          quantity: i.quantity,
          priceAtPurchase: product.price,
        }
      })
      const order = {
        id: orderSeq++,
        userId,
        items,
        totalAmount: Number(items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0).toFixed(2)),
        status: 'PLACED',
        orderDate: new Date().toISOString().slice(0, 23),
      }
      orders.push(order)
      cart.items = []
      return [201, order]
    },
  ],
  ['GET', /^\/orders\/user\/(\d+)$/, (id) => orders.filter((o) => o.userId === Number(id))],
  ['GET', /^\/orders\/(\d+)$/, (id) => orders.find((o) => o.id === Number(id)) ?? Promise.reject(notFound())],
]

async function readBody(req) {
  let raw = ''
  for await (const chunk of req) raw += chunk
  return raw ? JSON.parse(raw) : {}
}

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname
  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(body === undefined ? '' : JSON.stringify(body))
  }
  try {
    for (const [method, pattern, handler] of routes) {
      const match = req.method === method && path.match(pattern)
      if (!match) continue
      const body = method === 'POST' || method === 'PUT' ? await readBody(req) : undefined
      const args = body === undefined ? match.slice(1) : [...match.slice(1), body]
      const result = await handler(...args)
      const [status, payload] = Array.isArray(result) && typeof result[0] === 'number' ? result : [200, result]
      return send(status, payload)
    }
    send(404)
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500
    send(status, status === 404 ? undefined : { status, error: 'Internal Server Error', message: err.message })
  }
}).listen(PORT, () => console.log(`[mock] DEPOT mock API on http://localhost:${PORT} — demo data, in memory only`))
