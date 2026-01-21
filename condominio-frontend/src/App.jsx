import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Payments from './pages/Payments';
import UnidadesHabitacionales from './pages/UnidadesHabitacionales';


import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/units" element={<UnidadesHabitacionales />} />

          
        </Routes>
      </Container>
    </Router>
  );
}

export default App;