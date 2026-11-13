import React, { useState, useEffect } from 'react';

// Challenge 1: threshold bounds
const MAX = 50;
const MIN = -50;

export default function Counter() {
  // Step 5: initialize count from localStorage (or fallback to 0)
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('mon_compteur_valeur');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('No clicks yet');
  const [totalClics, setTotalClics] = useState(0);
  // Challenge 2: restore history from localStorage (JSON.parse)
  const [historique, setHistorique] = useState(() => {
    const saved = localStorage.getItem('mon_compteur_historique');
    return saved !== null ? JSON.parse(saved) : [];
  });
  const [warning, setWarning] = useState('');

  // Increment handler (with upper-bound guard)
  const handleIncrement = () => {
    const nouveauCompte = count + step;
    if (nouveauCompte > MAX) {
      setWarning('Maximum threshold of 50 reached!');
      return;
    }
    setWarning('');
    setCount(nouveauCompte);
    setMessage('Added ' + step);
    setTotalClics(totalClics + 1);
    const action = '+' + step;
    setHistorique([...historique, action]);
  };

  // Decrement handler (with lower-bound guard)
  const handleDecrement = () => {
    const nouveauCompte = count - step;
    if (nouveauCompte < MIN) {
      setWarning('Minimum threshold of -50 reached!');
      return;
    }
    setWarning('');
    setCount(nouveauCompte);
    setMessage('Subtracted ' + step);
    setTotalClics(totalClics + 1);
    const action = '-' + step;
    setHistorique([...historique, action]);
  };

  // Reset handler
  const handleReset = () => {
    setWarning('');
    setCount(0);
    setMessage('Reset to zero');
    setTotalClics(totalClics + 1);
    setHistorique([]);
  };

  // EFFECT A: synchronize browser tab title
  useEffect(() => {
    document.title = 'Counter: ' + count;
  }, [count]);

  // EFFECT B: persist count to localStorage
  useEffect(() => {
    localStorage.setItem('mon_compteur_valeur', count.toString());
  }, [count]);

  // Challenge 2: persist history to localStorage (JSON.stringify)
  useEffect(() => {
    localStorage.setItem('mon_compteur_historique', JSON.stringify(historique));
  }, [historique]);

  // Challenge 3: keyboard control with cleanup.
  // The handlers read the current state, so the listener is re-attached
  // whenever that state changes (the cleanup removes the previous one first).
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [count, step, totalClics, historique]);

  // Dynamic styling based on counter sign
  const getStyleClass = () => {
    if (count > 0) return 'counter-display positive';
    if (count < 0) return 'counter-display negative';
    return 'counter-display zero';
  };

  return (
    <div className="counter-card">
      <div className={getStyleClass()}>{count}</div>

      <div className="btn-group">
        <button
          className="btn btn-dec"
          onClick={handleDecrement}
          disabled={count - step < MIN}
        >
          -{step}
        </button>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
        <button
          className="btn btn-inc"
          onClick={handleIncrement}
          disabled={count + step > MAX}
        >
          +{step}
        </button>
      </div>

      {warning && <p className="warning">{warning}</p>}

      <div className="step-control">
        <label>Increment Step: </label>
        <select value={step} onChange={(e) => setStep(parseInt(e.target.value, 10))}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="history-card">
        <p>
          <strong>Last Action:</strong> {message}
        </p>
        <p>
          <strong>Total Clicks:</strong> {totalClics}
        </p>
        {historique.length > 0 && (
          <p>
            <strong>History:</strong> {historique.join(', ')}
          </p>
        )}
        <small className="hint">Tip: use the ↑ / ↓ arrow keys to control the counter.</small>
      </div>
    </div>
  );
}
