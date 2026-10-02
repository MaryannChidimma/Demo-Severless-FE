# DEPOT storefront

This is the shop website for the DEPOT project. It is built with React and
Vite. It has no data of its own. Everything comes from three backend services:

| Service         | Port | What the shop uses it for          |
| --------------- | ---- | ---------------------------------- |
| user-service    | 8081 | sign in, profile, delivery address |
| product-service | 8082 | the list of products               |
| order-service   | 8083 | cart and orders                    |

## How to run it

First install the packages. You only do this once.

```bash
npm install
```

Then pick one of these.

### 1. With fake data (easiest)

```bash
npm run dev:mock
```

Open http://localhost:5173. You do not need Docker or the backend. The data
is kept in memory, so it is lost when you stop the command.

### 2. With the backend running on your machine

Start the three services on ports 8081, 8082 and 8083, then run:

```bash
npm run dev
```

### 3. With the backend running in Minikube

Make the backend's `api-gateway` reachable on port 8000:

```bash
kubectl port-forward svc/api-gateway 8000:80
```

Create a file named `.env` with these three lines:

```bash
USER_SERVICE_URL=http://localhost:8000
PRODUCT_SERVICE_URL=http://localhost:8000
ORDER_SERVICE_URL=http://localhost:8000
```

Then run `npm run dev`.

### How the shop reaches the backend

The browser only calls addresses that start with `/api` on the shop's own
address. The dev server passes each call on to the right service. Because of
this, the services do not need any CORS setup.

## Product images and categories (do this once)

The shop can show a picture and a category for each product. The backend
needs two extra product fields for this: `imageUrl` and `category`. Without
them the shop still works, but every product shows a grey placeholder and
there are no categories.

```bash
# in the backend repository
git apply /path/to/microservices-FE/backend-patch/product-image-category.patch
docker compose up -d --build --no-deps product-service

# back in this folder: add the demo products
npm run seed
```

## Run the shop inside Minikube

The Docker image contains nginx. nginx does two jobs:

- it serves the built website
- it sends every `/api` call to the backend's `api-gateway`

The gateway then sends the call to the right service. The gateway is part of
the backend repository and must be running before you start the shop.

```bash
docker build -t storefront:1.0 .
minikube image load storefront:1.0
kubectl apply -f k8s/storefront.yaml

kubectl port-forward svc/storefront 8080:80
```

Open http://localhost:8080.

After you change the code, build and load the image again, then restart:

```bash
kubectl rollout restart deployment/storefront
```

The restart stops the port-forward, so run the port-forward command again.

### Share the shop with other people

Keep the port-forward running, then run:

```bash
cloudflared tunnel --url http://localhost:8080
```

It prints a link that ends in `.trycloudflare.com`. Anyone with the link can
open the shop, from any place and any device. The link works only while your
computer is on and both commands are running. You get a new link each time
you start the tunnel.

`ngrok http 8080` does the same job if you prefer ngrok.

## What happens when something fails

- **Error messages.** When a service returns an error, the shop shows the
  reason the service gave. When a service does not answer at all, the shop
  shows "This part of the shop is restarting — try again in a moment."
- **Reading data is tried twice.** If loading something fails because a
  service is down, the shop waits a short time (0.8 seconds) and tries one
  more time. This hides the short gap when Kubernetes replaces a pod.
- **Changing data is tried once only.** Adding to the cart, placing an order
  and saving details are never sent a second time. The first try may already
  have worked, and sending it again could do it twice.
- **The gateway also waits and retries.** It waits up to 2 seconds to
  connect and up to 10 seconds for an answer. For reads it tries one more
  time, and Kubernetes may send that second try to a different pod.
- **A broken page does not go blank.** If a page crashes, the shop shows a
  "Try again" panel. The panel goes away when you move to another page.
- **Checkout.** The "Place order" button is switched off while the order is
  being sent, so it cannot be sent twice. If the order fails, the cart stays
  as it was and the shop shows the reason.

## Where things are

```
src/
  services/    all calls to the backend, one file per service
  context/     shared state: session, products, cart, favourites, toast
  hooks/       small reusable pieces of logic
  components/  reusable parts of the screen (ProductCard, Drawer, CartItem, …)
  layouts/     page frames: header, footer, tab bar
  pages/       one file per page
  styles/      colours and sizes first (tokens.css), then the rest of the CSS
  utils/       formatting, and search / filter / sort for the product list
mock/          the fake backend used by `npm run dev:mock`
seed/          the demo products
k8s/           the Kubernetes file for the shop
```

## What the backend cannot do yet

The shop does not pretend to have these. Each one is either done in the
browser or left out.

- **Passwords.** There are none. You sign in with an email only. If the email
  is new, an account is created. The browser remembers who you are.
- **Search, filter and sort.** The shop loads all products and does this in
  the browser.
- **Lowering a quantity in the cart.** The backend can only add an item or
  remove it. To lower a quantity, the shop removes the item and adds it back
  with the new number.
- **Payment.** There is no payment service. Checkout offers "Pay on delivery"
  only.
- **Ratings, reviews, discounts and delivery dates.** The backend has no data
  for these, so the shop does not show them.
- **Favourites.** They are saved in the browser only, not on the backend.

Product photos are from Unsplash and are free to use under the Unsplash
License.
