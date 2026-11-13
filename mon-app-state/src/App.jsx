import React from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-layout">
        <ProductList />
        <Cart />
      </main>
    </div>
  );
}
