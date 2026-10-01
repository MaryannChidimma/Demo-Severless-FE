import { Link } from 'react-router-dom'
import { categoryLink } from '../utils/catalog'
import ProductImage from './ProductImage'

export default function CategoryCard({ category }) {
  return (
    <Link to={categoryLink(category.name)} className="category-card">
      <ProductImage src={category.imageUrl} alt="" className="category-card__image" />
      <span className="category-card__name">{category.name}</span>
    </Link>
  )
}
