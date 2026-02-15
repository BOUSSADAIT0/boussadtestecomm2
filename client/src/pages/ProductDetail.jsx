import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      alert(`${quantity} ${product.name} ajouté(s) au panier !`);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produit non trouvé</h2>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  // Créer un tableau d'images (pour l'instant une seule, mais prêt pour plusieurs)
  const images = product.image ? [product.image] : [];

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            {images.length > 0 ? (
              <img src={images[selectedImageIndex]} alt={product.name} />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImageIndex === index ? 'active' : ''}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            {product.category && (
              <span className="product-category">{product.category.name}</span>
            )}
            <h1 className="product-title">{product.name}</h1>
          </div>

          <div className="product-price">
            <span className="price">{product.price.toFixed(2)} €</span>
            {product.stock > 0 ? (
              <span className="stock in-stock">En stock ({product.stock} disponibles)</span>
            ) : (
              <span className="stock out-of-stock">Rupture de stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="product-reviews-summary">
              <h3>Avis clients</h3>
              <div className="reviews-stats">
                <span className="rating">
                  ⭐ {(
                    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                  ).toFixed(1)}
                </span>
                <span className="reviews-count">
                  ({product.reviews.length} avis)
                </span>
              </div>
            </div>
          )}

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantité :</label>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
                    setQuantity(val);
                  }}
                  className="quantity-input"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="add-to-cart-btn-large"
            >
              {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="product-reviews">
          <h2>Avis clients</h2>
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-author">
                    {review.user?.name || review.user?.email || 'Anonyme'}
                  </span>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;

