// Loads seed/products.json into product-service through its public REST API.
// Safe to re-run: products whose name already exists are skipped.
//
//   npm run seed
//   PRODUCT_SERVICE_URL=http://localhost:8082 npm run seed

import { readFile } from 'node:fs/promises'

const base = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8082'
const products = JSON.parse(await readFile(new URL('../seed/products.json', import.meta.url)))

const existing = await fetch(`${base}/products`).then((r) => {
  if (!r.ok) throw new Error(`GET /products returned ${r.status}`)
  return r.json()
})
const names = new Set(existing.map((p) => p.name))

let created = 0
for (const product of products) {
  if (names.has(product.name)) continue

  const res = await fetch(`${base}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error(`POST /products returned ${res.status} for "${product.name}"`)
  const saved = await res.json()

  // An unpatched product-service silently drops imageUrl and category.
  // Stop after the first product rather than fill the catalogue with
  // products that have no image and no category.
  if (created === 0 && (saved.imageUrl == null || saved.category == null)) {
    await fetch(`${base}/products/${saved.id}`, { method: 'DELETE' })
    console.error(
      'product-service did not store imageUrl/category.\n' +
        'Apply backend-patch/product-image-category.patch, rebuild product-service, then run this again.',
    )
    process.exit(1)
  }
  created += 1
  console.log(`+ ${saved.name}`)
}

console.log(`Done: ${created} created, ${products.length - created} already present.`)
