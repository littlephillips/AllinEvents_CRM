import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CRM from './pages/CRM';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/crm/*" element={<CRM />} />
        {/* Redirect root to CRM */}
        <Route path="/" element={<Navigate to="/crm" replace />} />
        <Route path="*" element={<Navigate to="/crm" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
