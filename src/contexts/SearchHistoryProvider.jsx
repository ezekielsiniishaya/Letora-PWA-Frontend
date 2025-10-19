// contexts/SearchHistoryProvider.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SearchHistoryContext } from './SearchHistoryContext';
import { UserContext } from './UserContext';

const SearchHistoryProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const { user } = useContext(UserContext);

  // Move getStorageKey inside useCallback to memoize it
  const getStorageKey = useCallback(() => {
    const userId = user?.id || 'anonymous';
    return `apartmentSearchHistory_${userId}`;
  }, [user?.id]);

  // Load from localStorage on mount or when user changes
  useEffect(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading search history:', error);
        setSearchHistory([]);
      }
    } else {
      setSearchHistory([]);
    }
  }, [getStorageKey]);

  // Save to localStorage whenever searchHistory changes
  useEffect(() => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(searchHistory));
  }, [searchHistory, getStorageKey]);

  // Add search results to history
  const addSearchResults = (searchTerm, apartments) => {
    if (!searchTerm.trim() || !apartments || apartments.length === 0) return;

    const newSearch = {
      id: Date.now(), // Unique ID for this search session
      searchTerm: searchTerm.trim(),
      apartments: apartments, // Store the actual apartment results
      timestamp: new Date().toISOString(),
      resultCount: apartments.length
    };

    setSearchHistory(prev => {
      // Remove duplicates (same search term) and keep only last 5 searches
      const filtered = prev.filter(item => 
        item.searchTerm?.toLowerCase() !== searchTerm.toLowerCase()
      );
      return [newSearch, ...filtered].slice(0, 5);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (historyId) => {
    setSearchHistory(prev => prev.filter(item => item.id !== historyId));
  };

  const value = {
    searchHistory,
    addSearchResults,
    clearSearchHistory,
    removeFromHistory,
  };

  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export default SearchHistoryProvider;