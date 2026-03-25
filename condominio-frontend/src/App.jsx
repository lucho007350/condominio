import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/Layout/Navbar";

import Login from "./pages/login";
import Inicio from "./pages/inicio";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Payments from "./pages/Payments";
import UnidadesHabitacionales from "./pages/UnidadesHabitacionales";
import Empleados from "./pages/Empleados";
import Facturas from "./pages/facturas";
import MyPays from "./pages/MyPays";
import Perfil from "./pages/profile";
import Comunicacion from "./pages/comunicacion";
import Propietarios from "./pages/Propietarios";
import PQRS from "./pages/PQRS";
import AdminPQRS from "./pages/AdminPQRS";
import Register from './pages/Register';


const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  if (!user || !user.username) {
    return <Navigate to="/login" />;
  }
  return <MainLayout>{children}</MainLayout>;
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

        {/* Registro público (sin sesión) */}
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas con MainLayout */}
        <Route path="/inicio" element={
          <PrivateRoute>
            <Inicio />
          </PrivateRoute>
        } />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/residents" element={
          <PrivateRoute>
            <Residents />
          </PrivateRoute>
        } />
        
        <Route path="/payments" element={
          <PrivateRoute>
            <Payments />
          </PrivateRoute>
        } />
        
        <Route path="/units" element={
          <PrivateRoute>
            <UnidadesHabitacionales />
          </PrivateRoute>
        } />
        
        <Route path="/employees" element={
          <PrivateRoute>
            <Empleados />
          </PrivateRoute>
        } />
        
        <Route path="/facturas" element={
          <PrivateRoute>
            <Facturas />
          </PrivateRoute>
        } />
        
        <Route path="/comunicacion" element={
          <PrivateRoute>
            <Comunicacion />
          </PrivateRoute>
        } />
        
        <Route path="/perfil" element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } />
        
        <Route path="/mis-pagos" element={
          <PrivateRoute>
            <MyPays />
          </PrivateRoute>
        } />

        <Route path="/pqrs" element={
          <PrivateRoute>
            <PQRS />
          </PrivateRoute>
        } />
        <Route path="/mis-propiedades" element={
          <PrivateRoute>
            <Propietarios />
          </PrivateRoute>
        } />

        <Route path="/admin/register" element={
          <PrivateRoute>
            <Register />
          </PrivateRoute>
        } />

        <Route path="/admin/pqrs" element={
          <PrivateRoute>
            <AdminPQRS />
          </PrivateRoute>
        } />

        
        
        {/* Mantén también las rutas en inglés por si acaso (opcional) */}
        <Route path="/profile" element={<Navigate to="/perfil" />} />
        <Route path="/mypays" element={<Navigate to="/mis-pagos" />} />
        <Route path="/pqr" element={<Navigate to="/pqrs" />} />

        
        {/* Redirigir ruta raíz según sesión y rol */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Ruta para cualquier otra URL no definida */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
