import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/login";
import Inicio from "./pages/inicio";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Payments from "./pages/Payments";
import UnidadesHabitacionales from "./pages/UnidadesHabitacionales";
import Empleados from "./pages/Empleados";
import Facturas from "./pages/facturas";
import MyPays from "./pages/MyPays";
import Perfil from "./pages/profile"; // Solo una importación
import Comunicacion from "./pages/comunicacion";
import Propietarios from "./pages/Propietarios";

// Componente para Layout con Navbar y Footer
const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  
  // Si no hay usuario, redirigir al login
  if (!user || !user.username) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 128px)' }}>
        {children}
      </Container>
      <Footer />
    </>
  );
};

const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  if (!user || !user.username) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.role === 'propietario') {
    return <Navigate to="/mis-propiedades" replace />;
  }

  return <Navigate to="/inicio" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta Login - SIN protección */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas con Layout - Nombres en ESPAÑOL como en el Navbar */}
        <Route path="/inicio" element={
          <Layout>
            <Inicio />
          </Layout>
        } />
        
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        
        <Route path="/residents" element={
          <Layout>
            <Residents />
          </Layout>
        } />
        
        <Route path="/payments" element={
          <Layout>
            <Payments />
          </Layout>
        } />
        
        <Route path="/units" element={
          <Layout>
            <UnidadesHabitacionales />
          </Layout>
        } />
        
        <Route path="/employees" element={
          <Layout>
            <Empleados />
          </Layout>
        } />
        
        <Route path="/facturas" element={
          <Layout>
            <Facturas />
          </Layout>
        } />
        
        <Route path="/comunicacion" element={
          <Layout>
            <Comunicacion />
          </Layout>
        } />
        
        {/* Rutas en ESPAÑOL para usuarios - ¡ESTAS SON LAS QUE FALTABAN! */}
        <Route path="/perfil" element={  // Cambiado de "/profile" a "/perfil"
          <Layout>
            <Perfil />
          </Layout>
        } />
        
        <Route path="/mis-pagos" element={  // Cambiado de "/mypays" a "/mis-pagos"
          <Layout>
            <MyPays />
          </Layout>
        } />
        <Route path="/mis-propiedades" element={  // Cambiado de "/mypays" a "/mis-pagos"
          <Layout>
            <Propietarios />
          </Layout>
        } />
        
        {/* Mantén también las rutas en inglés por si acaso (opcional) */}
        <Route path="/profile" element={<Navigate to="/perfil" />} />
        <Route path="/mypays" element={<Navigate to="/mis-pagos" />} />
        
        {/* Redirigir ruta raíz según sesión y rol */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Ruta para cualquier otra URL no definida */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
