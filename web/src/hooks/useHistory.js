import { useState, useEffect } from 'react';

const STORAGE_KEY = 'serein_history';
const MAX_ITEMS = 10;

function useHistory() {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Add a new entry to history
  const addToHistory = (result) => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: result.type || 'url',
      url: result.url || null,
      title: result.title || null,
      textLength: result.textLength || null,
      imageCount: result.imageCount || null,
      verdict: result.analysis?.verdict || 'prudence',
      confidence: result.analysis?.confidence_score || 50,
      summary: result.analysis?.summary || '',
      analysis: result.analysis
    };

    const newHistory = [entry, ...history].slice(0, MAX_ITEMS);
    saveHistory(newHistory);
  };

  // Get all history entries
  const getHistory = () => {
    return history;
  };

  // Clear all history
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  // Get a specific entry by id
  const getEntry = (id) => {
    return history.find(entry => entry.id === id);
  };

  return {
    history,
    addToHistory,
    getHistory,
    clearHistory,
    getEntry
  };
}

export default useHistory;
