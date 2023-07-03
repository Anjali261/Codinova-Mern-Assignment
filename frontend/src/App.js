import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API } from './backend';
import './App.css';

const ExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exchangesPerPage] = useState(10);

  // Get the current URL query parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageParam = params.get('page');
  const searchParam = params.get('search');

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await axios.get(`${API}/exchange-list`);
        setExchanges(response.data);
      } catch (err) {
        console.error('Error fetching exchange list:', err);
      }
    };

    fetchExchanges();
  }, []);

  useEffect(() => {
    // Apply search filter
    const filtered = exchanges.filter((exchange) =>
      exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update filtered exchanges
    setFilteredExchanges(filtered);
  }, [exchanges, searchTerm]);

  useEffect(() => {
    // Update search term based on URL query parameter
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    // Update current page based on URL query parameter
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);
  }, [pageParam]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Update URL query parameter
    const searchQuery = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
    window.history.pushState({}, '', `/exchanges${searchQuery}`);
  };

  // Get current exchanges for pagination
  const indexOfLastExchange = currentPage * exchangesPerPage;
  const indexOfFirstExchange = indexOfLastExchange - exchangesPerPage;
  const currentExchanges = filteredExchanges.slice(indexOfFirstExchange, indexOfLastExchange);

  // Change page
  const paginate = (pageNumber) => {
    // Update URL query parameter
    window.history.pushState({}, '', `/exchanges?page=${pageNumber}`);
    setCurrentPage(pageNumber);
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredExchanges.length / exchangesPerPage)) {
      paginate(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  return (
    <div className="exchange-list-container">
      <h1 className="exchange-list-heading">Exchange List</h1>

      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search exchanges"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <ol className="exchange-list">
        {currentExchanges.map((exchange, index) => (
          <li key={exchange._id} className="exchange-item">
            <span className="exchange-number">{index + 1}</span>
            <img src={exchange.icon} alt={exchange.name} className="exchange-icon" />
            <span>{exchange.name}</span>
          </li>
        ))}
      </ol>

      <div className="pagination">
        {/* Previous Button */}
        <button
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <ul className="pagination-list">
          {Array.from({ length: Math.ceil(filteredExchanges.length / exchangesPerPage) })
            .map((_, index) => index + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === currentPage ||
                page === currentPage + 1 ||
                page === currentPage - 1
            )
            .map((page) => (
              <li key={page} className="pagination-item">
                <button
                  onClick={() => paginate(page)}
                  className={`pagination-button ${
                    currentPage === page ? 'active' : ''
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
        </ul>

        {/* Next Button */}
        {currentPage < Math.ceil(filteredExchanges.length / exchangesPerPage) && (
          <button className="pagination-button" onClick={nextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/exchanges" className="navbar-link">
              Exchanges
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route
          exact
          path="/"
          element={
            <h1 style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
              Welcome to the Crypto App! <br></br> Made by: <b>Anjali Kumari</b>
            </h1>
          }
        />
        <Route path="/exchanges" element={<ExchangeList />} />
      </Routes>
    </Router>
  );
};

export default App;
