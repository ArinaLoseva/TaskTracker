import React from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import NotesPage from './pages/NotesPage';
import { Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  return (
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notespage" element={<NotesPage />} />
      </Routes>
  );
};

export default App;
