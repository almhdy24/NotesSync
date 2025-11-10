import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar position-relative">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search notes..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button
            className="btn btn-outline-secondary border-start-0"
            type="button"
            onClick={clearSearch}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
    </div>
  );
}