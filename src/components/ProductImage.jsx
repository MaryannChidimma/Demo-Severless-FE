import { useState } from 'react'
import Icon from './Icon'

// Square product image. Products without an image (or with a broken URL)
// get a neutral placeholder instead of a broken-image icon.
export default function ProductImage({ src, alt, eager = false, className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div className={`product-image ${className}`.trim()}>
      {showImage ? (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span className="product-image__placeholder" role="img" aria-label={`${alt} (no image available)`}>
          <Icon name="image" size={28} />
        </span>
      )}
    </div>
  )
}
