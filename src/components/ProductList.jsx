import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { showToast } from '../redux/uiSlice';
import { products } from '../data/products';

export default function ProductList() {
  const dispatch = useDispatch();

  const handleAdd = (product) => {
    dispatch(addItem(product));
    // Défi 3 : notification verte pendant 3 secondes
    dispatch(showToast(`${product.name} ajouté au panier`));
  };

  return (
    <section className="card">
      <h2>Catalogue</h2>
      {products.map((product) => (
        <div key={product.id} className="ligne">
          <span>{product.name} <span className="prix">{product.price} DT</span></span>
          {/* Étape 5 : le bouton envoie l'action addItem au store */}
          <button className="principal" onClick={() => handleAdd(product)}>+ Ajouter</button>
        </div>
      ))}
    </section>
  );
}
