import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

const SEARCH_LIMIT = 5;
const SEARCH_COUNT_KEY = 'searchCount';

export const useSearchLimit = () => {
  const [searchCount, setSearchCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const savedCount = localStorage.getItem(SEARCH_COUNT_KEY);
    if (savedCount) {
      setSearchCount(parseInt(savedCount, 10));
    }
  }, []);

  const incrementSearchCount = () => {
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    localStorage.setItem(SEARCH_COUNT_KEY, newCount.toString());

    if (newCount >= SEARCH_LIMIT && !user) {
      setShowAuthModal(true);
    }
  };

  const resetSearchCount = () => {
    setSearchCount(0);
    localStorage.removeItem(SEARCH_COUNT_KEY);
  };

  return {
    searchCount,
    showAuthModal,
    setShowAuthModal,
    incrementSearchCount,
    resetSearchCount,
    isSearchLimitReached: searchCount >= SEARCH_LIMIT && !user
  };
}; 