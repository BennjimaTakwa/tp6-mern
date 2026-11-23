import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart, applyPromoCode } from '../redux/cartSlice';

export default function Cart() {
  // Étapes 4 et 6 : ces valeurs viennent du store Redux
  const { items, totalPrice, discountPercent } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Défi 2 : le code tapé ne sert qu'ici, un useState suffit
  const [code, setCode] = useState('');
  const finalPrice = totalPrice - (totalPrice * discountPercent) / 100;

  return (
    <section className="card">
      <h2>Mon panier</h2>
      {items.length === 0 && <p className="vide">Le panier est vide.</p>}

      {items.map((item) => (
        <div key={item.id} className="ligne">
          <span>{item.name} <span className="prix">x {item.quantity}</span></span>
          <span>
            {/* Étape 7 : ces boutons envoient des actions au store */}
            <button onClick={() => dispatch(removeItem(item.id))}>-</button>
            <button onClick={() => dispatch(addItem(item))}>+</button>
          </span>
        </div>
      ))}

      <p className="total">Total : {totalPrice} DT</p>

      {/* Défi 2 : code promo */}
      <p>
        <input
          type="text"
          placeholder="Code promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--bord)' }}
        />
        <button onClick={() => dispatch(applyPromoCode(code))}>Appliquer</button>
      </p>
      {discountPercent > 0 && (
        <p className="remise">Après remise de {discountPercent} % : {finalPrice} DT</p>
      )}

      <button onClick={() => dispatch(clearCart())}>Vider le panier</button>
    </section>
  );
}
