import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InputPage from './pages/InputPage';
import DetailPage from './pages/DetailPage';
import HistoryPage from './pages/HistoryPage';
import FooterNav from './components/FooterNav';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/input" replace />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/detail/:itemSeq" element={<DetailPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <FooterNav />
    </BrowserRouter>
  );
}

export default App;
