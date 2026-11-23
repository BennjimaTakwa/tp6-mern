import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Étape 4 : le badge lit totalCount dans le store Redux
  const totalCount = useSelector((state) => state.cart.totalCount);

  return (
    <nav className="navbar">
      <h1>TechStore</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
      </button>
      <span className="badge">Panier : {totalCount}</span>
    </nav>
  );
}
