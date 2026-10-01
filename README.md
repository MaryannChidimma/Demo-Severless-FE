# DEPOT storefront

React + Vite storefront for the DEPOT e-commerce project. It is a client for
the three Spring Boot services in the backend repository:

| Service         | Port | Used for                         |
| --------------- | ---- | -------------------------------- |
| user-service    | 8081 | sign-in, profile, delivery address |
| product-service | 8082 | catalogue                        |
| order-service   | 8083 | cart, orders                     |

## Run

```bash
npm install
npm run dev        # against the real services on localhost:8081–8083
npm run dev:mock   # against mock/server.mjs (in-memory demo data, no Docker)
npm run build
```

The browser only ever calls `/api/...` on its own origin. The Vite dev server
(and `nginx.conf` in the Docker image) forwards each path to the service that
owns it, so the services need no CORS configuration. Override the targets in
`.env` (see `.env.example`).

## One-time backend setup

The storefront shows product images and categories from two optional product
fields, `imageUrl` and `category`. Until product-service has them, the shop
still works but products have a placeholder image and there are no categories.

```bash
# in the backend repository
git apply /path/to/microservices-FE/backend-patch/product-image-category.patch
docker compose up -d --build --no-deps product-service

# back here: load the demo catalogue through the product API
npm run seed
```

## Structure

```
src/
  services/    one module per backend service; the only place fetch is called
  context/     session, products, cart, favourites, toast
  hooks/       useAsync, useAddToCart, useMediaQuery, usePageTitle
  components/  reusable UI (ProductCard, Drawer, CartItem, OrderSummary, …)
  layouts/     AppLayout (header, footer, tab bar), AccountLayout
  pages/       one file per route
  styles/      tokens.css (design tokens) → base → layout → components → pages
  utils/       formatting, client-side catalogue search/filter/sort
mock/          mock API for `npm run dev:mock` — never used by `dev` or `build`
seed/          demo catalogue, used by the mock API and by `npm run seed`
```

## What the backend does not provide

These are handled in the frontend, or left out, rather than faked:

- **Authentication** — there are no passwords or tokens. Sign-in matches or
  creates a user by email and remembers it in the browser.
- **Search, filter, sort** — done client-side over `GET /products`.
- **Cart quantity decrease** — the API can only add to a line or delete it, so
  lowering a quantity removes the line and adds it back.
- **Payment** — no payment service. Checkout offers "Pay on delivery" only.
- **Ratings, reviews, discounts, delivery estimates, payment methods** — no
  data exists, so they are not shown.
- **Favourites** — stored in the browser only.

Product photos are from Unsplash (free to use under the Unsplash License).
