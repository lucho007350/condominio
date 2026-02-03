import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/footer";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Payments from "./pages/Payments";
import UnidadesHabitacionales from "./pages/UnidadesHabitacionales";
import Empleados from "./pages/Empleados";
import Facturas from "./pages/facturas";
import Comunicacion from "./pages/comunicacion";

import { isAuthenticated } from "./services/auth";

function App() {
  const auth = isAuthenticated();

  return (
    <Router>
      {/* 🔒 Navbar solo si está autenticado */}
      {auth && <Navbar />}

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {!auth ? (
            /* 🚫 Usuario NO logueado → Login */
            <Route path="*" element={<Login />} />
          ) : (
            /* ✅ Usuario logueado → Sistema */
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/units" element={<UnidadesHabitacionales />} />
              <Route path="/employees" element={<Empleados />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/comunicacion" element={<Comunicacion />} />
            </>
          )}
        </Routes>
      </Container>

      {/* 🔒 Footer solo si está autenticado */}
      {auth && <Footer />}
    </Router>
  );
}

export default App;
