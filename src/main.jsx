import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/pages.css'
import App from './App'
import { CartProvider } from './context/CartContext'
import { FavouritesProvider } from './context/FavouritesContext'
import { ProductsProvider } from './context/ProductsContext'
import { SessionProvider } from './context/SessionContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <ProductsProvider>
          <CartProvider>
            <FavouritesProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </FavouritesProvider>
          </CartProvider>
        </ProductsProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
