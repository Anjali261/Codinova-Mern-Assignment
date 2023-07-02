import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';

const ExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await axios.get('/exchange-list');
        setExchanges(response.data);
      } catch (err) {
        console.error('Error fetching exchange list:', err);
      }
    };

    fetchExchanges();
  }, []);

  return (
    <div>
      <h1>Exchange List</h1>
      <ul>
        {exchanges.map((exchange) => (
          <li key={exchange._id}>
            <img src={exchange.iconUrl} alt={exchange.name} />
            <span>{exchange.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/exchanges">Exchanges</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route exact path="/" element={<h1>Welcome to the Crypto App!</h1>} />
        <Route path="/exchanges" element={<ExchangeList />} />
      </Routes>
    </Router>
  );
};

export default App;
