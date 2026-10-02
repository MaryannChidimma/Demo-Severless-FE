import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The three Spring Boot services run on separate ports and send no CORS
// headers, so the browser only ever talks to /api on this origin and the
// dev server forwards each path to the service that owns it.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const users = env.USER_SERVICE_URL || 'http://localhost:8081'
  const products = env.PRODUCT_SERVICE_URL || 'http://localhost:8082'
  const orders = env.ORDER_SERVICE_URL || 'http://localhost:8083'

  const to = (target) => ({
    target,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  })

  const proxy = {
    '/api/users': to(users),
    '/api/products': to(products),
    '/api/carts': to(orders),
    '/api/orders': to(orders),
  }

  // Public tunnels used for demos (a leading dot allows every subdomain)
  const allowedHosts = ['.trycloudflare.com', '.ngrok-free.app']

  return {
    plugins: [react()],
    server: { proxy, allowedHosts },
    preview: { proxy, allowedHosts },
  }
})
