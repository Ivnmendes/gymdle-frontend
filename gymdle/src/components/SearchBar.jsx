import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ allExercises, onGuess, isDisabled }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSelect(suggestions[0]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = allExercises.filter((ex) =>
        ex.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (exercise) => {
    onGuess(exercise.exerciseId);
    setQuery('');
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          disabled={isDisabled}
          className={`w-full pl-10 pr-10 p-4 border-2 border-gray-700 rounded-xl bg-gray-900/90 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all shadow-xl ${
            isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-900/60' : ''
          }`}
          placeholder={isDisabled ? "Jogo finalizado." : "Digite o nome do exercício..."}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
             if (query.length > 0 && suggestions.length === 0) {
                 handleInputChange({ target: { value: query } });
             }
          }}
        />
        
        {query.length > 0 && (
          <button 
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none text-gray-400 hover:text-yellow-500"
            aria-label="Limpar pesquisa"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-gray-900">
          {suggestions.map((ex) => (
            <li
              key={ex.exerciseId}
              onClick={() => handleSelect(ex)}
              className="p-2 text-white cursor-pointer hover:bg-yellow-600/80 transition-colors border-b border-gray-700/50 last:border-none flex items-center space-x-3"
            >
              <img 
                src={ex.gifUrl} 
                alt={ex.name} 
                className="bg-gray-800 p-0.5 rounded-lg w-12 h-12 object-cover flex-shrink-0" 
              />
              <div className="font-semibold capitalize text-sm truncate flex-grow text-left"> 
                {ex.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;