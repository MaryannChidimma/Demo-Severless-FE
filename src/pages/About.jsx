import Button from '../components/Button'
import { usePageTitle } from '../hooks/usePageTitle'

export default function About() {
  usePageTitle('About')

  return (
    <div className="container page">
      <article className="prose">
        <h1>About DEPOT</h1>
        <p>
          DEPOT is a small store for well-made everyday things: technology that stays out of the way, furniture and
          lighting for the home, clothes, books and a few essentials for looking after yourself.
        </p>
        <p>
          We keep the range short on purpose. If something is in the shop, it is there because it does its job well and
          should keep doing it for a long time.
        </p>

        <h2 id="delivery">Delivery and returns</h2>
        <p>
          Shipping is free on every order, and you pay when your order arrives. If something isn't right, you can return
          it within 30 days.
        </p>

        <h2>How this store is built</h2>
        <p>
          DEPOT is a university project in distributed systems. This storefront is a React application that talks to
          three independent Spring Boot services — one for customers, one for products and one for carts and orders —
          each with its own database.
        </p>

        <Button to="/shop" size="lg">
          Browse the shop
        </Button>
      </article>
    </div>
  )
}
