import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/footer";

import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Payments from "./pages/Payments";
import UnidadesHabitacionales from "./pages/UnidadesHabitacionales";
import Empleados from "./pages/Empleados";
import Facturas from "./pages/facturas";
import Comunicacion from "./pages/comunicacion";

function App() {
  return (
    <Router>
      {/* Navbar siempre visible */}
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/units" element={<UnidadesHabitacionales />} />
          <Route path="/employees" element={<Empleados />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/comunicacion" element={<Comunicacion />} />
        </Routes>
      </Container>

      {/* Footer siempre visible */}
      <Footer />
    </Router>
  );
}

export default App;
