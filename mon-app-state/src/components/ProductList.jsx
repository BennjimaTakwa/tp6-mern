import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/cartSlice';

// Challenge 3: each product has a maximum stock of 3
const PRODUCTS = [
  { id: 1, name: 'Ecran UltraWide 4K 34"', price: 850, category: 'Display', icon: '[Screen]', stock: 3 },
  { id: 2, name: 'Clavier Mecanique RGB', price: 180, category: 'Peripheral', icon: '[Keyboard]', stock: 3 },
  { id: 3, name: 'Souris Sans Fil Ergonomique', price: 95, category: 'Accessory', icon: '[Mouse]', stock: 3 },
  { id: 4, name: 'Casque Haute Fidelite ANC', price: 320, category: 'Audio', icon: '[Audio]', stock: 3 },
];

function ProductCard({ product }) {
  const dispatch = useDispatch();
  // Targeted selector: only this product's quantity in the cart
  const quantityInCart = useSelector(
    (state) => state.cart.items.find((item) => item.id === product.id)?.quantity ?? 0
  );
  const outOfStock = quantityInCart >= product.stock;

  return (
    <div className={`product-card${outOfStock ? ' is-out' : ''}`}>
      <div className="card-top">
        <span className="product-icon">{product.icon}</span>
        {outOfStock ? (
          <span className="badge-out">Out of Stock</span>
        ) : (
          <span className="product-category">{product.category}</span>
        )}
      </div>
      <h4 className="product-title">{product.name}</h4>
      <span className="stock-info">
        In cart: {quantityInCart} / {product.stock}
      </span>
      <div className="card-bottom">
        <span className="product-price">{product.price} DT</span>
        <button
          className="btn btn-add"
          onClick={() => dispatch(addItem(product))}
          disabled={outOfStock}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function ProductList() {
  return (
    <div className="product-section">
      <div className="section-title-box">
        <h3>Product Catalog</h3>
        <p className="subtitle-hint">Clicking + Add triggers dispatch(addItem(product)).</p>
      </div>
      <div className="product-grid">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
