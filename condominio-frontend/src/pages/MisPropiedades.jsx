import React, { useState, useEffect } from 'react';
import { authAPI, residentesAPI } from '../services/api.jsx';

const MisPropiedades = () => {
  const [userData, setUserData] = useState({ nombre: '', apellido: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        
        // First try to get from localStorage directly
        if (storedUser?.nombre || storedUser?.name) {
          if (alive) {
            setUserData({
              nombre: storedUser.nombre || storedUser.name || '',
              apellido: storedUser.apellido || '',
            });
            setLoading(false);
          }
          return;
        }

        // Try API
        let refreshedUser = null;
        try {
          const me = await authAPI.me();
          refreshedUser = me?.data?.user || me?.data || null;
        } catch (e) {
          console.log('API me failed, trying storedUser');
        }

        const residentId = refreshedUser?.idResidente || storedUser?.idResidente;
        let r = null;

        if (refreshedUser?.residente) {
          r = refreshedUser.residente;
        } else if (residentId) {
          try {
            const res = await residentesAPI.getById(residentId);
            r = res?.data || null;
          } catch (e) {
            console.log('residentesAPI.getById failed');
          }
        }

        if (alive && r) {
          setUserData({
            nombre: r.nombre || '',
            apellido: r.apellido || '',
          });
        } else if (alive && storedUser) {
          setUserData({
            nombre: storedUser.nombre || storedUser.name || '',
            apellido: storedUser.apellido || '',
          });
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadUser();
    return () => { alive = false; };
  }, []);

  const nombreCompleto = [userData.nombre, userData.apellido].filter(Boolean).join(' ');

  return (
    <div style={{ padding: '20px' }}>
      <h1>¡Bienvenido{nombreCompleto ? `, ${nombreCompleto}` : ''}!</h1>
      <p>Esta es tu página de propiedades personalizada.</p>
    </div>
  );
};

export default MisPropiedades;