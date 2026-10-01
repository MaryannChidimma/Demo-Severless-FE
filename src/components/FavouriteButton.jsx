import { useFavourites } from '../context/FavouritesContext'
import Icon from './Icon'

export default function FavouriteButton({ product, className = '' }) {
  const { has, toggle } = useFavourites()
  const saved = has(product.id)

  return (
    <button
      type="button"
      className={`fav-btn${saved ? ' is-saved' : ''} ${className}`.trim()}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
      onClick={() => toggle(product.id)}
    >
      <Icon name="heart" size={18} filled={saved} />
    </button>
  )
}
