import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useSelector } from 'react-redux';

export default function Navbar() {
  // Lightweight UI state via useContext
  const { theme, toggleTheme } = useContext(ThemeContext);
  // Targeted Redux state via useSelector
  const totalCount = useSelector((state) => state.cart.totalCount);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-icon">*</span>
        <h2>
          TechStore <span className="badge-mern">MERN S6</span>
        </h2>
      </div>
      <div className="nav-actions">
        <button className="btn-theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <div className="cart-badge">
          <span className="cart-icon">[Cart]</span>
          <span className="badge-count">{totalCount}</span>
        </div>
      </div>
    </nav>
  );
}
