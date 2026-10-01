import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import AccountLayout from './layouts/AccountLayout'
import AppLayout from './layouts/AppLayout'
import About from './pages/About'
import Account from './pages/Account'
import Address from './pages/Address'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favourites from './pages/Favourites'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import ProductDetails from './pages/ProductDetails'
import Settings from './pages/Settings'
import Shop from './pages/Shop'
import SignIn from './pages/SignIn'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="about" element={<About />} />
        <Route path="signin" element={<SignIn />} />

        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:id" element={<OrderConfirmation />} />
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<Account />} />
            <Route path="orders" element={<Orders />} />
            <Route path="address" element={<Address />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
