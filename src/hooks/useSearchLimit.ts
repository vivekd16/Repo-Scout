import { useState, useEffect } from 'react';

const SEARCH_LIMIT = 5;
const SEARCH_COUNT_KEY = 'searchCount';

export const useSearchLimit = () => {
  const [searchCount, setSearchCount] = useState(0);

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
  };

  const resetSearchCount = () => {
    setSearchCount(0);
    localStorage.removeItem(SEARCH_COUNT_KEY);
  };

  return {
    searchCount,
    incrementSearchCount,
    resetSearchCount,
    isSearchLimitReached: false
  };
}; 