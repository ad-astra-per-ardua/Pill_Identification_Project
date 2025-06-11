import React, { createContext, useState } from 'react';

export const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const addDrug = drug => setHistory(h=>[...h, drug]);
  return (
    <HistoryContext.Provider value={{ history, addDrug }}>
      {children}
    </HistoryContext.Provider>
  );
}
