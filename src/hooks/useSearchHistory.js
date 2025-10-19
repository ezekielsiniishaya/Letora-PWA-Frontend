// hooks/useSearchHistory.js
import { useContext } from 'react';
import { SearchHistoryContext } from '../contexts/SearchHistoryContext';

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  
  if (!context) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  
  return context;
};